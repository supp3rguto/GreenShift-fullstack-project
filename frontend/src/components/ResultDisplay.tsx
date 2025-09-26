import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const polyline = require('@mapbox/polyline');

interface ResultsDisplayProps {
  routeData: any; // Mantenha 'any' por simplicidade ou crie uma tipagem forte
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ routeData }) => {
  if (!routeData) return null;

  const decodedPath = polyline.decode(routeData.route_geometry).map((c: [number, number]) => [c[0], c[1]]);

  const chartData = {
    labels: routeData.footprint_analysis.map((d: any) => d.modal),
    datasets: [
      {
        label: 'Pegada de Carbono (kg CO₂)',
        data: routeData.footprint_analysis.map((d: any) => d.carbon_footprint_kg),
        backgroundColor: '#5A8F4D',
      },
    ],
  };

  return (
    <section className="results-section">
      <div className="map-container">
        <h3>Rota Visualizada</h3>
        <MapContainer
          center={decodedPath[Math.floor(decodedPath.length / 2)]}
          zoom={8}
          scrollWheelZoom={false}
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={decodedPath} color="#0C3C01" weight={5} />
        </MapContainer>
      </div>
      <div className="chart-container">
        <h3>Análise de Emissões para {routeData.distance_km} km</h3>
        <Bar data={chartData} />
      </div>
    </section>
  );
};

export default ResultsDisplay;