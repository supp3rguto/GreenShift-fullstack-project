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

const DashboardPage = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/calculations');
        setHistory(response.data);
      } catch (err) {
        setError('Não foi possível carregar o histórico. O backend está rodando?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []); 
  if (isLoading) return <p className="dashboard-message">Carregando histórico...</p>;
  if (error) return <p className="dashboard-message error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Histórico de Cálculos</h1>
      {history.length === 0 ? (
        <p className="dashboard-message">Nenhum cálculo foi realizado ainda.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Distância (km)</th>
              <th>Modal</th>
              <th>Pegada de Carbono (kg CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((calc) => (
              <tr key={calc.id}>
                <td>{new Date(calc.created_at).toLocaleString('pt-BR')}</td>
                <td>{calc.origin_city}</td>
                <td>{calc.destination_city}</td>
                <td>{calc.distance_km.toFixed(2)}</td>
                <td className="modal-cell">{calc.modal.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td>{calc.carbon_footprint_kg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;