"""
Context Management Module
Tracks conversation history and emotional state transitions
Provides context-aware responses and memory
"""

from typing import List, Dict, Optional, Tuple
from datetime import datetime
from collections import deque

class ConversationContext:
    """
    Manages conversation history and emotional context
    
    Features:
    - Sliding window of recent messages
    - Emotional state tracking
    - Topic continuity
    - Crisis history
    """
    
    def __init__(self, conversation_id: str, user_id: str, window_size: int = 5):
        """
        Initialize conversation context
        
        Args:
            conversation_id: Unique conversation identifier
            user_id: User identifier
            window_size: Number of recent messages to keep in context (default: 5)
        """
        self.conversation_id = conversation_id
        self.user_id = user_id
        self.window_size = window_size
        
        # Message history (sliding window)
        self.messages: deque = deque(maxlen=window_size)
        
        # Emotional state tracking
        self.emotion_history: List[Dict] = []
        self.anxiety_history: List[Dict] = []
        self.crisis_history: List[Dict] = []
        
        # Current state
        self.current_emotion: Optional[str] = None
        self.current_anxiety_level: Optional[str] = None
        self.crisis_detected: bool = False
        
        # Conversation metadata
        self.created_at = datetime.now()
        self.last_updated = datetime.now()
        self.message_count = 0
        
        # Topics discussed
        self.topics: List[str] = []
    
    def add_message(
        self, 
        role: str, 
        content: str, 
        emotion: Optional[Dict] = None,
        anxiety: Optional[Dict] = None,
        crisis: Optional[Dict] = None
    ):
        """
        Add a message to the conversation context
        
        Args:
            role: 'user' or 'assistant'
            content: Message content
            emotion: Emotion detection result
            anxiety: Anxiety detection result
            crisis: Crisis detection result
        """
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "emotion": emotion,
            "anxiety": anxiety,
            "crisis": crisis
        }
        
        self.messages.append(message)
        self.message_count += 1
        self.last_updated = datetime.now()
        
        # Update emotional state
        if emotion and role == "user":
            self.current_emotion = emotion.get("primary_emotion")
            self.emotion_history.append({
                "emotion": self.current_emotion,
                "confidence": emotion.get("confidence"),
                "timestamp": datetime.now().isoformat()
            })
        
        # Update anxiety state
        if anxiety and role == "user":
            self.current_anxiety_level = anxiety.get("severity")
            self.anxiety_history.append({
                "severity": self.current_anxiety_level,
                "confidence": anxiety.get("confidence"),
                "timestamp": datetime.now().isoformat()
            })
        
        # Update crisis state
        if crisis and role == "user":
            if crisis.get("crisis_detected"):
                self.crisis_detected = True
                self.crisis_history.append({
                    "severity": crisis.get("severity"),
                    "keywords": crisis.get("keywords_found"),
                    "timestamp": datetime.now().isoformat()
                })
    
    def get_recent_messages(self, n: Optional[int] = None) -> List[Dict]:
        """
        Get recent messages from context
        
        Args:
            n: Number of messages to retrieve (default: all in window)
        
        Returns:
            List of recent messages
        """
        if n is None:
            return list(self.messages)
        return list(self.messages)[-n:]
    
    def get_context_summary(self) -> str:
        """
        Get a text summary of the conversation context
        
        Returns:
            Context summary string
        """
        if not self.messages:
            return "New conversation, no previous context."
        
        summary_parts = []
        
        # Recent messages summary
        recent_count = min(3, len(self.messages))
        summary_parts.append(f"Last {recent_count} messages:")
        for msg in list(self.messages)[-recent_count:]:
            role = msg["role"].capitalize()
            content_preview = msg["content"][:50] + "..." if len(msg["content"]) > 50 else msg["content"]
            summary_parts.append(f"  {role}: {content_preview}")
        
        # Emotional state
        if self.current_emotion:
            summary_parts.append(f"\nCurrent emotion: {self.current_emotion}")
        
        # Anxiety state
        if self.current_anxiety_level and self.current_anxiety_level != "none":
            summary_parts.append(f"Anxiety level: {self.current_anxiety_level}")
        
        # Crisis flag
        if self.crisis_detected:
            summary_parts.append("⚠️ CRISIS DETECTED - Handle with care")
        
        return "\n".join(summary_parts)
    
    def get_emotional_trajectory(self) -> List[str]:
        """
        Get the trajectory of emotions throughout the conversation
        
        Returns:
            List of emotions in chronological order
        """
        return [e["emotion"] for e in self.emotion_history]
    
    def get_anxiety_trajectory(self) -> List[str]:
        """
        Get the trajectory of anxiety levels throughout the conversation
        
        Returns:
            List of anxiety levels in chronological order
        """
        return [a["severity"] for a in self.anxiety_history]
    
    def is_emotion_improving(self) -> Optional[bool]:
        """
        Check if emotional state is improving
        
        Returns:
            True if improving, False if worsening, None if insufficient data
        """
        if len(self.emotion_history) < 2:
            return None
        
        # Simple heuristic: compare recent emotions
        positive_emotions = {"joy", "gratitude", "love", "amusement", "excitement", "optimism"}
        negative_emotions = {"sadness", "anger", "fear", "grief", "disappointment"}
        
        recent_emotions = [e["emotion"] for e in self.emotion_history[-3:]]
        
        positive_count = sum(1 for e in recent_emotions if e in positive_emotions)
        negative_count = sum(1 for e in recent_emotions if e in negative_emotions)
        
        if positive_count > negative_count:
            return True
        elif negative_count > positive_count:
            return False
        return None
    
    def is_anxiety_improving(self) -> Optional[bool]:
        """
        Check if anxiety is improving
        
        Returns:
            True if improving, False if worsening, None if insufficient data
        """
        if len(self.anxiety_history) < 2:
            return None
        
        severity_order = {"none": 0, "low": 1, "mild": 2, "moderate": 3, "severe": 4}
        
        recent = self.anxiety_history[-2:]
        prev_severity = severity_order.get(recent[0]["severity"], 0)
        curr_severity = severity_order.get(recent[1]["severity"], 0)
        
        if curr_severity < prev_severity:
            return True
        elif curr_severity > prev_severity:
            return False
        return None
    
    def get_conversation_stats(self) -> Dict:
        """
        Get conversation statistics
        
        Returns:
            Dictionary of conversation stats
        """
        return {
            "conversation_id": self.conversation_id,
            "user_id": self.user_id,
            "message_count": self.message_count,
            "duration_minutes": (datetime.now() - self.created_at).total_seconds() / 60,
            "current_emotion": self.current_emotion,
            "current_anxiety": self.current_anxiety_level,
            "crisis_detected": self.crisis_detected,
            "emotion_trajectory": self.get_emotional_trajectory(),
            "anxiety_trajectory": self.get_anxiety_trajectory(),
            "emotion_improving": self.is_emotion_improving(),
            "anxiety_improving": self.is_anxiety_improving()
        }
    
    def should_generate_reflection(self) -> bool:
        """
        Determine if enough context exists to generate a reflection
        
        Returns:
            True if reflection should be generated
        """
        # Generate reflection if:
        # 1. At least 5 messages exchanged
        # 2. Some emotional data collected
        # 3. Conversation has been going for at least 5 minutes
        
        duration_minutes = (datetime.now() - self.created_at).total_seconds() / 60
        
        return (
            self.message_count >= 5 and
            len(self.emotion_history) >= 2 and
            duration_minutes >= 5
        )


class ContextManager:
    """
    Manages multiple conversation contexts
    """
    
    def __init__(self):
        """Initialize the context manager"""
        self.contexts: Dict[str, ConversationContext] = {}
        print("✅ Context manager initialized")
    
    def create_context(self, conversation_id: str, user_id: str) -> ConversationContext:
        """
        Create a new conversation context
        
        Args:
            conversation_id: Unique conversation identifier
            user_id: User identifier
        
        Returns:
            New ConversationContext instance
        """
        context = ConversationContext(conversation_id, user_id)
        self.contexts[conversation_id] = context
        return context
    
    def get_context(self, conversation_id: str) -> Optional[ConversationContext]:
        """
        Get an existing conversation context
        
        Args:
            conversation_id: Conversation identifier
        
        Returns:
            ConversationContext if exists, None otherwise
        """
        return self.contexts.get(conversation_id)
    
    def get_or_create_context(self, conversation_id: str, user_id: str) -> ConversationContext:
        """
        Get existing context or create new one
        
        Args:
            conversation_id: Conversation identifier
            user_id: User identifier
        
        Returns:
            ConversationContext instance
        """
        context = self.get_context(conversation_id)
        if context is None:
            context = self.create_context(conversation_id, user_id)
        return context
    
    def delete_context(self, conversation_id: str):
        """
        Delete a conversation context
        
        Args:
            conversation_id: Conversation identifier
        """
        if conversation_id in self.contexts:
            del self.contexts[conversation_id]


# Singleton instance
_context_manager = None

def get_context_manager() -> ContextManager:
    """Get or create context manager singleton"""
    global _context_manager
    if _context_manager is None:
        _context_manager = ContextManager()
    return _context_manager


# Example usage
if __name__ == "__main__":
    # Create context manager
    manager = ContextManager()
    
    # Create a conversation
    context = manager.create_context("conv-123", "user-456")
    
    print("\n" + "="*70)
    print("CONTEXT MANAGEMENT TEST")
    print("="*70 + "\n")
    
    # Simulate conversation
    context.add_message(
        "user", 
        "I'm feeling really anxious about my presentation tomorrow.",
        emotion={"primary_emotion": "nervousness", "confidence": 0.85},
        anxiety={"severity": "moderate", "confidence": 0.75}
    )
    
    context.add_message(
        "assistant",
        "I hear that you're feeling anxious. Can you tell me more about what's worrying you?"
    )
    
    context.add_message(
        "user",
        "I'm worried I'll mess up and everyone will judge me.",
        emotion={"primary_emotion": "fear", "confidence": 0.78},
        anxiety={"severity": "moderate", "confidence": 0.80}
    )
    
    context.add_message(
        "assistant",
        "Those feelings are completely valid. Let's work through this together."
    )
    
    context.add_message(
        "user",
        "Thank you. I feel a bit better now.",
        emotion={"primary_emotion": "relief", "confidence": 0.65},
        anxiety={"severity": "mild", "confidence": 0.60}
    )
    
    # Print context summary
    print("Context Summary:")
    print(context.get_context_summary())
    print("\n" + "-"*70 + "\n")
    
    # Print stats
    stats = context.get_conversation_stats()
    print("Conversation Stats:")
    print(f"  Messages: {stats['message_count']}")
    print(f"  Duration: {stats['duration_minutes']:.2f} minutes")
    print(f"  Current Emotion: {stats['current_emotion']}")
    print(f"  Current Anxiety: {stats['current_anxiety']}")
    print(f"  Emotion Trajectory: {' → '.join(stats['emotion_trajectory'])}")
    print(f"  Anxiety Trajectory: {' → '.join(stats['anxiety_trajectory'])}")
    print(f"  Emotion Improving: {stats['emotion_improving']}")
    print(f"  Anxiety Improving: {stats['anxiety_improving']}")
    print(f"  Ready for Reflection: {context.should_generate_reflection()}")
    
    print("\n" + "="*70)
