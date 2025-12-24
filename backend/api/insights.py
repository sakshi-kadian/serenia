"""
Insights API Router
Handles analytics, mood trends, and AI-generated insights
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from sqlalchemy.orm import Session

from database import get_db
from insights import get_analytics_engine

router = APIRouter()

# Response Models
class MoodTrendsResponse(BaseModel):
    """Mood trends response"""
    period_days: int
    message_count: int
    daily_moods: List[Dict]
    dominant_emotions: List[Dict]
    average_sentiment: str
    average_score: float
    trend: str

class AnxietyPatternsResponse(BaseModel):
    """Anxiety patterns response"""
    period_days: int
    anxiety_detected: bool
    anxiety_episodes: int
    severity_distribution: Dict
    triggers: List[Dict]
    patterns: List[str]
    anxiety_scores: List[Dict]

class InsightsResponse(BaseModel):
    """AI insights response"""
    period: str
    period_days: int
    insights: List[str]
    recommendations: List[str]
    mood_summary: Dict
    anxiety_summary: Dict

@router.get("/{user_id}/mood-trends", response_model=MoodTrendsResponse)
async def get_mood_trends(
    user_id: str,
    period: Optional[str] = "week",
    db: Session = Depends(get_db)
):
    """
    Get mood trends for a user
    
    Args:
        user_id: User ID
        period: Time period ('week', 'month', 'year')
        db: Database session
    
    Returns:
        Mood trends data
    """
    try:
        # Get analytics engine
        engine = get_analytics_engine()
        
        # Calculate mood trends
        mood_data = engine.calculate_mood_trends(user_id, db, period)
        
        return MoodTrendsResponse(**mood_data)
        
    except Exception as e:
        print(f"Error getting mood trends: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{user_id}/anxiety-patterns", response_model=AnxietyPatternsResponse)
async def get_anxiety_patterns(
    user_id: str,
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """
    Get anxiety patterns for a user
    
    Args:
        user_id: User ID
        days: Number of days to analyze (default: 30)
        db: Database session
    
    Returns:
        Anxiety patterns data
    """
    try:
        # Get analytics engine
        engine = get_analytics_engine()
        
        # Analyze anxiety patterns
        anxiety_data = engine.analyze_anxiety_patterns(user_id, db, days)
        
        return AnxietyPatternsResponse(**anxiety_data)
        
    except Exception as e:
        print(f"Error getting anxiety patterns: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{user_id}/insights", response_model=InsightsResponse)
async def get_insights(
    user_id: str,
    period: Optional[str] = "weekly",
    db: Session = Depends(get_db)
):
    """
    Get AI-generated insights for a user
    
    Args:
        user_id: User ID
        period: 'weekly' or 'monthly' (default: weekly)
        db: Database session
    
    Returns:
        AI-generated insights
    """
    try:
        # Validate period
        if period not in ["weekly", "monthly"]:
            raise HTTPException(status_code=400, detail="Period must be 'weekly' or 'monthly'")
        
        # Get analytics engine
        engine = get_analytics_engine()
        
        # Generate insights
        insights_data = engine.generate_insights(user_id, db, period)
        
        return InsightsResponse(**insights_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{user_id}/summary")
async def get_summary(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get complete analytics summary for a user
    
    Args:
        user_id: User ID
        db: Database session
    
    Returns:
        Complete analytics summary
    """
    try:
        # Get analytics engine
        engine = get_analytics_engine()
        
        # Get all analytics data
        mood_7day = engine.calculate_mood_trends(user_id, db, period="week")
        mood_30day = engine.calculate_mood_trends(user_id, db, period="month")
        anxiety_data = engine.analyze_anxiety_patterns(user_id, db, days=30)
        insights_data = engine.generate_insights(user_id, db, period="weekly")
        
        return {
            "user_id": user_id,
            "mood_trends": {
                "7_day": {
                    "average_sentiment": mood_7day["average_sentiment"],
                    "trend": mood_7day["trend"],
                    "message_count": mood_7day["message_count"]
                },
                "30_day": {
                    "average_sentiment": mood_30day["average_sentiment"],
                    "trend": mood_30day["trend"],
                    "message_count": mood_30day["message_count"]
                }
            },
            "anxiety": {
                "detected": anxiety_data["anxiety_detected"],
                "episodes_30_day": anxiety_data["anxiety_episodes"],
                "top_trigger": anxiety_data["triggers"][0]["trigger"] if anxiety_data["triggers"] else None
            },
            "insights": {
                "latest": insights_data["insights"][:2],  # Top 2 insights
                "recommendations": insights_data["recommendations"][:2]  # Top 2 recommendations
            },
            "dominant_emotions": mood_7day["dominant_emotions"][:3]  # Top 3 emotions
        }
        
    except Exception as e:
        print(f"Error getting summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{user_id}/progress")
async def get_progress(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get progress indicators for a user
    
    Args:
        user_id: User ID
        db: Database session
    
    Returns:
        Progress indicators
    """
    try:
        from datetime import datetime, timedelta
        
        # Calculate date ranges for current and previous week
        now = datetime.utcnow()
        
        # Current week (last 7 days)
        current_end = now
        current_start = now - timedelta(days=6)  # 6 days ago + today = 7 days
        
        # Previous week (days 7-13 ago)
        previous_end = current_start - timedelta(seconds=1)  # End of previous week
        previous_start = previous_end - timedelta(days=6)  # 7 days before that
        
        # Get messages for current week
        current_messages = db.query(Message).join(Conversation).filter(
            Conversation.user_id == user_id,
            Message.role == "user",
            Message.timestamp >= current_start,
            Message.timestamp <= current_end,
            Message.emotion.isnot(None)
        ).all()
        
        # Get messages for previous week
        previous_messages = db.query(Message).join(Conversation).filter(
            Conversation.user_id == user_id,
            Message.role == "user",
            Message.timestamp >= previous_start,
            Message.timestamp <= previous_end,
            Message.emotion.isnot(None)
        ).all()
        
        # Calculate average mood scores
        def calculate_avg_mood(messages):
            if not messages:
                return 0
            # Map emotions to scores (simplified)
            emotion_scores = {
                "joy": 1.0, "love": 0.9, "gratitude": 0.8, "optimism": 0.7,
                "admiration": 0.6, "approval": 0.5, "caring": 0.5, "excitement": 0.7,
                "amusement": 0.6, "pride": 0.7, "relief": 0.6, "desire": 0.5,
                "neutral": 0.0, "realization": 0.0, "surprise": 0.0, "curiosity": 0.0,
                "confusion": -0.3, "nervousness": -0.4, "disappointment": -0.5,
                "sadness": -0.7, "grief": -0.8, "remorse": -0.6, "embarrassment": -0.5,
                "fear": -0.7, "disgust": -0.6, "anger": -0.8, "annoyance": -0.5,
                "disapproval": -0.4
            }
            scores = [emotion_scores.get(msg.emotion, 0) for msg in messages]
            return sum(scores) / len(scores) if scores else 0
        
        current_score = calculate_avg_mood(current_messages)
        previous_score = calculate_avg_mood(previous_messages)
        
        # Calculate improvement
        improvement = current_score - previous_score
        
        # Calculate percentage change
        if previous_score != 0:
            percentage_change = (improvement / abs(previous_score)) * 100
        else:
            percentage_change = 0 if current_score == 0 else 100
        
        # Determine progress status
        if improvement > 0.2:
            status = "improving"
            message = f"Your mood has improved this week! (+{abs(percentage_change):.1f}%)"
        elif improvement < -0.2:
            status = "declining"
            message = f"Your mood has declined this week. Consider reaching out for support. ({percentage_change:.1f}%)"
        else:
            status = "stable"
            message = "Your mood has been relatively stable this week."
        
        return {
            "user_id": user_id,
            "status": status,
            "message": message,
            "current_week": {
                "score": current_score,
                "message_count": len(current_messages),
                "start_date": current_start.isoformat(),
                "end_date": current_end.isoformat()
            },
            "previous_week": {
                "score": previous_score,
                "message_count": len(previous_messages),
                "start_date": previous_start.isoformat(),
                "end_date": previous_end.isoformat()
            },
            "improvement": round(improvement, 2),
            "improvement_percentage": round(percentage_change, 1)
        }
        
    except Exception as e:
        print(f"Error getting progress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
