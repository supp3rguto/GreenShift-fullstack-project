import os 
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal

from app.config import ORS_API_KEY

router = APIRouter()
ORS_API_KEY = os.getenv("ORS_API_KEY")

EMISSION_FACTORS = {
    "moto": 0.105,
    "carro_gasolina": 0.192,
    "caminhao_pequeno": 0.250,
    "veiculo_eletrico": 0.015,
}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/search-city", response_model=list[schemas.City])
async def search_city(q: str):
    print(f"--- DEBUG: Chave de API sendo usada: {ORS_API_KEY} ---")

    if not ORS_API_KEY:
        raise HTTPException(status_code=500, detail="Chave de API não configurada.")

    try:
        response = requests.get(f"https://api.openrouteservice.org/geocode/search?api_key={ORS_API_KEY}&text={q}&layers=locality,region&boundary.country=BRA")
        response.raise_for_status()
        data = response.json()
        
        cities = []
        for feature in data.get("features", []):
            properties = feature.get("properties", {})
            geometry = feature.get("geometry", {})
            
            city_name = properties.get("locality", "Nome desconhecido")
            region = properties.get("region", "")
            full_name = f"{city_name}, {region}" if region else city_name

            if "coordinates" in geometry:
                cities.append({
                    "name": full_name,
                    "coordinates": tuple(geometry["coordinates"])
                })
        return cities

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Erro ao contatar a API de geocodificação: {e}")


@router.post("/calculate-footprint")
async def calculate_footprint(request: schemas.RouteRequest, db: Session = Depends(get_db)):
    if not ORS_API_KEY:
        raise HTTPException(status_code=500, detail="Chave de API não configurada.")

    headers = {'Authorization': ORS_API_KEY}
    body = {"coordinates": [request.start_coords, request.end_coords]}
    
    try:
        response = requests.post(
            'https://api.openrouteservice.org/v2/directions/driving-car',
            json=body,
            headers=headers
        )
        response.raise_for_status()
        data = response.json()
        
        distance_km = data['routes'][0]['summary']['distance'] / 1000
        route_geometry = data['routes'][0]['geometry']
        
        results = []
        for modal, factor in EMISSION_FACTORS.items():
            carbon_footprint_kg = distance_km * factor
            
            db_calculation = models.CalculationHistory(
                origin_city=request.origin_city,
                destination_city=request.destination_city,
                distance_km=round(distance_km, 2),
                modal=modal,
                carbon_footprint_kg=round(carbon_footprint_kg, 2)
            )
            db.add(db_calculation)
            
            results.append({
                "modal": modal.replace("_", " ").title(),
                "carbon_footprint_kg": round(carbon_footprint_kg, 2),
            })
        
        db.commit()

        return {
            "distance_km": round(distance_km, 2),
            "route_geometry": route_geometry,
            "footprint_analysis": results
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Erro ao calcular a rota: {e}")
    
@router.get("/calculations", response_model=list[schemas.CalculationHistoryBase])
async def get_all_calculations(db: Session = Depends(get_db)):

    history = db.query(models.CalculationHistory).order_by(models.CalculationHistory.created_at.desc()).all()
    return history