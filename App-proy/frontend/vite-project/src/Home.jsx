import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backImage from '../src/assets/back.png';

const Home = () => {
  return (
    <> 
        <section className="intro">
          <h2>Disfruta de la mejor comida en un ambiente acogedor</h2>
          <img src={backImage} alt="Restaurante" className="home-image" />
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