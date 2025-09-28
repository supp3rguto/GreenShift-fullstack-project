import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';

const polyline = require('@mapbox/polyline');

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

interface ResultsDisplayProps {
  routeData: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ routeData }) => {
  if (!routeData) {
    return null;
  }

  const { distance_km, route_geometry, footprint_analysis } = routeData;

  const leafletCoordinates: LatLngTuple[] = polyline.decode(route_geometry);

  const colorPalette = [
    'rgba(162, 172, 130, 0.6)', // Verde Oliva Claro
    'rgba(91, 109, 73, 0.6)',   // Verde Oliva Escuro
    'rgba(139, 69, 19, 0.6)',   // Marrom (Etanol)
    'rgba(75, 85, 99, 0.6)',    // Cinza Escuro (Gasolina)
    'rgba(55, 65, 81, 0.6)',    // Cinza Mais Escuro (Diesel)
    'rgba(30, 41, 59, 0.6)',    // Quase Preto (Caminhão)
    'rgba(59, 130, 246, 0.6)',  // Azul (Elétrico)
  ];
  const borderPalette = colorPalette.map(color => color.replace('0.6', '1'));

  const chartData = {
    labels: footprint_analysis.map((item: any) => item.modal.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())),
    datasets: [
      {
        label: 'Pegada de Carbono (kg CO₂)',
        data: footprint_analysis.map((item: any) => item.carbon_footprint_kg),
        // --- USANDO A NOVA PALETA ---
        backgroundColor: colorPalette,
        borderColor: borderPalette,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const center: LatLngTuple = leafletCoordinates.length > 0 
    ? leafletCoordinates[Math.floor(leafletCoordinates.length / 2)]
    : [-15.7801, -47.9292];

  return (
    <div className="results-container">
      <div className="card map-card">
        <h3>Rota Visualizada</h3>
        <MapContainer 
          center={center} 
          zoom={8} 
          scrollWheelZoom={false}
          className="leaflet-map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {leafletCoordinates.length > 0 && <Polyline positions={leafletCoordinates} color="#0C3C01" weight={5} />}
        </MapContainer>
      </div>

      <div className="card chart-card">
        <h3>Análise de Emissões para {distance_km.toFixed(2)} km</h3>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;