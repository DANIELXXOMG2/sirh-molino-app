import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse al estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen fullScreen={true} message="Verificando autenticación..." />;
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  // Si no, redirigir a la página de login
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
