import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="welcome-card">
          <h1>¡Bienvenido a SIRH Molino App!</h1>
          <p className="user-email">
            Sesión iniciada como: <strong>{user?.email}</strong>
          </p>
          
          <div className="user-info">
            <p>Usuario autenticado correctamente</p>
            <p className="user-id">ID: {user?.uid}</p>
          </div>

          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
