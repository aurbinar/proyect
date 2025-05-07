// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <> 
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
    </>
  );
};

export default Home;