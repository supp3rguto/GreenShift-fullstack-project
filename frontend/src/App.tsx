import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorPage from './pages/CalculatorPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <div className="main-layout">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;