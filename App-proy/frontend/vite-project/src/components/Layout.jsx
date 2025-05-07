import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="home-header">
        {/* Logo centrado */}
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo del Restaurante" className="logo" />
          </Link>
        </div>

        {/* Menú izquierda + login derecha */}
        <div className="nav-bar">
          <div className="nav-left">
            <ul>
              <li><Link to="/carta">Carta</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/reservations">Reservas</Link></li>
            </ul>
          </div>
          <Link to="/login" className="login-link">Log In</Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2025 Nuestro Restaurante. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
