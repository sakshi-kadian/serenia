"""
Database Connection and Session Management
Handles SQLAlchemy engine and session creation
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

from .models import Base

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in environment variables")

# Create engine
# Use NullPool for serverless/Supabase to avoid connection pooling issues
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    echo=False  # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Initialize database - create all tables
    Call this once when setting up the database
    """
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def get_db() -> Session:
    """
    Get database session
    Use as dependency injection in FastAPI
    
    Usage:
        @app.get("/")
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def drop_all_tables():
    """
    Drop all tables - USE WITH CAUTION!
    Only for development/testing
    """
    print("Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped!")

# Test connection
def test_connection():
    """Test database connection"""
    try:
        with engine.connect() as conn:
            print("Database connection successful!")
            return True
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return False
