import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css'; 

interface Calculation {
  id: number;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  modal: string;
  carbon_footprint_kg: number;
  created_at: string;
}

interface GroupedCalculation {
  groupKey: string;
  origin: string;
  destination: string;
  distance: number;
  date: string;
  calculations: {
    id: number;
    modal: string;
    footprint: number;
  }[];
}

const DashboardPage = () => {
  const [groupedHistory, setGroupedHistory] = useState<GroupedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndGroupHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/calculations');
        const rawHistory: Calculation[] = response.data;

        const groups: { [key: string]: GroupedCalculation } = {};

        rawHistory.forEach(calc => {
          const groupKey = `${calc.origin_city}-${calc.destination_city}-${calc.distance_km}`;
          
          if (!groups[groupKey]) {
            groups[groupKey] = {
              groupKey,
              origin: calc.origin_city,
              destination: calc.destination_city,
              distance: calc.distance_km,
              date: new Date(calc.created_at).toLocaleString('pt-BR'),
              calculations: [],
            };
          }
          
          groups[groupKey].calculations.push({
            id: calc.id,
            modal: calc.modal,
            footprint: calc.carbon_footprint_kg,
          });
        });
        
        // Convertemos o objeto de grupos em uma lista e atualizamos o estado
        setGroupedHistory(Object.values(groups));
        
      } catch (err) {
        setError('Não foi possível carregar o histórico. O backend está rodando?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndGroupHistory();
  }, []);

  const handleClearHistory = async () => {
    const isConfirmed = window.confirm("Você tem certeza que deseja apagar TODO o histórico? Esta ação não pode ser desfeita.");
    if (isConfirmed) {
      try {
        await axios.delete('http://localhost:8000/calculations');
        setGroupedHistory([]);
      } catch (err) {
        alert("Erro ao tentar limpar o histórico.");
        console.error(err);
      }
    }
  };

  if (isLoading) return <p className="dashboard-message">Carregando histórico...</p>;
  if (error) return <p className="dashboard-message error">{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Histórico de Cálculos</h1>
        {groupedHistory.length > 0 && (
          <button onClick={handleClearHistory} className="clear-history-button">
            Limpar Histórico
          </button>
        )}
      </div>
      {groupedHistory.length === 0 ? (
        <p className="dashboard-message">Nenhum cálculo foi realizado ainda.</p>
      ) : (
        // A renderização agora itera sobre os grupos
        <div className="history-groups-container">
          {groupedHistory.map((group) => (
            <div key={group.groupKey} className="history-group-card">
              <div className="group-header">
                <h3>{group.origin} → {group.destination}</h3>
                <div className="group-meta">
                  <span>Distância: <strong>{group.distance.toFixed(2)} km</strong></span>
                  <span>Data: <strong>{group.date}</strong></span>
                </div>
              </div>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Modal</th>
                    <th>Pegada de Carbono (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {group.calculations.map((calc) => (
                    <tr key={calc.id}>
                      <td className="modal-cell">{calc.modal.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</td>
                      <td>{calc.footprint.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;