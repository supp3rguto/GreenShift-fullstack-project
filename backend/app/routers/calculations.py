import requests
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from starlette import status

from app import models, schemas
from app.config import ORS_API_KEY
from app.database import SessionLocal

router = APIRouter()

EMISSION_FACTORS = {
    "moto_gasolina": 0.105,         # Motocicleta padrão
    "carro_pequeno_gasolina": 0.148, # Carro 1.0/1.4 moderno
    "carro_pequeno_etanol": 0.115,   # Mesmo carro, movido a etanol
    "carro_medio_gasolina": 0.175,  # SUV/Sedan médio a gasolina
    "pickup_diesel": 0.220,         # Camionete/SUV a diesel
    "caminhao_pequeno_diesel": 0.280, # VUC (Veículo Urbano de Carga)
    "veiculo_eletrico": 0.015,       # Considerando a matriz energética brasileira
}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/search-city", response_model=list[schemas.City])
async def search_city(q: str):
    if not ORS_API_KEY:
        raise HTTPException(status_code=500, detail="Chave de API não configurada.")
    
    try:
        url = f"https://api.openrouteservice.org/geocode/search?api_key={ORS_API_KEY}&text={q}&layers=locality,region&boundary.country=BRA"
        response = requests.get(url)
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
                cities.append({"name": full_name, "coordinates": tuple(geometry["coordinates"])})
        return cities

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Erro ao contatar a API de geocodificação: {e}")

@router.post("/calculate-footprint")
async def calculate_footprint(request: schemas.RouteRequest, db: Session = Depends(get_db)):
    headers = {'Authorization': ORS_API_KEY}
    body = {"coordinates": [request.start_coords, request.end_coords]}
    
    try:
        response = requests.post(
            'https://api.openrouteservice.org/v2/directions/driving-car', json=body, headers=headers
        )
        response.raise_for_status()
        data = response.json()
        
        distance_km = data['routes'][0]['summary']['distance'] / 1000
        route_geometry = data['routes'][0]['geometry']
        
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
        db.commit()
        
        results = [
            {"modal": modal.replace("_", " ").title(), "carbon_footprint_kg": round(distance_km * factor, 2)}
            for modal, factor in EMISSION_FACTORS.items()
        ]

        return {
            "distance_km": round(distance_km, 2),
            "route_geometry": route_geometry,
            "footprint_analysis": results
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {e}")

@router.get("/calculations", response_model=list[schemas.CalculationHistoryBase])
async def get_all_calculations(db: Session = Depends(get_db)):
    history = db.query(models.CalculationHistory).order_by(models.CalculationHistory.created_at.desc()).all()
    return history

@router.delete("/calculations", status_code=status.HTTP_204_NO_CONTENT)
async def clear_all_calculations(db: Session = Depends(get_db)):
    try:
        db.query(models.CalculationHistory).delete()
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao limpar o histórico: {e}")