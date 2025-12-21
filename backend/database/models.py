"""
Database Models for Serenia
SQLAlchemy ORM models for conversations, messages, reflections, and insights
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    """Generate UUID for primary keys"""
    return str(uuid.uuid4())

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    reflections = relationship("Reflection", back_populates="user", cascade="all, delete-orphan")

class Conversation(Base):
    """Conversation model"""
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    message_count = Column(Integer, default=0)
    
    # Emotional summary
    dominant_emotion = Column(String, nullable=True)
    average_anxiety_level = Column(String, nullable=True)
    crisis_detected = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    """Message model"""
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # NLP Analysis (for user messages)
    emotion = Column(String, nullable=True)
    emotion_confidence = Column(Float, nullable=True)
    emotion_details = Column(JSON, nullable=True)  # Full emotion analysis
    
    anxiety_detected = Column(Boolean, default=False)
    anxiety_severity = Column(String, nullable=True)
    anxiety_confidence = Column(Float, nullable=True)
    
    crisis_detected = Column(Boolean, default=False)
    crisis_severity = Column(String, nullable=True)
    crisis_keywords = Column(JSON, nullable=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

class Reflection(Base):
    """AI-generated reflection model"""
    __tablename__ = "reflections"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=True)
    
    # Reflection content
    ai_generated_text = Column(Text, nullable=False)
    user_edited_text = Column(Text, nullable=True)
    final_text = Column(Text, nullable=False)  # What user approved
    
    # Metadata
    emotions_detected = Column(JSON, nullable=True)  # List of emotions
    key_insights = Column(JSON, nullable=True)  # AI-identified insights
    topics = Column(JSON, nullable=True)  # Main topics discussed
    key_moments = Column(JSON, nullable=True)  # Significant emotional moments
    
    # Status
    user_approved = Column(Boolean, default=False)
    is_edited = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reflections")

class Insight(Base):
    """Analytics insights model"""
    __tablename__ = "insights"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Time period
    period_type = Column(String, nullable=False)  # 'daily', 'weekly', 'monthly'
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # Mood trends
    mood_scores = Column(JSON, nullable=True)  # Daily mood scores
    dominant_emotions = Column(JSON, nullable=True)  # Top emotions
    
    # Anxiety patterns
    anxiety_scores = Column(JSON, nullable=True)
    anxiety_triggers = Column(JSON, nullable=True)
    
    # AI-generated insights
    ai_insight_text = Column(Text, nullable=True)
    recommendations = Column(JSON, nullable=True)
    
    # Progress indicators
    improvement_detected = Column(Boolean, default=False)
    improvement_areas = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Note: No direct relationship to User to keep it simple
    # We'll query by user_id
