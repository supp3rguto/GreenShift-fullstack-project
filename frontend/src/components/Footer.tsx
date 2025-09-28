import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          Este projeto é uma Prova de Conceito (PoC) desenvolvida para fins de estudo,
          explorando a aplicação de tecnologias full-stack para desafios de sustentabilidade na logística.
        </p>
        <p className="footer-credits">
          Desenvolvido por Augusto Ortigoso Barbosa | supp3rguto 2025 |
          <a href="https://github.com/supp3rguto" target="_blank" rel="noopener noreferrer"> GitHub</a> | 
          <a href="https://www.linkedin.com/in/augusto-barbosa-769602194" target="_blank" rel="noopener noreferrer"> LinkedIn</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;