# GREENSHIFT - Calculadora de Pegada de Carbono para E-commerce

## 🚀 Sobre o Projeto

O **GREENSHIFT** é uma aplicação full-stack projetada para trazer a sustentabilidade para o centro da logística de e-commerce. O objetivo foi construir uma ferramenta funcional que, a partir de um ponto de origem e destino, calcula não apenas a distância de uma rota, mas também estima a pegada de carbono da entrega com base em diferentes modais de transporte.

Desenvolvido como um projeto prático e aprofundado, o GREENSHIFT integra um backend robusto em **Python com FastAPI** e um frontend dinâmico e interativo em **React com TypeScript**. O desafio foi criar uma API performática, um banco de dados para análise histórica e uma experiência de usuário fluida e informativa, demonstrando competências técnicas alinhadas com as demandas atuais do mercado de tecnologia.

## ✨ Funcionalidades Principais

* **Geocodificação Inteligente:** Permite ao usuário buscar por nomes de cidades, que são convertidas em coordenadas geográficas em tempo real através de uma API externa, com a busca otimizada para o território brasileiro.
* **Cálculo de Rotas e Emissões:** Integração com a API do OpenRouteService para traçar a rota mais eficiente entre dois pontos e calcular a distância.
* **Análise Comparativa de Modais:** Para cada rota, o sistema calcula e exibe em um gráfico a pegada de carbono para uma frota diversificada de veículos (motos, carros a gasolina/etanol, caminhões a diesel, veículos elétricos), oferecendo uma visão clara do impacto de cada escolha.
* **Dashboard com Histórico:** Todos os cálculos são persistidos em um banco de dados. Um dashboard exibe o histórico de rotas calculadas de forma agrupada e organizada, permitindo uma análise dos dados ao longo do tempo.
* **API RESTful Performática:** Backend construído com FastAPI, garantindo respostas de baixa latência para uma experiência de usuário ágil e reativa.
* **Interface Reativa e Moderna:** O frontend, construído como uma Single Page Application (SPA), oferece feedback instantâneo (loading states, atualizações dinâmicas) sem a necessidade de recarregar a página.

## 🛠️ Tecnologias e Ferramentas

Este projeto foi construído com um ecossistema moderno, focando em tecnologias de alta demanda e boas práticas de desenvolvimento.

### **Backend**

* **Python 3.11+:** Utilizando uma versão moderna da linguagem, focada em performance e com suporte a tipagem estática (type hints).
* **FastAPI:** Framework ASGI de alta performance para a construção da API, escolhido por sua velocidade, documentação interativa automática (Swagger UI) e sistema de injeção de dependências.
* **SQLAlchemy:** Principal ORM (Object-Relational Mapper) do ecossistema Python, utilizado para mapear as classes Python para tabelas do banco de dados e gerenciar as sessões de forma segura.
* **Pydantic:** Usado extensivamente pelo FastAPI para validação, serialização e deserialização de dados, garantindo que os dados que entram e saem da API sigam um "contrato" bem definido.
* **Uvicorn:** Servidor ASGI de alta velocidade, recomendado para rodar aplicações FastAPI em produção e desenvolvimento.

### **Frontend**

* **React 18 + TypeScript:** Biblioteca líder para a construção de interfaces, combinada com TypeScript para garantir um código mais seguro, legível e escalável através da tipagem estática.
* **React Router:** Gerencia a navegação entre as páginas da aplicação (Calculadora e Dashboard), criando uma experiência de SPA fluida.
* **Axios:** Cliente HTTP para realizar a comunicação assíncrona entre o frontend e a API do backend.
* **React-Leaflet:** Biblioteca para a renderização de mapas interativos, utilizada para visualizar as rotas calculadas.
* **Chart.js:** Usada para criar os gráficos de barras dinâmicos que comparam a pegada de carbono entre os diferentes modais.

### **Banco de Dados**

* **SQLite:** Banco de dados relacional embarcado, escolhido pela simplicidade e facilidade de configuração em um ambiente de desenvolvimento, sendo perfeito para a persistência de dados do histórico de cálculos sem a necessidade de um servidor de banco de dados separado.

### **Testes**

* **Pytest:** Framework de testes padrão da comunidade Python, utilizado para criar uma suíte de testes automatizados que garantem a integridade e o funcionamento correto dos endpoints da API.

## 🏛️ Arquitetura e Padrões de Projeto

A estrutura do projeto foi desenhada para ser limpa, escalável e demonstrar a aplicação de conceitos sólidos de desenvolvimento de software.

### **Decisões de Arquitetura no Backend**

* **Arquitetura em Camadas (Routers, Schemas, Models):** O backend é claramente dividido em responsabilidades, seguindo as melhores práticas do FastAPI:
    * **Routers:** Camada de entrada da API. Define os endpoints (`/search-city`, `/calculate-footprint`), recebe as requisições e retorna as respostas.
    * **Schemas (Pydantic):** Define o "contrato" dos dados. Garante que os dados enviados pelo cliente estejam no formato correto e molda os dados que são enviados de volta.
    * **Models (SQLAlchemy):** Define a estrutura das tabelas no banco de dados.
    * **Config:** Um módulo centralizado para carregar configurações sensíveis (como a chave de API) a partir de variáveis de ambiente (`.env`), evitando que segredos sejam expostos no código.

* **Injeção de Dependências (DI):** Um dos recursos mais poderosos do FastAPI, usado para gerenciar a sessão do banco de dados (`Depends(get_db)`). Isso desacopla a lógica de negócio da configuração do banco de dados, tornando o código mais limpo, reutilizável e muito mais fácil de testar.

### **Decisões de Arquitetura no Frontend**

* **Componentização:** A interface é quebrada em componentes reutilizáveis (Header, CalculatorForm, ResultsDisplay), cada um com sua própria responsabilidade, tornando o código mais fácil de manter.
* **Elevação de Estado (Lifting State Up):** O estado principal da aplicação (como os dados da última rota calculada) é gerenciado no componente `App.tsx`, o ancestral comum, e passado para os componentes filhos via *props*. Isso garante um fluxo de dados unidirecional e consistente, permitindo que o estado persista durante a navegação entre páginas.
* **Hooks Customizados (`useDebounce`):** Para otimizar a performance, foi criado um hook customizado que implementa o padrão "debounce". Isso evita chamadas excessivas à API de busca de cidades, disparando a requisição apenas quando o usuário para de digitar, o que melhora significativamente a experiência do usuário.

## ⚙️ Como Executar o Projeto

### **Pré-requisitos**

* Python 3.9+
* Node.js e npm

### **Backend**

```bash
# Clone o repositório
git clone [https://github.com/supp3rguto/GreenShift-fullstack-project.git](https://github.com/supp3rguto/GreenShift-fullstack-project.git)

# Navegue para a pasta do backend
cd GreenShift-fullstack-project/backend

# Crie e ative um ambiente virtual
python -m venv venv
# No Windows:
.\venv\Scripts\activate
# No macOS/Linux:
# source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Crie o arquivo .env dentro da pasta app/ e adicione sua chave da API
# Exemplo de conteúdo para backend/app/.env:
# ORS_API_KEY="sua_chave_aqui"

# Execute o servidor
uvicorn app.main:app --reload
````

O servidor backend estará rodando em `http://localhost:8000`.

### **Frontend**

```bash
# Em outro terminal, navegue para a pasta do frontend
cd GreenShift-fullstack-project/frontend

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

A aplicação React estará disponível em `http://localhost:3000`.

## 👨‍💻 Autor

**Augusto Ortigoso Barbosa**

  * **GitHub:** [github.com/supp3rguto](https://github.com/supp3rguto)
  * **LinkedIn:** [linkedin.com/in/augusto-barbosa-769602194](https://www.linkedin.com/in/augusto-barbosa-769602194)
