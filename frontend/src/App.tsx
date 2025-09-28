import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorPage from './pages/CalculatorPage';
import DashboardPage from './pages/DashboardPage';
import axios from 'axios';
import './App.css';
import 'leaflet/dist/leaflet.css';

interface SelectedCity {
  name: string;
  coords: [number, number];
}

function App() {
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (origin: SelectedCity, destination: SelectedCity) => {
    setError(null);
    setRouteData(null);
    setIsLoading(true); // Garantimos que o isLoading é ativado aqui
    try {
      const response = await axios.post('http://localhost:8000/calculate-footprint', {
        start_coords: origin.coords,
        end_coords: destination.coords,
        origin_city: origin.name,
        destination_city: destination.name,
      });
      setRouteData(response.data);
    } catch (err) {
      setError("Não foi possível calcular a rota. O backend está rodando?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="main-layout">
        <Header />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <CalculatorPage 
                  routeData={routeData}
                  isLoading={isLoading}
                  error={error}
                  onCalculate={handleCalculate}
                  setIsLoading={setIsLoading}
                />
              } 
            />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;