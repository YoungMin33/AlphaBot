from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core import settings

# Configure SQLAlchemy engine and session factory.  Using future=True
# (SQLAlchemy 1.4+ behaviour) keeps things aligned with modern patterns.

# Postgres추가 전까지 SQLite를 사용하기 위해 connect_args={"check_same_thread": False} 임시추가
engine = create_engine(settings.database_url, connect_args={"check_same_thread": False}, future=True, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

 
def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
