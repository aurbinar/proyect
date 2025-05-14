import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import Dishes from './routes/dishes/Dishes.jsx';
import DishList from './routes/dishes/DishList.jsx';
import Login from './routes/Login/Login.jsx';
import RecoverPassword from './routes/Login/recoverPassword.jsx';
import ResetPassword from './routes/Login/resetPassword.jsx';
import Menu from './routes/Menu/Menu.jsx';
import Reservation from './routes/reservations/reservations.jsx';
import Register from './routes/register/Register.jsx';
import EditProfile from './routes/profile/EditProfile.jsx';
import Layout from './components/Layout.jsx';
import ReservationHistory from './routes/profile/ReservationHistory.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminUsers from './routes/admin/AdminUsers.jsx';
import AdminReservations from './routes/admin/AdminReservations.jsx';
import AdminDashboard from './routes/admin/AdminDashboard.jsx';


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
            <Route path="/login" element={<Login />} />
            <Route path="/recover" element={<RecoverPassword />} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
            <Route path="/profile/reservationHistory" element={<ProtectedRoute><ReservationHistory/></ProtectedRoute>}/>
          </Route>
            <Route path="/editDishes" element={<AdminRoute><ProtectedRoute><Dishes/></ProtectedRoute></AdminRoute>}/>
            <Route path="/users" element={<AdminRoute><ProtectedRoute><AdminUsers/></ProtectedRoute></AdminRoute>}/>
            <Route path="/adminReservations" element={<AdminRoute><ProtectedRoute><AdminReservations/></ProtectedRoute></AdminRoute>}/>
            <Route path="/dashboard" element={<AdminRoute><ProtectedRoute><AdminDashboard/></ProtectedRoute></AdminRoute>}/>
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
