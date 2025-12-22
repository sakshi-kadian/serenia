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
        # Get analytics engine
        engine = get_analytics_engine()
        
        # Compare current week to previous week
        current_week = engine.calculate_mood_trends(user_id, db, period="week")
        previous_week = engine.calculate_mood_trends(user_id, db, period="week") # Still using 7 day logic internally for this one? Actually previous week logic is tricky now. 
        
        # Calculate progress
        current_score = current_week.get("average_score", 0)
        
        # Get previous week score (days 8-14)
        if previous_week["daily_moods"]:
            prev_moods = previous_week["daily_moods"][:7]  # First 7 days of 14-day period
            prev_score = sum(d["mood_score"] for d in prev_moods) / len(prev_moods) if prev_moods else 0
        else:
            prev_score = 0
        
        # Calculate improvement
        improvement = current_score - prev_score
        
        # Determine progress status
        if improvement > 0.2:
            status = "improving"
            message = "Your mood has improved significantly this week!"
        elif improvement < -0.2:
            status = "declining"
            message = "Your mood has declined this week. Consider reaching out for support."
        else:
            status = "stable"
            message = "Your mood has been relatively stable this week."
        
        return {
            "user_id": user_id,
            "status": status,
            "message": message,
            "current_week": {
                "sentiment": current_week["average_sentiment"],
                "score": current_score,
                "trend": current_week["trend"]
            },
            "previous_week": {
                "score": prev_score
            },
            "improvement": round(improvement, 2),
            "improvement_percentage": round(improvement * 100, 1)
        }
        
    except Exception as e:
        print(f"Error getting progress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
