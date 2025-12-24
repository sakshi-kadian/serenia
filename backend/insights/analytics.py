"""
Analytics Engine
Analyzes mood trends, anxiety patterns, and generates AI insights
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter

from database import Message, Conversation

class AnalyticsEngine:
    """
    Analyzes user data to generate insights and trends
    """
    
    def __init__(self):
        """Initialize the analytics engine"""
        print("Analytics engine initialized")
    
    def calculate_mood_trends(
        self, 
        user_id: str, 
        db: Session,
        period: str = "week"
    ) -> Dict:
        """
        Calculate mood trends over specified period
        
        Args:
            user_id: User ID
            db: Database session
            period: 'week', 'month', or 'year'
        
        Returns:
            Dictionary with mood trends
        """
        # Calculate date range
        now = datetime.utcnow()
        
        if period == "year":
            # Current Year (Jan 1 - Dec 31)
            start_date = datetime(now.year, 1, 1)
            end_date = datetime(now.year, 12, 31, 23, 59, 59)
            period_days = 365 # Approx
        elif period == "month":
            # Current Month (1st - Last day)
            start_date = datetime(now.year, now.month, 1)
            # Get last day of month
            if now.month == 12:
                next_month = datetime(now.year + 1, 1, 1)
            else:
                next_month = datetime(now.year, now.month + 1, 1)
            end_date = next_month - timedelta(seconds=1)
            period_days = (end_date - start_date).days + 1
        else:
            # Week (Last 7 days) - Keep this rolling for immediate context
            start_date = now - timedelta(days=6) # 6 days ago + today = 7 days
            end_date = now
            period_days = 7
        
        # Get all user messages in date range
        messages = db.query(Message).join(Conversation).filter(
            Conversation.user_id == user_id,
            Message.role == "user",
            Message.timestamp >= start_date,
            Message.timestamp <= end_date,
            Message.emotion.isnot(None)
        ).order_by(Message.timestamp).all()
        
        if not messages and period == "week": # For week we return empty if no messages, for others we yield the structure
             return {
                "period_days": period_days,
                "message_count": 0,
                "daily_moods": [], # Will be filled below if we let it fall through, but keeping old behavior for empty week check
                "dominant_emotions": [],
                "average_sentiment": "neutral",
                "trend": "stable"
            }
        
        # Group by day
        daily_emotions = {}
        for msg in messages:
            day_key = msg.timestamp.date().isoformat()
            if day_key not in daily_emotions:
                daily_emotions[day_key] = []
            daily_emotions[day_key].append({
                "emotion": msg.emotion,
                "confidence": msg.emotion_confidence
            })
        
        # Fill in all days in the range (even days with no messages)
        daily_moods = []
        current_date = start_date.date()
        end_date_only = end_date.date()
        
        while current_date <= end_date_only:
            day_key = current_date.isoformat()
            
            if day_key in daily_emotions:
                # Day has messages - calculate mood score
                emotions = daily_emotions[day_key]
                mood_score = self._calculate_mood_score(emotions)
                dominant_emotion = Counter([e["emotion"] for e in emotions]).most_common(1)[0][0]
                emotion_count = len(emotions)
            else:
                # Day has no messages - use neutral values
                mood_score = 0.5  # Neutral/positive baseline
                dominant_emotion = "neutral"
                emotion_count = 0
            
            daily_moods.append({
                "date": day_key,
                "mood_score": mood_score,
                "emotion_count": emotion_count,
                "dominant_emotion": dominant_emotion
            })
            
            current_date += timedelta(days=1)
        
        # Get dominant emotions overall
        all_emotions = [msg.emotion for msg in messages]
        dominant_emotions = [
            {"emotion": emotion, "count": count}
            for emotion, count in Counter(all_emotions).most_common(5)
        ]
        
        # Calculate average sentiment (only from days with messages)
        days_with_messages = [d for d in daily_moods if d["emotion_count"] > 0]
        if days_with_messages:
            avg_score = sum(d["mood_score"] for d in days_with_messages) / len(days_with_messages)
        else:
            avg_score = 0.5
        average_sentiment = self._score_to_sentiment(avg_score)
        
        # Detect trend
        trend = self._detect_trend(daily_moods)
        
        return {
            "period_days": period_days,
            "message_count": len(messages),
            "daily_moods": daily_moods,
            "dominant_emotions": dominant_emotions,
            "average_sentiment": average_sentiment,
            "average_score": round(avg_score, 2),
            "trend": trend
        }
    
    def analyze_anxiety_patterns(
        self, 
        user_id: str, 
        db: Session,
        days: int = 30
    ) -> Dict:
        """
        Analyze anxiety patterns over time
        
        Args:
            user_id: User ID
            db: Database session
            days: Number of days to analyze
        
        Returns:
            Dictionary with anxiety analysis
        """
        # Get date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get messages with anxiety
        messages = db.query(Message).join(Conversation).filter(
            Conversation.user_id == user_id,
            Message.role == "user",
            Message.timestamp >= start_date,
            Message.timestamp <= end_date,
            Message.anxiety_detected == True
        ).order_by(Message.timestamp).all()
        
        if not messages:
            return {
                "period_days": days,
                "anxiety_detected": False,
                "anxiety_episodes": 0,
                "severity_distribution": {},
                "triggers": [],
                "patterns": []
            }
        
        # Severity distribution
        severity_counts = Counter([msg.anxiety_severity for msg in messages])
        severity_distribution = {
            severity: count 
            for severity, count in severity_counts.items()
        }
        
        # Identify triggers (common words in anxiety messages)
        triggers = self._identify_triggers(messages)
        
        # Detect patterns (time of day, day of week)
        patterns = self._detect_anxiety_patterns(messages)
        
        # Calculate anxiety scores over time
        anxiety_scores = []
        for msg in messages:
            score = self._anxiety_severity_to_score(msg.anxiety_severity)
            anxiety_scores.append({
                "date": msg.timestamp.date().isoformat(),
                "time": msg.timestamp.time().isoformat(),
                "severity": msg.anxiety_severity,
                "score": score
            })
        
        return {
            "period_days": days,
            "anxiety_detected": True,
            "anxiety_episodes": len(messages),
            "severity_distribution": severity_distribution,
            "triggers": triggers,
            "patterns": patterns,
            "anxiety_scores": anxiety_scores[-10:]  # Last 10
        }
    
    def generate_insights(
        self, 
        user_id: str, 
        db: Session,
        period: str = "weekly"
    ) -> Dict:
        """
        Generate AI insights for user
        
        Args:
            user_id: User ID
            db: Database session
            period: 'weekly' or 'monthly'
        
        Returns:
            Dictionary with AI-generated insights
        """
        days = 7 if period == "weekly" else 30
        
        # Get mood trends
        mood_data = self.calculate_mood_trends(user_id, db, period)
        
        # Get anxiety patterns
        anxiety_data = self.analyze_anxiety_patterns(user_id, db, days)
        
        # Generate insights
        insights = []
        recommendations = []
        
        # Insight 1: Overall mood
        if mood_data["message_count"] > 0:
            avg_sentiment = mood_data["average_sentiment"]
            trend = mood_data["trend"]
            
            if trend == "improving":
                insights.append(
                    f"Great news! Your mood trends show an improvement over the past {days} days."
                )
            elif trend == "declining":
                insights.append(
                    f"We've noticed a decline in your mood recently. Remember, ups and downs are a natural part of the journey."
                )
                recommendations.append("Practice self-care activities that bring you joy")
            else:
                insights.append(
                    f" Your mood has remained relatively stable over the past {days} days."
                )
        
        # Insight 2: Dominant emotions
        if mood_data["dominant_emotions"]:
            top_emotion = mood_data["dominant_emotions"][0]["emotion"]
            insights.append(
                f"Your dominant emotion recently has been {top_emotion}. " + 
                ("It's great to embrace this feeling." if top_emotion in ["joy", "love", "optimism"] else "Acknowledging this is the first step to processing it.")
            )
        
        # Insight 3: Anxiety patterns
        if anxiety_data["anxiety_detected"]:
            episodes = anxiety_data["anxiety_episodes"]
            insights.append(
                f"We identified {episodes} moments of anxiety in your recent conversations. Awareness is key to management."
            )
            recommendations.append("Try deep breathing exercises when feeling anxious")
            
            if anxiety_data["triggers"]:
                top_trigger = anxiety_data["triggers"][0]["trigger"]
                insights.append(
                    f"It seems '{top_trigger}' comes up often when you feel anxious. Identifying triggers helps you prepare."
                )
        
        # Insight 4: Progress indicators
        if mood_data["trend"] == "improving" and not anxiety_data["anxiety_detected"]:
            insights.append(
                "You're thriving! Your mood is on the rise and anxiety markers are absent."
            )
        
        # Default recommendations
        if not recommendations:
            recommendations = [
                "Continue journaling your thoughts and feelings",
                "Maintain regular sleep and exercise routines",
                "Stay connected with supportive people"
            ]
        
        return {
            "period": period,
            "period_days": days,
            "insights": insights,
            "recommendations": recommendations[:3],  # Max 3
            "mood_summary": {
                "average_sentiment": mood_data["average_sentiment"],
                "trend": mood_data["trend"]
            },
            "anxiety_summary": {
                "detected": anxiety_data["anxiety_detected"],
                "episodes": anxiety_data.get("anxiety_episodes", 0)
            }
        }
    
    # Helper methods
    
    def _calculate_mood_score(self, emotions: List[Dict]) -> float:
        """Calculate mood score from emotions (-1 to 1)"""
        positive_emotions = {
            "joy", "gratitude", "love", "pride", "relief", "optimism", 
            "amusement", "excitement", "admiration"
        }
        negative_emotions = {
            "sadness", "anger", "fear", "disgust", "grief", "disappointment",
            "nervousness", "annoyance", "embarrassment"
        }
        
        score = 0
        for emotion_data in emotions:
            emotion = emotion_data["emotion"]
            confidence = emotion_data.get("confidence", 0.5)
            
            if emotion in positive_emotions:
                score += confidence
            elif emotion in negative_emotions:
                score -= confidence
        
        # Normalize to -1 to 1
        return max(-1, min(1, score / len(emotions)))
    
    def _score_to_sentiment(self, score: float) -> str:
        """Convert mood score to sentiment label"""
        if score > 0.3:
            return "positive"
        elif score < -0.3:
            return "negative"
        else:
            return "neutral"
    
    def _detect_trend(self, daily_moods: List[Dict]) -> str:
        """Detect mood trend"""
        if len(daily_moods) < 3:
            return "stable"
        
        # Compare first half to second half
        mid = len(daily_moods) // 2
        first_half_avg = sum(d["mood_score"] for d in daily_moods[:mid]) / mid
        second_half_avg = sum(d["mood_score"] for d in daily_moods[mid:]) / (len(daily_moods) - mid)
        
        diff = second_half_avg - first_half_avg
        
        if diff > 0.2:
            return "improving"
        elif diff < -0.2:
            return "declining"
        else:
            return "stable"
    
    def _anxiety_severity_to_score(self, severity: str) -> int:
        """Convert anxiety severity to numeric score"""
        severity_map = {
            "none": 0,
            "mild": 1,
            "moderate": 2,
            "severe": 3
        }
        return severity_map.get(severity, 0)
    
    def _identify_triggers(self, messages: List[Message]) -> List[Dict]:
        """Identify common anxiety triggers"""
        # Common trigger keywords
        trigger_keywords = {
            "work": ["work", "job", "boss", "deadline", "project"],
            "relationships": ["relationship", "partner", "friend", "family"],
            "health": ["health", "sick", "pain", "doctor"],
            "finances": ["money", "debt", "bills", "financial"],
            "future": ["future", "worry", "uncertain", "afraid"]
        }
        
        trigger_counts = Counter()
        
        for msg in messages:
            content_lower = msg.content.lower()
            for trigger, keywords in trigger_keywords.items():
                if any(keyword in content_lower for keyword in keywords):
                    trigger_counts[trigger] += 1
        
        return [
            {"trigger": trigger, "count": count}
            for trigger, count in trigger_counts.most_common(3)
        ]
    
    def _detect_anxiety_patterns(self, messages: List[Message]) -> List[str]:
        """Detect anxiety patterns"""
        patterns = []
        
        # Time of day pattern
        hours = [msg.timestamp.hour for msg in messages]
        hour_counts = Counter(hours)
        
        if hour_counts:
            most_common_hour = hour_counts.most_common(1)[0][0]
            if most_common_hour < 12:
                patterns.append("Anxiety tends to occur in the morning")
            elif most_common_hour < 17:
                patterns.append("Anxiety tends to occur in the afternoon")
            else:
                patterns.append("Anxiety tends to occur in the evening")
        
        # Day of week pattern
        weekdays = [msg.timestamp.weekday() for msg in messages]
        weekday_counts = Counter(weekdays)
        
        if weekday_counts:
            most_common_day = weekday_counts.most_common(1)[0][0]
            day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            patterns.append(f"More anxiety episodes on {day_names[most_common_day]}s")
        
        return patterns


# Singleton instance
_analytics_engine = None

def get_analytics_engine() -> AnalyticsEngine:
    """Get or create analytics engine singleton"""
    global _analytics_engine
    if _analytics_engine is None:
        _analytics_engine = AnalyticsEngine()
    return _analytics_engine


# Example usage
if __name__ == "__main__":
    print("Analytics Engine initialized!")
    print("Use get_analytics_engine() to access the engine")
