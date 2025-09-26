# backend/emission_factors.py
# Fatores de emissão em gramas de CO₂ por quilômetro (gCO₂/km)
# Fonte: Valores ilustrativos, pesquise dados reais para maior precisão.
FACTORS = {
    "moto": 105,
    "carro_gasolina": 192,
    "caminhao_pequeno": 250,
    "veiculo_eletrico": 15, # Emissão na geração de eletricidade
}