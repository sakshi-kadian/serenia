"""
Configuration module for Serenia Backend
Loads environment variables and provides configuration settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "Serenia API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "change-this-secret-key-in-production"
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/serenia_db"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "serenia_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "password"
    
    # API Keys
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Model Paths
    EMOTION_MODEL_PATH: str = "./models/emotion_model"
    ANXIETY_MODEL_PATH: str = "./models/anxiety_model"
    
    # Crisis Resources
    CRISIS_HOTLINE_US: str = "988"
    CRISIS_HOTLINE_TEXT: str = "741741"
    CRISIS_CHAT_URL: str = "https://988lifeline.org/chat"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/serenia.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Crisis resources configuration
CRISIS_RESOURCES = {
    "hotline": {
        "name": "988 Suicide & Crisis Lifeline",
        "number": settings.CRISIS_HOTLINE_US,
        "description": "24/7 free and confidential support"
    },
    "text": {
        "number": settings.CRISIS_HOTLINE_TEXT,
        "description": "Text HOME to 741741"
    },
    "chat": {
        "url": settings.CRISIS_CHAT_URL,
        "description": "Online crisis chat support"
    }
}

# Emotion labels (from GoEmotions dataset)
EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval",
    "caring", "confusion", "curiosity", "desire", "disappointment",
    "disapproval", "disgust", "embarrassment", "excitement", "fear",
    "gratitude", "grief", "joy", "love", "nervousness",
    "optimism", "pride", "realization", "relief", "remorse",
    "sadness", "surprise", "neutral"
]

# Anxiety severity levels
ANXIETY_LEVELS = {
    "none": {"min": 0.0, "max": 0.3, "label": "No Anxiety"},
    "mild": {"min": 0.3, "max": 0.5, "label": "Mild Anxiety"},
    "moderate": {"min": 0.5, "max": 0.7, "label": "Moderate Anxiety"},
    "severe": {"min": 0.7, "max": 1.0, "label": "Severe Anxiety"}
}

# Crisis keywords (red flags)
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end it all", "want to die",
    "self-harm", "hurt myself", "cut myself", "no reason to live",
    "better off dead", "can't go on", "hopeless", "worthless"
]
