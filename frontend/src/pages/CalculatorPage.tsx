import React, { useState } from 'react';
import axios from 'axios';
import CalculatorForm from '../components/CalculatorForm';
import ResultsDisplay from '../components/ResultDisplay';

interface SelectedCity {
  name: string;
  coords: [number, number];
}

const CalculatorPage = () => {
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (origin: SelectedCity, destination: SelectedCity) => {
    setError(null);
    setRouteData(null); // Limpa resultados antigos
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
    <>
      <CalculatorForm onCalculate={handleCalculate} setIsLoading={setIsLoading} />
      {isLoading && <p style={{textAlign: 'center', fontSize: '1.2rem', margin: '2rem'}}>Calculando...</p>}
      {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}
      {routeData && <ResultsDisplay routeData={routeData} />}
    </>
  );
};

export default CalculatorPage;