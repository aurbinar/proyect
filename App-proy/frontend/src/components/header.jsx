import React from 'react';
import '../styles/header.css'; // Importamos los estilos específicos del Header

function Header() {
  return (
    <header className="header">
      <div className="logo">
        {/* Aquí puede ir el logo como texto o una imagen */}
        <h1>Mi Restaurante</h1>
      </div>
      <nav className="nav">
        <a href="#menu">Menú</a>
        <a href="#about">Nosotros</a>
        <a href="#contact">Contacto</a>
        <a href="#reservations" className="reservation-btn">Reserva</a>
      </nav>
    </header>
  );
}

export default Header;