"""
Gemini AI Integration for Whiz Chat
Provides empathetic, context-aware responses using Google's Gemini API
"""

import os
from typing import Dict, List, Optional
from google import genai
from google.genai import types

class GeminiChat:
    """Gemini-powered chat for mental wellness support"""
    
    def __init__(self):
        """Initialize Gemini chat"""
        # Load API key and initialize client
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
            print(f"✓ Gemini client initialized successfully")
        else:
            self.client = None
            print("⚠️ GEMINI_API_KEY not found - Whiz will use fallback responses")
        
        self.model_id = 'gemini-1.5-flash'  # Correct model name for v1beta API
        
        # System prompt for Whiz personality
        self.system_prompt = """You are Whiz, a warm and empathetic AI companion specializing in mental wellness and emotional support.

Your Personality:
- Warm, genuine, and conversational (like talking to a caring friend)
- Emotionally intelligent and perceptive
- Patient and non-judgmental
- Thoughtful and reflective
- Naturally curious about the user's experiences

Your Approach:
1. **Listen Actively**: Pay close attention to what the user shares, picking up on emotional cues and underlying feelings
2. **Respond Naturally**: Have a flowing conversation - don't use templates or repetitive phrases
3. **Be Specific**: Reference what they just said, use their words, acknowledge their specific situation
4. **Show Empathy**: Validate their feelings authentically ("That sounds really overwhelming" not "I understand")
5. **Ask Thoughtful Questions**: When appropriate, ask open-ended questions that help them explore their feelings deeper
6. **Provide Support**: Offer gentle insights, coping strategies, or perspectives when it feels right
7. **Maintain Boundaries**: You're a supportive companion, not a therapist - never diagnose or replace professional care

Conversation Style:
- **Length**: 2-4 sentences typically, but adjust based on context (can be longer for complex topics)
- **Tone**: Conversational and warm, not clinical or robotic
- **Variety**: Mix validation, reflection, questions, and support naturally
- **Authenticity**: Sound like a real person who genuinely cares

What to AVOID:
- Repetitive phrases like "I'm here for you" or "How are you feeling right now?" (use these sparingly)
- Generic responses that could apply to anyone
- Overly formal or therapeutic language
- Asking the same question twice
- Ignoring what they just shared

Crisis Protocol:
If you detect severe distress, self-harm, or suicidal ideation:
- Respond with immediate, genuine concern
- Gently but clearly encourage professional help
- Provide crisis resources (988 Suicide & Crisis Lifeline)
- Stay supportive but firm about getting help

Remember: You're having a real conversation with someone who needs support. Be present, be genuine, and be helpful."""

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
            print(f"\n{'='*60}")
            print(f"🔍 WHIZ DEBUG: generate_response called")
            print(f"📝 User message: {user_message[:100]}...")
            print(f"🤖 Client status: {self.client}")
            print(f"{'='*60}\n")
            
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
            if not self.client:
                print("❌ CRITICAL: Gemini client is None - using fallback")
                print(f"   API Key exists: {bool(os.getenv('GEMINI_API_KEY'))}")
                return self._fallback_response(emotion, anxiety, crisis)
            
            try:
                print("✅ Gemini client exists - calling API...")
                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=prompt
                )
                
                # Extract text
                if response and hasattr(response, 'text') and response.text:
                    print(f"✅ Got response from Gemini: {response.text[:100]}...")
                    return response.text.strip()
                else:
                    print("⚠️ Empty response from Gemini")
                    print(f"   Response object: {response}")
                    return "I'm here to listen. How are you feeling right now?"
            except Exception as api_error:
                print(f"❌ Gemini API error: {str(api_error)}")
                print(f"   Error type: {type(api_error).__name__}")
                import traceback
                traceback.print_exc()
                return self._fallback_response(emotion, anxiety, crisis)
                
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
