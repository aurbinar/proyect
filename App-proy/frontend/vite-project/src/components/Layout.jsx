import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import logo from '../assets/logo.png';
import arrow from '../assets/arrow.png';
import './Layout.css';

export default function Layout() {
  const { user, logout, isLoggedIn } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let mainClass = 'main-default';

  if (location.pathname.startsWith('/reservations')) {
    mainClass = 'main-reservations';
  } else if (location.pathname.startsWith('/carta')) {
    mainClass = 'main-carta';
  } else if (location.pathname.startsWith('/menu')) {
    mainClass = 'main-menu';
  } else if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
    mainClass = 'main-auth';
  }

  return (
    <div className="layout-container">
      <header className="home-header">
        <div className={`header-content ${scrolled ? 'scrolled' : ''}`}>
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="Logo del Restaurante" className="logo" />
            </Link>
          </div>

          <nav className="nav-center">
            <ul>
              <li><Link to="/carta">Carta</Link></li>
              <li><Link to="/menu">Menú</Link></li>
              <li><Link to="/reservations">Reservas</Link></li>
            </ul>
          </nav>

          <div className="nav-right">
            {!isLoggedIn ? (
              <ul>
                <li><Link to="/login" className="login-link">Iniciar Sesión</Link></li>
              </ul>
            ) : (
              <div className="user-dropdown">
                <button onClick={() => setShowMenu(!showMenu)} className="user-button">
                  {user?.name || 'Usuario'} <img src={arrow} alt="arrow" className="arrow" />
                </button>
                {showMenu && (
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => { setShowMenu(false); navigate('/profile/edit'); }}>Editar Perfil</button></li>
                    <li><button className="dropdown-item" onClick={() => { setShowMenu(false); navigate('/profile/reservationHistory'); }}>Historial de reservas</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={mainClass}>
        <Outlet />
      </main>

      <footer>
        <p>
          &copy; 2025 Nuestro Restaurante. Todos los derechos reservados. 2025 Nuestro Restaurante. Todos los derechos reservados. 2025 Nuestro Restaurante. Todos los derechos reservados.Todos los derechos reservados. 2025 Nuestro Restaurante.Todos los derechos reservados. 2025 Nuestro Restaurante.
        </p>
      </footer>
    </div>
  );
}
