import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getRandomAvatar } from '../config/avatars';
import Logo from './Logo';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [activeSection, setActiveSection] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Background Music */}
      <audio 
        ref={audioRef}
        autoPlay 
        loop
        muted={isMuted}
      >
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Music Control Button */}
      <button 
        className="music-control-btn"
        onClick={toggleMute}
        title={isMuted ? 'Activar música' : 'Silenciar música'}
      >
        {isMuted ? '🔇' : '🔈'}
      </button>

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

        <div className="dashboard-content">
          {activeSection === 'home' && (
            <div className="home-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Empleados</h3>
                    <p className="stat-number">-</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📄</div>
                  <div className="stat-info">
                    <h3>Contratos Activos</h3>
                    <p className="stat-number">-</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Empleados Activos</h3>
                    <p className="stat-number">-</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏸️</div>
                  <div className="stat-info">
                    <h3>Empleados Retirados</h3>
                    <p className="stat-number">-</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={handleManageEmployees}>
                    <span className="btn-icon">👥</span>
                    <div className="btn-content">
                      <strong>Gestionar Empleados</strong>
                      <small>Ver, crear y editar empleados</small>
                    </div>
                  </button>

                  <button className="action-btn secondary" onClick={handleReports}>
                    <span className="btn-icon">📊</span>
                    <div className="btn-content">
                      <strong>Ver Reportes</strong>
                      <small>Estadísticas y análisis</small>
                    </div>
                  </button>

                  <button className="action-btn tertiary">
                    <span className="btn-icon">🔔</span>
                    <div className="btn-content">
                      <strong>Notificaciones</strong>
                      <small>Revisar alertas del sistema</small>
                    </div>
                  </button>
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
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
