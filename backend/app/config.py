import os
from dotenv import load_dotenv
from pathlib import Path

print("\n--- DEBUG: [config.py] Começando a carregar configurações. ---")

# builda o caminho para o arquivo .env
env_path = Path(__file__).parent / '.env'
print(f"--- DEBUG: [config.py] Procurando pelo arquivo .env em: {env_path} ---")

# aqui vai retorna True se encontrou e carregou o arquivo, e False se não encontrou.
found_dotenv = load_dotenv(dotenv_path=env_path)
print(f"--- DEBUG: [config.py] A função load_dotenv encontrou o arquivo? {found_dotenv} ---")

ORS_API_KEY = os.getenv("ORS_API_KEY")
print(f"--- DEBUG: [config.py] Valor lido para ORS_API_KEY: {ORS_API_KEY} ---\n")