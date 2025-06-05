import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import DishList from './routes/dishes/DishList.jsx';
import Login from './routes/Login/Login.jsx';
import RecoverPassword from './routes/Login/recoverPassword.jsx';
import ResetPassword from './routes/profile/resetPassword.jsx';
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
import UpdateMenu from './routes/admin/UpdateMenu.jsx';
import CreateMenu from './routes/admin/CreateMenu.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import EditDishes from './routes/admin/EditDishes.jsx';
import PostDish from './routes/admin/PostDish.jsx';


function App() {
  return (
    <Router>
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
          <Route path="/profile/changePassword" element={<ProtectedRoute><ResetPassword/></ProtectedRoute>}/>
          <Route path="/reset/:token" element={<ResetPassword/>}/>
        </Route>

        <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout/></AdminRoute></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="editDishes" element={<EditDishes />} />
          <Route path="postDishes" element={<PostDish />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="adminReservations" element={<AdminReservations />} />
          <Route path="updateMenu" element={<UpdateMenu />} />
          <Route path="createMenu" element={<CreateMenu />} />
        </Route>    

        <Route path="/reset/:token" element={<ResetPassword />} />
        
      </Routes>
    </Router>
  );
}

export default App;

