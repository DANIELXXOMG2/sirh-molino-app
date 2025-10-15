import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRandomAvatar } from '../config/avatars';
import MusicControlButton from './MusicControlButton';
import Logo from './Logo';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [activeSection, setActiveSection] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch or create user profile on component mount
  useEffect(() => {
    if (user) {
      getUserProfile();
    }
  }, [user]);

  const getUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User profile already exists
        setUserProfile(userDocSnap.data());
      } else {
        // First time login - create new user profile
        const newUserProfile = {
          email: user.email,
          profilePictureUrl: getRandomAvatar(),
          createdAt: new Date().toISOString(),
          displayName: user.displayName || user.email.split('@')[0],
        };

        // Create the document in Firestore
        await setDoc(userDocRef, newUserProfile);
        setUserProfile(newUserProfile);
        
        console.log('✅ New user profile created with fun avatar!');
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleManageEmployees = () => {
    navigate('/employees');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="dashboard-container">
      {/* Music Control Button */}
      <MusicControlButton />

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Logo at top of sidebar */}
        <div className="sidebar-logo">
          <Logo size="small" variant="light" showText={false} />
        </div>

        <div className="sidebar-header">
          <div className="user-profile-section">
            {loadingProfile ? (
              <div className="avatar-skeleton"></div>
            ) : (
              <img 
                src={userProfile?.profilePictureUrl} 
                alt="Avatar" 
                className="user-avatar"
              />
            )}
            <div className="user-info-text">
              <p className="user-info">{userProfile?.displayName || user?.email}</p>
              <span className="user-email-small">{user?.email}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => setActiveSection('home')}
          >
            <span className="nav-icon">🏠</span>
            Inicio
          </button>
          <button
            className={`nav-item ${activeSection === 'employees' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('employees');
              handleManageEmployees();
            }}
          >
            <span className="nav-icon">👥</span>
            Empleados
          </button>
          <button
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('reports');
              handleReports();
            }}
          >
            <span className="nav-icon">📊</span>
            Reportes
          </button>
          <button
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('settings');
              handleSettings();
            }}
          >
            <span className="nav-icon">⚙️</span>
            Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">
              👋 Bienvenido de nuevo, <strong>{userProfile?.displayName || user?.email?.split('@')[0] || 'Usuario'}</strong>
            </span>
          </div>
        </header>

        <motion.div 
          className="dashboard-content"
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {activeSection === 'home' && (
            <div className="home-section">
              <div className="stats-grid">
                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)" }}
                >
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Empleados</h3>
                    <p className="stat-number">-</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)" }}
                >
                  <div className="stat-icon">📄</div>
                  <div className="stat-info">
                    <h3>Contratos Activos</h3>
                    <p className="stat-number">-</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)" }}
                >
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Empleados Activos</h3>
                    <p className="stat-number">-</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)" }}
                >
                  <div className="stat-icon">⏸️</div>
                  <div className="stat-info">
                    <h3>Empleados Retirados</h3>
                    <p className="stat-number">-</p>
                  </div>
                </motion.div>
              </div>

              <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="action-buttons">
                  <motion.button 
                    className="action-btn primary" 
                    onClick={handleManageEmployees}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="btn-icon">👥</span>
                    <div className="btn-content">
                      <strong>Gestionar Empleados</strong>
                      <small>Ver, crear y editar empleados</small>
                    </div>
                  </motion.button>

                  <motion.button 
                    className="action-btn secondary" 
                    onClick={handleReports}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="btn-icon">📊</span>
                    <div className="btn-content">
                      <strong>Ver Reportes</strong>
                      <small>Estadísticas y análisis</small>
                    </div>
                  </motion.button>

                  <motion.button 
                    className="action-btn tertiary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="btn-icon">🔔</span>
                    <div className="btn-content">
                      <strong>Notificaciones</strong>
                      <small>Revisar alertas del sistema</small>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="section-placeholder">
              <h2>📊 Reportes</h2>
              <p>Esta sección estará disponible próximamente.</p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="section-placeholder">
              <h2>⚙️ Configuración</h2>
              <p>Esta sección estará disponible próximamente.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
