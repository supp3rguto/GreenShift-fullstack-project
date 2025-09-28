from fastapi.testclient import TestClient
from app.main import app  # Importa nossa aplicação FastAPI
import os
import pytest

# Remove o banco de dados de teste se ele existir de um teste anterior
if os.path.exists("./test.db"):
    os.remove("./test.db")

# Cria um cliente de teste que "conversa" com nossa API
client = TestClient(app)

def test_read_root():
    """Testa se a rota principal "/" está funcionando."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Project": "GREENSHIFT API"}

def test_search_city_valid():
    """Testa a busca por uma cidade válida."""
    response = client.get("/search-city?q=Campinas")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Verifica se o primeiro resultado contém as chaves esperadas
    assert "name" in data[0]
    assert "coordinates" in data[0]
    assert "Campinas" in data[0]["name"]

def test_search_city_invalid():
    """Testa a busca por uma cidade que não existe."""
    response = client.get("/search-city?q=xwyz123")
    assert response.status_code == 200
    assert response.json() == []

def test_full_calculation_flow():
    """
    Um teste completo: calcula uma rota, verifica o histórico e depois limpa.
    """
    # 1. Limpa o histórico para garantir um teste limpo
    response_delete = client.delete("/calculations")
    assert response_delete.status_code == 204 # 204 No Content

    # 2. Faz um cálculo de rota
    payload = {
        "start_coords": [-46.6333, -23.5505], # São Paulo
        "end_coords": [-47.0616, -22.9068],   # Campinas
        "origin_city": "São Paulo, Sao Paulo",
        "destination_city": "Campinas, Sao Paulo"
    }
    response_calc = client.post("/calculate-footprint", json=payload)
    assert response_calc.status_code == 200
    data_calc = response_calc.json()
    assert "distance_km" in data_calc
    assert "footprint_analysis" in data_calc
    # Verifica se calculou para todos os nossos veículos (atualmente 7)
    assert len(data_calc["footprint_analysis"]) == 7

    # 3. Verifica se o histórico foi salvo corretamente
    response_hist = client.get("/calculations")
    assert response_hist.status_code == 200
    data_hist = response_hist.json()
    assert len(data_hist) == 7 # Deve haver 7 registros (um para cada veículo)
    assert data_hist[0]["origin_city"] == "São Paulo, Sao Paulo"

    # 4. Limpa o histórico novamente no final do teste
    response_delete_final = client.delete("/calculations")
    assert response_delete_final.status_code == 204