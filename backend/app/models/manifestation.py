from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Manifestation(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    manifestation_text = Column(Text, nullable=False)
    # Storing input criteria as JSON or separate columns? 
    # For now, let's keep it simple or expand if requested. 
    # Requirement: "Store manifestation history"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
