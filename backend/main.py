# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from emission_factors import FACTORS
from fastapi.middleware.cors import CORSMiddleware 

load_dotenv() 

app = FastAPI()

origins = [
    "http://localhost:3000", 
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ORS_API_KEY = os.getenv("ORS_API_KEY")

class RouteRequest(BaseModel):
    start_coords: tuple[float, float] 
    end_coords: tuple[float, float]

def get_route_data(start, end):
    headers = {
        'Authorization': ORS_API_KEY,
    }
    body = {"coordinates": [start, end]}
    
    response = requests.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        json=body,
        headers=headers
    )
    
    if response.status_code != 200:
        return None
        
    data = response.json()
    distance_km = data['routes'][0]['summary']['distance'] / 1000
    route_geometry = data['routes'][0]['geometry']
    return {"distance_km": distance_km, "geometry": route_geometry}

@app.post("/calculate-footprint")
async def calculate_footprint(request: RouteRequest):
    route_data = get_route_data(request.start_coords, request.end_coords)
    
    if not route_data:
        raise HTTPException(status_code=500, detail="Erro ao calcular a rota.")

    distance_km = route_data["distance_km"]
    
    results = []
    for modal, factor in FACTORS.items():
        carbon_footprint_g = distance_km * factor
        results.append({
            "modal": modal.replace("_", " ").title(),
            "factor_g_per_km": factor,
            "carbon_footprint_g": round(carbon_footprint_g, 2),
            "carbon_footprint_kg": round(carbon_footprint_g / 1000, 2),
        })

    return {
        "distance_km": round(distance_km, 2),
        "route_geometry": route_data["geometry"], 
        "footprint_analysis": results
    }