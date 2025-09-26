from pydantic import BaseModel
from typing import List, Tuple
import datetime

class City(BaseModel):
    name: str
    coordinates: Tuple[float, float] #remember: longitude latitude

    class Config:
        from_attributes = True

class RouteRequest(BaseModel):
    start_coords: Tuple[float, float]
    end_coords: Tuple[float, float]
    origin_city: str
    destination_city: str

class CalculationHistoryBase(BaseModel):
    id: int
    origin_city: str
    destination_city: str
    distance_km: float
    modal: str
    carbon_footprint_kg: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True