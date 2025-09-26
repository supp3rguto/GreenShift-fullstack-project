import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      &copy; {new Date().getFullYear()} GREENSHIFT. Todos os direitos reservados.
    </footer>
  );
};

export default Footer;