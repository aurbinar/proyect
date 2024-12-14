import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './public/vite.svg'
import './App.css'
import Header from './components/header.jsx';

function App() {
  

  return (
    <div>
      <Header />
      <div className="content">
        {/* Aquí va el resto del contenido de la página */}
        <h2>Bienvenidos a Mi Restaurante</h2>
        {/* Otros componentes o contenido */}
      </div>
    </div>
  )
}

export default App
