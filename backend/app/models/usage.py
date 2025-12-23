from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Usage(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    endpoint = Column(String, index=True)
    tokens_used = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    duration_ms = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
