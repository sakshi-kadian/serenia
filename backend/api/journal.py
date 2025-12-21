"""
Journal API Router
Handles AI-generated reflections and journal entries
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session

from database import get_db, Reflection
from journal import get_reflection_generator

router = APIRouter()

# Request/Response Models
class GenerateReflectionRequest(BaseModel):
    """Request to generate a reflection"""
    user_id: str
    conversation_id: str
    user_prompt: Optional[str] = None

class ReflectionResponse(BaseModel):
    """Reflection response"""
    id: str
    ai_generated_text: str
    user_edited_text: Optional[str]
    final_text: str
    emotions_detected: List[str]
    key_insights: List[str]
    topics: List[str]
    user_approved: bool
    is_edited: bool
    created_at: str
    approved_at: Optional[str]

class ApproveReflectionRequest(BaseModel):
    """Request to approve a reflection"""
    reflection_id: str
    edited_text: Optional[str] = None

class EditReflectionRequest(BaseModel):
    """Request to edit a reflection"""
    edited_text: str

@router.post("/generate", response_model=ReflectionResponse)
async def generate_reflection(request: GenerateReflectionRequest, db: Session = Depends(get_db)):
    """
    Generate an AI reflection from a conversation
    
    Args:
        request: Generation request with conversation_id
        db: Database session
    
    Returns:
        Generated reflection
    """
    try:
        # Get reflection generator
        generator = get_reflection_generator()
        
        # Generate reflection
        result = generator.generate_reflection(
            conversation_id=request.conversation_id,
            db=db,
            user_prompt=request.user_prompt
        )
        
        # Create reflection in database
        reflection = Reflection(
            user_id=request.user_id,
            conversation_id=request.conversation_id,
            ai_generated_text=result["reflection_text"],
            final_text=result["reflection_text"],
            emotions_detected=result["emotion_tags"],
            key_insights=result["insights"],
            topics=result["topics"],
            key_moments=result["key_moments"],
            user_approved=False,
            is_edited=False
        )
        
        db.add(reflection)
        db.commit()
        db.refresh(reflection)
        
        return ReflectionResponse(
            id=reflection.id,
            ai_generated_text=reflection.ai_generated_text,
            user_edited_text=reflection.user_edited_text,
            final_text=reflection.final_text,
            emotions_detected=reflection.emotions_detected or [],
            key_insights=reflection.key_insights or [],
            topics=reflection.topics or [],
            user_approved=reflection.user_approved,
            is_edited=reflection.is_edited,
            created_at=reflection.created_at.isoformat(),
            approved_at=reflection.approved_at.isoformat() if reflection.approved_at else None
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        db.rollback()
        print(f"Error generating reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/approve")
async def approve_reflection(request: ApproveReflectionRequest, db: Session = Depends(get_db)):
    """
    Approve a reflection (with optional edits)
    
    Args:
        request: Approval request
        db: Database session
    
    Returns:
        Success message
    """
    try:
        # Get reflection
        reflection = db.query(Reflection).filter(
            Reflection.id == request.reflection_id
        ).first()
        
        if not reflection:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        # Update reflection
        if request.edited_text:
            reflection.user_edited_text = request.edited_text
            reflection.final_text = request.edited_text
            reflection.is_edited = True
        else:
            reflection.final_text = reflection.ai_generated_text
        
        reflection.user_approved = True
        reflection.approved_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "message": "Reflection approved successfully",
            "reflection_id": reflection.id,
            "is_edited": reflection.is_edited
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error approving reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.put("/{reflection_id}/edit")
async def edit_reflection(
    reflection_id: str, 
    request: EditReflectionRequest, 
    db: Session = Depends(get_db)
):
    """
    Edit a reflection
    
    Args:
        reflection_id: Reflection ID
        request: Edit request with new text
        db: Database session
    
    Returns:
        Updated reflection
    """
    try:
        # Get reflection
        reflection = db.query(Reflection).filter(
            Reflection.id == reflection_id
        ).first()
        
        if not reflection:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        # Update reflection
        reflection.user_edited_text = request.edited_text
        reflection.final_text = request.edited_text
        reflection.is_edited = True
        reflection.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(reflection)
        
        return {
            "message": "Reflection updated successfully",
            "reflection_id": reflection.id,
            "final_text": reflection.final_text
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error editing reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{reflection_id}")
async def delete_reflection(reflection_id: str, db: Session = Depends(get_db)):
    """
    Delete a reflection
    
    Args:
        reflection_id: Reflection ID
        db: Database session
    
    Returns:
        Success message
    """
    try:
        # Get reflection
        reflection = db.query(Reflection).filter(
            Reflection.id == reflection_id
        ).first()
        
        if not reflection:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        # Delete reflection
        db.delete(reflection)
        db.commit()
        
        return {
            "message": "Reflection deleted successfully",
            "reflection_id": reflection_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{user_id}", response_model=List[ReflectionResponse])
async def get_user_reflections(
    user_id: str, 
    limit: Optional[int] = 50,
    db: Session = Depends(get_db)
):
    """
    Get all reflections for a user
    
    Args:
        user_id: User ID
        limit: Maximum number of reflections to return
        db: Database session
    
    Returns:
        List of reflections
    """
    try:
        # Get reflections
        reflections = db.query(Reflection).filter(
            Reflection.user_id == user_id
        ).order_by(Reflection.created_at.desc()).limit(limit).all()
        
        return [
            ReflectionResponse(
                id=r.id,
                ai_generated_text=r.ai_generated_text,
                user_edited_text=r.user_edited_text,
                final_text=r.final_text,
                emotions_detected=r.emotions_detected or [],
                key_insights=r.key_insights or [],
                topics=r.topics or [],
                user_approved=r.user_approved,
                is_edited=r.is_edited,
                created_at=r.created_at.isoformat(),
                approved_at=r.approved_at.isoformat() if r.approved_at else None
            )
            for r in reflections
        ]
        
    except Exception as e:
        print(f"Error fetching reflections: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Helper function for auto-generating reflections
def auto_generate_reflection(user_id: str, conversation_id: str, db: Session) -> str:
    """
    Auto-generate a reflection from a conversation (called by chat endpoint)
    
    Args:
        user_id: User ID
        conversation_id: Conversation ID
        db: Database session
        
    Returns:
        Reflection ID
    """
    try:
        # Check if reflection already exists for this conversation
        existing = db.query(Reflection).filter(
            Reflection.conversation_id == conversation_id
        ).first()
        
        if existing:
            # Update existing reflection instead of creating new one
            generator = get_reflection_generator()
            result = generator.generate_reflection(
                conversation_id=conversation_id,
                db=db
            )
            
            existing.ai_generated_text = result["reflection_text"]
            existing.final_text = result["reflection_text"]
            existing.emotions_detected = result["emotion_tags"]
            existing.key_insights = result["insights"]
            existing.topics = result["topics"]
            existing.key_moments = result["key_moments"]
            existing.updated_at = datetime.utcnow()
            
            db.commit()
            return existing.id
        
        # Generate new reflection
        generator = get_reflection_generator()
        result = generator.generate_reflection(
            conversation_id=conversation_id,
            db=db
        )
        
        # Create reflection in database
        reflection = Reflection(
            user_id=user_id,
            conversation_id=conversation_id,
            ai_generated_text=result["reflection_text"],
            final_text=result["reflection_text"],
            emotions_detected=result["emotion_tags"],
            key_insights=result["insights"],
            topics=result["topics"],
            key_moments=result["key_moments"],
            user_approved=False,
            is_edited=False
        )
        
        db.add(reflection)
        db.commit()
        db.refresh(reflection)
        
        return reflection.id
        
    except Exception as e:
        db.rollback()
        raise Exception(f"Failed to auto-generate reflection: {str(e)}")
