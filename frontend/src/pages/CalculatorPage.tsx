import React from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ResultsDisplay from '../components/ResultDisplay';

interface SelectedCity { name: string; coords: [number, number]; }

interface CalculatorPageProps {
  routeData: any;
  isLoading: boolean;
  error: string | null;
  onCalculate: (origin: SelectedCity, destination: SelectedCity) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({ routeData, isLoading, error, onCalculate, setIsLoading }) => {
  return (
    <>
      <CalculatorForm onCalculate={onCalculate} setIsLoading={setIsLoading} />
      {isLoading && <p style={{textAlign: 'center', fontSize: '1.2rem', margin: '2rem'}}>Calculando...</p>}
      {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}
      {routeData && <ResultsDisplay routeData={routeData} />}
    </>
  );
};

export default CalculatorPage;