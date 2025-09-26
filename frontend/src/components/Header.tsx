import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">GREENSHIFT</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Calculadora
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;