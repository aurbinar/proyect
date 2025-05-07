import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home.jsx';
import Dishes from './routes/dishes/Dishes.jsx';
import DishList from './routes/dishes/DishList.jsx';
import Login from './routes/Login/Login.jsx';
import RecoverPassword from './routes/Login/recoverPassword.jsx';
import ResetPassword from './routes/Login/resetPassword.jsx';
import Menu from './routes/Menu/Menu.jsx';
import Reservation from './routes/reservations/reservations.jsx';
import Layout from './components/Layout.jsx';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home />} />
            <Route path="/carta" element={<DishList />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<Reservation />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/recover" element={<RecoverPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
