"""
Gemini AI Integration for Whiz Chat
Provides empathetic, context-aware responses using Google's Gemini API
"""

import os
from typing import Dict, List, Optional
import google.generativeai as genai

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class GeminiChat:
    """Gemini-powered chat for mental wellness support"""
    
    def __init__(self):
        """Initialize Gemini chat"""
        self.model = genai.GenerativeModel('gemini-pro')
        
        # System prompt for Whiz personality
        self.system_prompt = """You are Whiz, a compassionate AI mental wellness companion. Your role is to:

1. Listen actively and empathetically to users' feelings
2. Validate their emotions without judgment
3. Ask thoughtful follow-up questions to understand better
4. Provide gentle support and coping strategies when appropriate
5. Never diagnose or replace professional mental health care
6. Be warm, understanding, and conversational

Guidelines:
- Keep responses concise (2-3 sentences max)
- Use a warm, friendly tone
- Ask open-ended questions to encourage sharing
- Acknowledge their emotions before offering suggestions
- If they seem in crisis, gently encourage professional help

Remember: You're a supportive friend, not a therapist."""

    def generate_response(
        self,
        user_message: str,
        emotion: Dict,
        anxiety: Dict,
        crisis: Dict,
        conversation_history: List[Dict] = None
    ) -> str:
        """
        Generate empathetic response using Gemini
        
        Args:
            user_message: User's message
            emotion: Emotion detection results
            anxiety: Anxiety classification results
            crisis: Crisis detection results
            conversation_history: Previous messages for context
            
        Returns:
            AI-generated response
        """
        try:
            # Build context from analysis
            context = self._build_context(user_message, emotion, anxiety, crisis)
            
            # Build conversation history
            history_text = ""
            if conversation_history:
                for msg in conversation_history[-5:]:  # Last 5 messages
                    role = "User" if msg["role"] == "user" else "Whiz"
                    history_text += f"{role}: {msg['content']}\n"
            
            # Build full prompt
            prompt = f"""{self.system_prompt}

Context about current message:
{context}

Conversation so far:
{history_text}

User: {user_message}

Whiz:"""

            # Generate response
            response = self.model.generate_content(prompt)
            
            # Extract text
            if response and response.text:
                return response.text.strip()
            else:
                return "I'm here to listen. How are you feeling right now?"
                
        except Exception as e:
            print(f"❌ Gemini error: {str(e)}")
            # Fallback to simple empathetic response
            return self._fallback_response(emotion, anxiety, crisis)
    
    def _build_context(self, message: str, emotion: Dict, anxiety: Dict, crisis: Dict) -> str:
        """Build context string from analysis results"""
        context_parts = []
        
        # Emotion context
        if emotion and "primary_emotion" in emotion:
            context_parts.append(f"Detected emotion: {emotion['primary_emotion']}")
        
        # Anxiety context
        if anxiety and anxiety.get("anxiety_detected"):
            severity = anxiety.get("severity", "unknown")
            context_parts.append(f"Anxiety level: {severity}")
        
        # Crisis context
        if crisis and crisis.get("crisis_detected"):
            context_parts.append("⚠️ CRISIS INDICATORS DETECTED - Be extra supportive and gentle")
        
        return " | ".join(context_parts) if context_parts else "Normal conversation"
    
    def _fallback_response(self, emotion: Dict, anxiety: Dict, crisis: Dict) -> str:
        """Fallback response if Gemini fails"""
        # Crisis
        if crisis and crisis.get("crisis_detected"):
            return "I'm really concerned about you. Please reach out to someone who can help - call 988 for immediate support. You don't have to face this alone."
        
        # High anxiety
        if anxiety and anxiety.get("severity") in ["severe", "moderate"]:
            return "I can sense you're going through a tough time. I'm here to listen. What's on your mind?"
        
        # Default
        return "I'm here for you. How are you feeling right now?"

# Global instance
_gemini_chat = None

def get_gemini_chat() -> GeminiChat:
    """Get or create Gemini chat instance"""
    global _gemini_chat
    if _gemini_chat is None:
        _gemini_chat = GeminiChat()
    return _gemini_chat
