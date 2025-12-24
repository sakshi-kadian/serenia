"""
Gemini AI Integration for Whiz Chat
Provides empathetic, context-aware responses using Google's Gemini API
OPTIMIZED FOR SPEED - NO MARKDOWN FORMATTING
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
1. Listen Actively: Respond to specific details
2. Respond Naturally: No templates or robotic language
3. Show Empathy: Validate feelings authentically
4. Maintain Boundaries: You are a friend, not a therapist

CRITICAL FORMATTING RULES:
- DO NOT use asterisks (*) or double asterisks (**) for emphasis
- DO NOT use bullet points with asterisks
- Use plain text only - write like you're texting a friend
- Use simple dashes (-) for lists if absolutely needed
- Write naturally and conversationally

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
        Generate empathetic response using Gemini (OPTIMIZED)
        
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
            
            # Generate response
            if not self.model:
                return self._fallback_response(emotion, anxiety, crisis)
            
            try:
                # Construct the prompt
                full_prompt = f"""{self.system_prompt}

Context: {context}

History: {self._format_history(conversation_history)}

User: {user_message}

Whiz (respond in plain text, no asterisks or markdown):"""

                # Call Gemini API with FAST settings
                response = self.model.generate_content(
                    full_prompt,
                    generation_config={
                        'temperature': 0.8,
                        'max_output_tokens': 150,  # Shorter = faster
                        'top_p': 0.95,
                        'top_k': 40
                    }
                )
                
                # Extract text safely and remove any markdown
                if response and response.text:
                    text = response.text.strip()
                    # Remove common markdown formatting
                    text = text.replace('**', '').replace('*', '')
                    return text
                else:
                    return self._fallback_response(emotion, anxiety, crisis)
                
            except Exception as api_error:
                print(f"Gemini error: {str(api_error)}")
                return self._fallback_response(emotion, anxiety, crisis)
                
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return self._fallback_response(emotion, anxiety, crisis)
    
    def _build_context(self, message: str, emotion: Dict, anxiety: Dict, crisis: Dict) -> str:
        """Build context string from analysis results"""
        context_parts = []
        
        if emotion and emotion.get("emotion"):
            context_parts.append(f"Emotion: {emotion['emotion']}")
        
        if anxiety and anxiety.get("anxiety_detected"):
            context_parts.append(f"Anxiety: {anxiety.get('severity', 'detected')}")
        
        if crisis and crisis.get("crisis_detected"):
            context_parts.append("⚠️ CRISIS DETECTED")
        
        return " | ".join(context_parts) if context_parts else "Neutral conversation"
    
    def _format_history(self, history: List[Dict]) -> str:
        """Format conversation history (last 3 messages only for speed)"""
        if not history:
            return "First message"
        
        # Only use last 3 messages for speed
        recent = history[-3:] if len(history) > 3 else history
        formatted = []
        for msg in recent:
            role = msg.get("role", "user")
            content = msg.get("content", "")[:100]  # Truncate for speed
            formatted.append(f"{role}: {content}")
        
        return " | ".join(formatted)
    
    def _fallback_response(self, emotion: Dict, anxiety: Dict, crisis: Dict) -> str:
        """Generate fallback response when API fails"""
        
        # Crisis response
        if crisis and crisis.get("crisis_detected"):
            return ("I'm really concerned about you. Please reach out to someone who can help - "
                   "call 988 for immediate support. You don't have to face this alone.")
        
        # High anxiety response
        if anxiety and anxiety.get("severity") in ["severe", "moderate"]:
            return ("I hear you. It sounds like you're feeling overwhelmed right now. "
                   "Would it help to take a moment to breathe together?")
        
        # Emotion-based responses
        emotion_name = emotion.get("emotion", "neutral") if emotion else "neutral"
        
        responses = {
            "sadness": "I'm here with you. It's okay to feel sad. Would you like to talk about what's weighing on you?",
            "anger": "I can sense your frustration. Those feelings are valid. What's been bothering you?",
            "fear": "It's okay to feel scared. I'm here to listen. What's on your mind?",
            "joy": "It's wonderful to hear some positivity! What's bringing you joy today?",
        }
        
        return responses.get(emotion_name, 
                           "I'm here to listen. How are you feeling today?")


# Singleton instance
_gemini_chat = None

def get_gemini_chat() -> GeminiChat:
    """Get or create Gemini chat singleton"""
    global _gemini_chat
    if _gemini_chat is None:
        _gemini_chat = GeminiChat()
    return _gemini_chat
