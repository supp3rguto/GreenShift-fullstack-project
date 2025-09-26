import React, { useState } from 'react';
import axios from 'axios';

// Tipagem para os dados que esperamos
interface City {
  name: string;
  coordinates: [number, number];
}

interface SelectedCity {
  name: string;
  coords: [number, number];
}

interface CalculatorFormProps {
  onCalculate: (start: SelectedCity, end: SelectedCity) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, setIsLoading }) => {
  const [originText, setOriginText] = useState('');
  const [destText, setDestText] = useState('');
  
  const [originResults, setOriginResults] = useState<City[]>([]);
  const [destResults, setDestResults] = useState<City[]>([]);

  const [selectedOrigin, setSelectedOrigin] = useState<SelectedCity | null>(null);
  const [selectedDest, setSelectedDest] = useState<SelectedCity | null>(null);

   const handleSearch = async (type: 'origin' | 'destination') => {
    const query = type === 'origin' ? originText : destText;
    const selected = type === 'origin' ? selectedOrigin : selectedDest;

    if (selected && query === selected.name) {
      return;
    }

    if (query.length < 3) {
      if (type === 'origin') setOriginResults([]);
      else setDestResults([]);
      return;
    };

    try {
      const response = await axios.get(`http://localhost:8000/search-city?q=${query}`);
      if (type === 'origin') {
        setOriginResults(response.data);
      } else {
        setDestResults(response.data);
      }
    } catch (error) {
      console.error("Erro na busca de cidade:", error);
    }
  };

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
        
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Cidade de Origem"
            value={originText}
            onChange={(e) => {
              setOriginText(e.target.value);
              setSelectedOrigin(null); // Limpa seleção se o texto mudar
            }}
            onKeyUp={() => handleSearch('origin')}
          />
          {originResults.length > 0 && (
            <ul className="search-results">
              {originResults.map((city, index) => (
                <li key={index} onClick={() => handleSelectCity('origin', city)}>
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Cidade de Destino"
            value={destText}
            onChange={(e) => {
              setDestText(e.target.value);
              setSelectedDest(null);
            }}
            onKeyUp={() => handleSearch('destination')}
          />
          {destResults.length > 0 && (
            <ul className="search-results">
              {destResults.map((city, index) => (
                <li key={index} onClick={() => handleSelectCity('destination', city)}>
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button 
          className="calculate-button"
          onClick={handleSubmit}
          disabled={!selectedOrigin || !selectedDest}
        >
          Calcular
        </button>
      </div>
    </section>
  );
};

export default CalculatorForm;