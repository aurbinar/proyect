// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../src/assets/logo.png'

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <Link to="/">
          <img src={logo} alt="Logo del Restaurante" className='logo'/>
        </Link>          
        <h1>Bienvenido a Nuestro Restaurante</h1>
        <nav>
          <ul>
            <li><Link to="/carta">Carta</Link></li>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/reservations">Reservas</Link></li>
            <li><Link to="/login/recover">Recover</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="intro">
          <h2>Disfruta de la mejor comida en un ambiente acogedor</h2>
          <p>Explora nuestra carta y descubre los deliciosos platos que ofrecemos.</p>
          <img src="restaurant.jpg" alt="Restaurante" className="home-image" />
        </section>
        <section className="services">
          <h2>Nuestros Servicios</h2>
          <ul>
            <li>Comida para llevar</li>
            <li>Reservas en línea</li>
            <li>Eventos y catering</li>
          </ul>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Nuestro Restaurante. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;