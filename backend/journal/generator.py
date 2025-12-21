"""
AI Reflection Generator
Generates therapeutic journal reflections from chat conversations
Uses conversation history, emotions, and insights to create meaningful reflections
"""

from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from database import Conversation, Message
from nlp import get_emotion_detector

class ReflectionGenerator:
    """
    Generates AI-powered journal reflections from conversations
    """
    
    def __init__(self):
        """Initialize the reflection generator"""
        self.emotion_detector = get_emotion_detector()
        print("✅ Reflection generator initialized")
    
    def generate_reflection(
        self, 
        conversation_id: str, 
        db: Session,
        user_prompt: Optional[str] = None
    ) -> Dict:
        """
        Generate an AI reflection from a conversation
        
        Args:
            conversation_id: ID of conversation to reflect on
            db: Database session
            user_prompt: Optional user guidance for reflection
        
        Returns:
            Dictionary with reflection text and metadata
        """
        # Get conversation and messages
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).first()
        
        if not conversation:
            raise ValueError("Conversation not found")
        
        messages = db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.role == "user"  # Only user messages
        ).order_by(Message.timestamp).all()
        
        if not messages:
            raise ValueError("No messages found in conversation")
        
        # Extract key emotional moments
        key_moments = self._extract_key_moments(messages)
        
        # Identify main topics
        topics = self._identify_topics(messages)
        
        # Extract insights
        insights = self._extract_insights(messages, key_moments)
        
        # Generate reflection text
        reflection_text = self._generate_reflection_text(
            messages=messages,
            key_moments=key_moments,
            topics=topics,
            insights=insights,
            user_prompt=user_prompt
        )
        
        # Get emotion tags
        emotion_tags = self._get_emotion_tags(messages)
        
        return {
            "reflection_text": reflection_text,
            "key_moments": key_moments,
            "topics": topics,
            "insights": insights,
            "emotion_tags": emotion_tags,
            "message_count": len(messages),
            "conversation_date": conversation.created_at.strftime("%B %d, %Y")
        }
    
    def _extract_key_moments(self, messages: List[Message]) -> List[Dict]:
        """
        Extract emotionally significant moments from messages
        
        Args:
            messages: List of user messages
        
        Returns:
            List of key emotional moments
        """
        key_moments = []
        
        # Emotions that indicate significant moments
        significant_emotions = {
            "joy", "gratitude", "love", "pride", "relief",  # Positive
            "sadness", "grief", "fear", "anger", "disappointment"  # Negative
        }
        
        for msg in messages:
            if msg.emotion and msg.emotion in significant_emotions:
                if msg.emotion_confidence and msg.emotion_confidence > 0.6:
                    key_moments.append({
                        "text": msg.content[:100] + "..." if len(msg.content) > 100 else msg.content,
                        "emotion": msg.emotion,
                        "confidence": msg.emotion_confidence,
                        "timestamp": msg.timestamp.isoformat()
                    })
        
        # Return top 3 moments
        key_moments.sort(key=lambda x: x["confidence"], reverse=True)
        return key_moments[:3]
    
    def _identify_topics(self, messages: List[Message]) -> List[str]:
        """
        Identify main topics discussed in conversation
        
        Args:
            messages: List of user messages
        
        Returns:
            List of main topics
        """
        topics = []
        
        # Common topic keywords
        topic_keywords = {
            "work": ["work", "job", "career", "boss", "colleague", "office", "project"],
            "relationships": ["relationship", "partner", "friend", "family", "love", "dating"],
            "health": ["health", "sick", "doctor", "pain", "tired", "sleep"],
            "anxiety": ["anxious", "worry", "stress", "nervous", "panic"],
            "depression": ["sad", "depressed", "hopeless", "empty", "lonely"],
            "self-improvement": ["goal", "improve", "better", "change", "grow"],
            "daily_life": ["day", "today", "morning", "evening", "routine"]
        }
        
        # Count topic mentions
        topic_counts = {topic: 0 for topic in topic_keywords}
        
        for msg in messages:
            content_lower = msg.content.lower()
            for topic, keywords in topic_keywords.items():
                if any(keyword in content_lower for keyword in keywords):
                    topic_counts[topic] += 1
        
        # Get top 2 topics
        sorted_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)
        topics = [topic for topic, count in sorted_topics[:2] if count > 0]
        
        return topics if topics else ["general_wellbeing"]
    
    def _extract_insights(
        self, 
        messages: List[Message], 
        key_moments: List[Dict]
    ) -> List[str]:
        """
        Extract therapeutic insights from conversation
        
        Args:
            messages: List of user messages
            key_moments: Key emotional moments
        
        Returns:
            List of insights
        """
        insights = []
        
        # Check for emotional patterns
        emotions = [msg.emotion for msg in messages if msg.emotion]
        
        if emotions:
            # Insight 1: Emotional awareness
            unique_emotions = set(emotions)
            if len(unique_emotions) >= 3:
                insights.append(
                    f"You experienced a range of emotions today, showing emotional depth and self-awareness."
                )
            
            # Insight 2: Emotional progression
            if len(emotions) >= 3:
                if emotions[-1] in ["joy", "relief", "gratitude", "optimism"]:
                    insights.append(
                        "Your emotional state improved throughout our conversation, which is a positive sign."
                    )
        
        # Check for anxiety patterns
        anxiety_messages = [msg for msg in messages if msg.anxiety_detected]
        if anxiety_messages:
            if len(anxiety_messages) > len(messages) / 2:
                insights.append(
                    "Anxiety was a recurring theme. Consider practicing grounding techniques regularly."
                )
            else:
                insights.append(
                    "You acknowledged your anxiety, which is an important step in managing it."
                )
        
        # Check for crisis moments
        crisis_messages = [msg for msg in messages if msg.crisis_detected]
        if crisis_messages:
            insights.append(
                "You reached out during a difficult moment. That takes courage and shows strength."
            )
        
        # Default insight if none found
        if not insights:
            insights.append(
                "You took time to reflect on your feelings today, which is valuable for your mental health."
            )
        
        return insights[:3]  # Max 3 insights
    
    def _generate_reflection_text(
        self,
        messages: List[Message],
        key_moments: List[Dict],
        topics: List[str],
        insights: List[str],
        user_prompt: Optional[str]
    ) -> str:
        """
        Generate the actual reflection text
        
        Args:
            messages: List of messages
            key_moments: Key emotional moments
            topics: Main topics
            insights: Therapeutic insights
            user_prompt: User guidance
        
        Returns:
            Reflection text
        """
        # Build reflection
        reflection_parts = []
        
        # Opening
        date_str = datetime.now().strftime("%B %d, %Y")
        reflection_parts.append(f"# Reflection for {date_str}\n")
        
        # Summary
        if topics:
            topic_str = " and ".join([t.replace("_", " ") for t in topics])
            reflection_parts.append(
                f"Today, I spent time reflecting on {topic_str}. "
            )
        
        # Key moments
        if key_moments:
            reflection_parts.append("\n## Key Moments\n")
            for i, moment in enumerate(key_moments, 1):
                emotion_emoji = self._get_emotion_emoji(moment["emotion"])
                reflection_parts.append(
                    f"{i}. {emotion_emoji} **{moment['emotion'].title()}**: "
                    f"\"{moment['text']}\"\n"
                )
        
        # Insights
        if insights:
            reflection_parts.append("\n## Insights\n")
            for insight in insights:
                reflection_parts.append(f"- {insight}\n")
        
        # Closing
        reflection_parts.append(
            "\n## Moving Forward\n"
            "Remember that every conversation is a step toward better understanding yourself. "
            "Your willingness to explore your emotions shows strength and self-awareness."
        )
        
        return "".join(reflection_parts)
    
    def _get_emotion_tags(self, messages: List[Message]) -> List[str]:
        """
        Get unique emotion tags from messages
        
        Args:
            messages: List of messages
        
        Returns:
            List of unique emotions
        """
        emotions = [msg.emotion for msg in messages if msg.emotion]
        return list(set(emotions))[:5]  # Max 5 unique emotions
    
    def _get_emotion_emoji(self, emotion: str) -> str:
        """
        Get emoji for emotion
        
        Args:
            emotion: Emotion name
        
        Returns:
            Emoji string
        """
        emoji_map = {
            "joy": "😊",
            "sadness": "😢",
            "anger": "😠",
            "fear": "😨",
            "love": "❤️",
            "gratitude": "🙏",
            "relief": "😌",
            "pride": "🌟",
            "nervousness": "😰",
            "disappointment": "😞",
            "grief": "💔",
            "optimism": "🌈"
        }
        return emoji_map.get(emotion, "💭")


# Singleton instance
_reflection_generator = None

def get_reflection_generator() -> ReflectionGenerator:
    """Get or create reflection generator singleton"""
    global _reflection_generator
    if _reflection_generator is None:
        _reflection_generator = ReflectionGenerator()
    return _reflection_generator


# Example usage
if __name__ == "__main__":
    print("Reflection Generator initialized!")
    print("Use get_reflection_generator() to access the generator")
