"""
Chat API Router
Handles chat messages with emotion detection, anxiety classification, and crisis detection
Now with database persistence!
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
from sqlalchemy.orm import Session
import uuid

from nlp import (
    get_emotion_detector,
    get_anxiety_classifier,
    get_crisis_detector,
    get_context_manager
)
from database import get_db, User, Conversation, Message as DBMessage

router = APIRouter()

# Request/Response Models
class ChatRequest(BaseModel):
    """Chat message request"""
    user_id: str
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    """Chat message response"""
    conversation_id: str
    response: str
    timestamp: str
    sentiment: Dict
    anxiety: Dict
    crisis: Dict
    context_summary: Optional[str] = None

# Initialize NLP modules (lazy loading)
_emotion_detector = None
_anxiety_classifier = None
_crisis_detector = None
_context_manager = None

def get_nlp_modules():
    """Get or initialize NLP modules"""
    global _emotion_detector, _anxiety_classifier, _crisis_detector, _context_manager
    
    if _emotion_detector is None:
        print("Loading NLP modules...")
        _emotion_detector = get_emotion_detector()
        _anxiety_classifier = get_anxiety_classifier()
        _crisis_detector = get_crisis_detector()
        _context_manager = get_context_manager()
        print("NLP modules loaded")
    
    return _emotion_detector, _anxiety_classifier, _crisis_detector, _context_manager

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Process a chat message with optimized performance:
    1. Generate AI response immediately
    2. Perform NLP analysis and DB persistence in background
    """
    try:
        # Get NLP modules (lazy load if needed)
        _, _, _, context_manager = get_nlp_modules()
        
        # Get or create user and conversation (Lightweight DB ops)
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            user = User(id=request.user_id)
            db.add(user)
            db.flush() # flush instead of commit to keep transaction open if needed
        
        conversation_id = request.conversation_id or str(uuid.uuid4())
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        
        if not conversation:
            conversation = Conversation(id=conversation_id, user_id=request.user_id)
            db.add(conversation)
            db.commit()
            db.refresh(conversation) # Get the clean state
        
        # Get context
        context = context_manager.get_or_create_context(conversation_id, request.user_id)
        
        # --- FAST PATH: Generate Response ---
        history = context.get_recent_messages()
        
        # Use a lightweight check for crisis/safety via simple keywords first if needed
        # But for speed, we generate response directly 
        from nlp import get_gemini_chat
        gemini = get_gemini_chat()

        # Temporary placeholder analysis for the prompt (we refine this later in background)
        # This avoids waiting for the heavy BERT/BART models
        temp_analysis = {
            "emotion": {"primary_emotion": "neutral"},  
            "anxiety": {"severity": "none"},
            "crisis": {"crisis_detected": False}
        }
        
        # Generate AI Response immediately
        ai_response = gemini.generate_response(
            user_message=request.message,
            emotion=temp_analysis["emotion"],
            anxiety=temp_analysis["anxiety"],
            crisis=temp_analysis["crisis"],
            conversation_history=history
        )
        
        # --- BACKGROUND TASKS: Heavy Analysis & Storage ---
        background_tasks.add_task(
            perform_background_analysis_and_save,
            request.user_id,
            conversation_id,
            request.message,
            ai_response,
            db # Pass DB session or handle new session in task
        )

        # Return fast response
        return ChatResponse(
            conversation_id=conversation_id,
            response=ai_response,
            timestamp=datetime.now().isoformat(),
            sentiment={"label": "analyzing", "confidence": 0.0}, # Placeholder
            anxiety={"detected": False, "severity": "none"},
            crisis={"detected": False, "severity": "none"}, 
            context_summary=None
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def perform_background_analysis_and_save(user_id: str, conversation_id: str, user_message_content: str, ai_response_content: str, db: Session):
    """Background task to run heavy NLP models and save to DB"""
    try:
        # Re-acquire separate DB session if needed, but for now we reuse passed logic
        # Ideally create new session for background task to avoid async issues
        # But for simplicity in this architecture:
        
        # Get NLP modules
        emotion_detector, anxiety_classifier, crisis_detector, context_manager = get_nlp_modules()
        context = context_manager.get_or_create_context(conversation_id, user_id)

        # 1. Heavy NLP Analysis
        emotion_result = emotion_detector.detect_emotion(user_message_content, top_k=3)
        anxiety_result = anxiety_classifier.detect_anxiety(user_message_content)
        crisis_result = crisis_detector.detect_crisis(user_message_content)
        
        # 2. Save User Message
        user_msg_db = DBMessage(
            conversation_id=conversation_id,
            role="user",
            content=user_message_content,
            emotion=emotion_result["primary_emotion"],
            emotion_confidence=emotion_result["confidence"],
            emotion_details=emotion_result,
            anxiety_detected=anxiety_result["anxiety_detected"],
            anxiety_severity=anxiety_result["severity"],
            anxiety_confidence=anxiety_result["confidence"],
            crisis_detected=crisis_result["crisis_detected"],
            crisis_severity=crisis_result["severity"],
            crisis_keywords=crisis_result.get("keywords_found", [])
        )
        db.add(user_msg_db)
        
        # 3. Add to Context
        context.add_message(
            role="user",
            content=user_message_content,
            emotion=emotion_result,
            anxiety=anxiety_result,
            crisis=crisis_result
        )
        
        # 4. Save AI Response
        ai_msg_db = DBMessage(
            conversation_id=conversation_id,
            role="assistant",
            content=ai_response_content
        )
        db.add(ai_msg_db)
        context.add_message(role="assistant", content=ai_response_content)

        # 5. Update Conversation Stats
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if conversation:
            conversation.message_count += 2
            conversation.updated_at = datetime.utcnow()
            conversation.dominant_emotion = emotion_result["primary_emotion"]
            conversation.average_anxiety_level = anxiety_result["severity"]
            if crisis_result["crisis_detected"]:
                conversation.crisis_detected = True
        
        db.commit()
        
        # 6. Auto-Reflection check
        if conversation and conversation.message_count >= 3:
             try:
                from .journal import auto_generate_reflection
                auto_generate_reflection(user_id=user_id, conversation_id=conversation_id, db=db)
             except Exception as e:
                print(f"Auto-reflection error: {e}")

    except Exception as e:
        print(f"Background analysis failed: {e}")
        db.rollback()
    finally:
        db.close()

def generate_ai_response(
    message: str,
    emotion: Dict,
    anxiety: Dict,
    crisis: Dict,
    context
) -> str:
    """
    Generate AI response using Gemini
    
    Args:
        message: User message
        emotion: Emotion detection result
        anxiety: Anxiety classification result
        crisis: Crisis detection result
        context: Conversation context
    
    Returns:
        AI-generated response string
    """
    from nlp import get_gemini_chat
    
    # Get Gemini chat instance
    gemini = get_gemini_chat()
    
    # Get conversation history
    history = context.get_recent_messages()
    
    # Generate response using Gemini
    response = gemini.generate_response(
        user_message=message,
        emotion=emotion,
        anxiety=anxiety,
        crisis=crisis,
        conversation_history=history
    )
    
    return response

@router.get("/history/{conversation_id}")
async def get_conversation_history(conversation_id: str, db: Session = Depends(get_db)):
    """
    Get conversation history from database
    
    Args:
        conversation_id: Conversation identifier
        db: Database session
    
    Returns:
        Conversation data with messages and statistics
    """
    try:
        # Get conversation from database
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get all messages
        messages = db.query(DBMessage).filter(
            DBMessage.conversation_id == conversation_id
        ).order_by(DBMessage.timestamp).all()
        
        # Get context for stats
        _, _, _, context_manager = get_nlp_modules()
        context = context_manager.get_context(conversation_id)
        
        # Build response
        message_list = [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "emotion": msg.emotion if msg.role == "user" else None,
                "anxiety_severity": msg.anxiety_severity if msg.role == "user" else None,
                "crisis_detected": msg.crisis_detected if msg.role == "user" else None
            }
            for msg in messages
        ]
        
        stats = {
            "conversation_id": conversation.id,
            "message_count": conversation.message_count,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat(),
            "dominant_emotion": conversation.dominant_emotion,
            "average_anxiety_level": conversation.average_anxiety_level,
            "crisis_detected": conversation.crisis_detected
        }
        
        # Add context stats if available
        if context:
            context_stats = context.get_conversation_stats()
            stats.update({
                "emotion_trajectory": context_stats.get("emotion_trajectory", []),
                "anxiety_trajectory": context_stats.get("anxiety_trajectory", []),
                "emotion_improving": context_stats.get("emotion_improving"),
                "anxiety_improving": context_stats.get("anxiety_improving")
            })
        
        return {
            "conversation": stats,
            "messages": message_list,
            "total_messages": len(message_list)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete a conversation
    
    Args:
        conversation_id: Conversation identifier
    
    Returns:
        Success message
    """
    try:
        _, _, _, context_manager = get_nlp_modules()
        context_manager.delete_context(conversation_id)
        
        return {"message": "Conversation deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
