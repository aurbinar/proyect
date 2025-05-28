import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import "./EditProfile.css"
import { useNavigate, Link } from 'react-router-dom';

const EditProfile = () => {
  const { user, editProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await editProfile({ name, phone });
    if (result.success) {
      setMessage('Perfil actualizado correctamente');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Email:
          <br />
          {email}
        </label>
        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Teléfono:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <button type="submit">Guardar cambios</button>
        <Link  to="/profile/changePassword" className="change-password">Cambiar contraseña</Link>
      </form>
      {message && <p className="edit-message">{message}</p>}
    </div>
  );
}
export default EditProfile;