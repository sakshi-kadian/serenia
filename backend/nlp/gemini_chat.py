"""
Gemini AI Integration for Whiz Chat
Provides empathetic, context-aware responses using Google's Gemini API
"""

import os
from typing import Dict, List, Optional
import google.generativeai as genai

class GeminiChat:
    """Gemini-powered chat for mental wellness support"""
    
    def __init__(self):
        """Initialize Gemini chat"""
        api_key = os.getenv("GEMINI_API_KEY")
        
        if api_key:
            try:
                # Configure the standard library
                genai.configure(api_key=api_key)
                # Use the fast and efficient Gemini 2.5 Flash model
                self.model = genai.GenerativeModel('gemini-2.5-flash')
                print("✓ Gemini client initialized successfully (Standard Lib)")
                print("   Using Model: gemini-2.5-flash")
            except Exception as e:
                self.model = None
                print(f"Failed to initialize Gemini: {e}")
        else:
            self.model = None
            print("GEMINI_API_KEY not found - Whiz will use fallback responses")
        
        # System prompt for Whiz personality
        self.system_prompt = """You are Whiz, a warm and empathetic AI companion specializing in mental wellness and emotional support.

Your Personality:
- Warm, genuine, and conversational
- Emotionally intelligent and perceptive
- Patient and non-judgmental

Your Approach:
1. Listen Actively: Response to specific details
2. Respond Naturally: No templates
3. Show Empathy: Validate feelings authentically
4. Maintain Boundaries: You are a friend, not a therapist

Crisis Protocol:
If you detect severe distress or suicidal ideation, respond with immediate concern and encourage professional help (988).
"""

    
    
    def generate_response(
        self,
        user_message: str,
        emotion: Dict,
        anxiety: Dict,
        crisis: Dict,
        conversation_history: List[Dict] = None
    ) -> str:
        """
        Generate empathetic response using OpenAI
        
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
            print(f"\n{'='*60}")
            print(f"WHIZ DEBUG: generate_response called")
            print(f"User message: {user_message[:100]}...")
            print(f"Model status: {self.model}")
            print(f"{'='*60}\n")
            
            # Build context from analysis
            context = self._build_context(user_message, emotion, anxiety, crisis)
            
            # Generate response
            if not self.model:
                print("CRITICAL: Gemini model is None - using fallback")
                return self._fallback_response(emotion, anxiety, crisis)
            
            try:
                print("Gemini model exists - calling API...")
                
                # Construct the prompt
                full_prompt = f"""{self.system_prompt}

Context about current message:
{context}

Conversation History:
{self._format_history(conversation_history)}

User: {user_message}

Whiz:"""

                # Call standard Gemini API
                response = self.model.generate_content(full_prompt)
                
                # Extract text safely
                if response and response.text:
                    ai_response = response.text.strip()
                    print(f"Got response from Gemini: {ai_response[:100]}...")
                    return ai_response
                else:
                    print("Empty response from Gemini")
                    return self._fallback_response(emotion, anxiety, crisis)
                
            except Exception as api_error:
                print(f"Gemini API error: {str(api_error)}")
                return self._fallback_response(emotion, anxiety, crisis)
                
        except Exception as e:
            print(f"Whiz error: {str(e)}")
            return self._fallback_response(emotion, anxiety, crisis)

    def _format_history(self, history):
        if not history: return ""
        formatted = ""
        for msg in history[-5:]:
            role = "User" if msg["role"] == "user" else "Whiz"
            formatted += f"{role}: {msg['content']}\n"
        return formatted
    
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
            context_parts.append("CRISIS INDICATORS DETECTED - Be extra supportive and gentle")
        
        return " | ".join(context_parts) if context_parts else "Normal conversation"
    
    def _fallback_response(self, emotion: Dict, anxiety: Dict, crisis: Dict) -> str:
        """Fallback response if AI fails"""
        if crisis and crisis.get("crisis_detected"):
            return "I'm really concerned about you. Please reach out to someone who can help - call 988 for immediate support."
        return "I'm here for you. How are you feeling right now?"

# Global instance
_gemini_chat = None

def get_gemini_chat() -> GeminiChat:
    """Get or create chat instance"""
    global _gemini_chat
    if _gemini_chat is None:
        _gemini_chat = GeminiChat()
    return _gemini_chat
