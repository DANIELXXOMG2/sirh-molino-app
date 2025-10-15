import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [activeSection, setActiveSection] = useState('home');

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>SIRH Molino</h2>
          <p className="user-info">{user?.email}</p>
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
            onClick={() => setActiveSection('settings')}
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
            <span className="welcome-text">Bienvenido al Sistema</span>
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
