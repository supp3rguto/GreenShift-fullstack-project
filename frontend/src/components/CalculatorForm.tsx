import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';

interface City { name: string; coordinates: [number, number]; }
interface SelectedCity { name: string; coords: [number, number]; }

interface CalculatorFormProps {
  onCalculate: (start: SelectedCity, end: SelectedCity) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, setIsLoading }) => {
  const [originText, setOriginText] = useState('');
  const [destText, setDestText] = useState('');
  
  const debouncedOriginTerm = useDebounce(originText, 400);
  const debouncedDestTerm = useDebounce(destText, 400);

  const [originResults, setOriginResults] = useState<City[]>([]);
  const [destResults, setDestResults] = useState<City[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<SelectedCity | null>(null);
  const [selectedDest, setSelectedDest] = useState<SelectedCity | null>(null);

  const [isOriginSearching, setOriginSearching] = useState(false);
  const [isDestSearching, setDestSearching] = useState(false);
  
  const originSearchRef = useRef<HTMLDivElement>(null);
  const destSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originSearchRef.current && !originSearchRef.current.contains(event.target as Node)) {
        setOriginResults([]);
      }
      if (destSearchRef.current && !destSearchRef.current.contains(event.target as Node)) {
        setDestResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const search = async () => {
      if (debouncedOriginTerm.length < 3 || (selectedOrigin && selectedOrigin.name === debouncedOriginTerm)) {
        setOriginResults([]); setOriginSearching(false); return;
      }
      setOriginSearching(true);
      try {
        const response = await axios.get(`http://localhost:8000/search-city?q=${debouncedOriginTerm}`);
        setOriginResults(response.data);
      } catch (error) { console.error("Erro na busca de cidade de origem:", error); } 
      finally { setOriginSearching(false); }
    };
    search();
  }, [debouncedOriginTerm, selectedOrigin]);

  useEffect(() => {
    const search = async () => {
      if (debouncedDestTerm.length < 3 || (selectedDest && selectedDest.name === debouncedDestTerm)) {
        setDestResults([]); setDestSearching(false); return;
      }
      setDestSearching(true);
      try {
        const response = await axios.get(`http://localhost:8000/search-city?q=${debouncedDestTerm}`);
        setDestResults(response.data);
      } catch (error) { console.error("Erro na busca de cidade de destino:", error); } 
      finally { setDestSearching(false); }
    };
    search();
  }, [debouncedDestTerm, selectedDest]);

  const handleSelectCity = (type: 'origin' | 'destination', city: City) => {
    if (type === 'origin') {
      setSelectedOrigin({ name: city.name, coords: city.coordinates });
      setOriginText(city.name);
      setOriginResults([]);
    } else {
      setSelectedDest({ name: city.name, coords: city.coordinates });
      setDestText(city.name);
      setDestResults([]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedOrigin && selectedDest) {
      setIsLoading(true);
      onCalculate(selectedOrigin, selectedDest);
    }
  }

  return (
    <section className="hero-section">
      <h1>Calcule o Impacto Ambiental de Suas Entregas</h1>
      <p>Transforme dados logísticos em um ativo de sustentabilidade.</p>
      <div className="form-container">
        <div className="search-input-wrapper" ref={originSearchRef}>
          <input type="text" className="search-input" placeholder="Cidade de Origem" value={originText}
            onChange={(e) => { setOriginText(e.target.value); setSelectedOrigin(null); }}
          />
          {originText.length >= 3 && (
            <ul className="search-results">
              {isOriginSearching && <li className="search-info">Carregando...</li>}
              {!isOriginSearching && originResults.length === 0 && originText !== selectedOrigin?.name && <li className="search-info">Nenhuma cidade encontrada.</li>}
              {originResults.map((city, index) => (
                <li key={index} onMouseDown={() => handleSelectCity('origin', city)}>{city.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="search-input-wrapper" ref={destSearchRef}>
          <input type="text" className="search-input" placeholder="Cidade de Destino" value={destText}
            onChange={(e) => { setDestText(e.target.value); setSelectedDest(null); }}
          />
          {destText.length >= 3 && (
            <ul className="search-results">
              {isDestSearching && <li className="search-info">Carregando...</li>}
              {!isDestSearching && destResults.length === 0 && destText !== selectedDest?.name && <li className="search-info">Nenhuma cidade encontrada.</li>}
              {destResults.map((city, index) => (
                <li key={index} onMouseDown={() => handleSelectCity('destination', city)}>{city.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button className="calculate-button" onClick={handleSubmit} disabled={!selectedOrigin || !selectedDest}>
          Calcular
        </button>
      </div>
    </section>
  );
};

export default CalculatorForm;