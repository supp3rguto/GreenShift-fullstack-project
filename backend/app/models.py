from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
import datetime

class CalculationHistory(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    origin_city = Column(String)
    destination_city = Column(String)
    distance_km = Column(Float)
    modal = Column(String)
    carbon_footprint_kg = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)