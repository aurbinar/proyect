import React from 'react';
import logo from '../src/assets/logo.png';
import './Home.css';
import backImage from '../src/assets/back.png';
import arroz1 from '../src/assets/arroz.png'
import arroz2 from '../src/assets/arroz_negro.png'
import arroz3 from '../src/assets/caldereta.png'


const Home = () => {
  return (
    <div className="home-container" style={{ backgroundImage: `url(${backImage})` }}>
      <section className="hero">
        <img src={logo} alt="Logo Restaurante Carbónico" className="hero-logo" />
        <h1 className="hero-title">Bienvenidos a Restaurante Carbónico</h1>
        <p className="hero-subtitle">Comida casera, carnes a la parrilla y una exquisita variedad de arroces</p>
        <a href="/reservations" className="hero-button">Reservar mesa</a>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Nuestra Carta</h3>
          <p>Disfruta de carnes, arroces y platos caseros para todos los gustos.</p>
          <a href="/carta">Ver Carta</a>
        </div>
        <div className="feature-card">
          <h3>Menú del Día</h3>
          <p>Platos caseros perfectos para el día a día.</p>
          <a href="/menu">Ver Menú</a>
        </div>
      </section>
      
      <section className="about">
        <h2>Sobre Nosotros</h2>
        <p>En Restaurante Carbónico fusionamos la tradición de la comida casera con el placer de una buena carne a la parrilla y una deliciosa selección de arroces. Queremos que cada visita sea una experiencia inolvidable en un entorno acogedor y elegante.</p>
      </section>

      <section className="rice-section">
        <h2>Nuestros Arroces</h2>
        <p>Descubre nuestra selección de arroces elaborados con ingredientes de primera calidad y mucho mimo.</p>
        <div className="rice-gallery">
          <img src={arroz1} alt="Arroz 1" />
          <img src={arroz2} alt="Arroz 2" />
          <img src={arroz3} alt="Arroz 3" />
        </div>
      </section>
    </div>
  );
}
export default Home;