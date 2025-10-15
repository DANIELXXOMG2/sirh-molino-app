import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FUN_AVATARS } from '../config/avatars';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profile = userDocSnap.data();
        setUserProfile(profile);
        setSelectedAvatar(profile.profilePictureUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (newAvatarUrl) => {
    try {
      setSaving(true);
      setSelectedAvatar(newAvatarUrl);

      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        profilePictureUrl: newAvatarUrl,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setUserProfile(prev => ({
        ...prev,
        profilePictureUrl: newAvatarUrl
      }));

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      console.log('✅ Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Error al actualizar el avatar. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver al Dashboard
        </button>
        <h1>⚙️ Configuración de Perfil</h1>
        <p className="page-subtitle">Personaliza tu avatar y preferencias</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          ✅ ¡Avatar guardado exitosamente!
        </div>
      )}

      {/* Current Avatar Section */}
      <div className="current-avatar-section">
        <h2>Tu Avatar Actual</h2>
        <div className="current-avatar-container">
          <div className="avatar-preview-wrapper">
            <img 
              src={selectedAvatar} 
              alt="Avatar actual" 
              className="current-avatar-preview"
            />
            {saving && (
              <div className="saving-overlay">
                <div className="spinner-small"></div>
              </div>
            )}
          </div>
          <div className="avatar-info">
            <p className="user-display-name">{userProfile?.displayName}</p>
            <p className="user-email">{userProfile?.email}</p>
            <span className="avatar-hint">
              Selecciona un nuevo avatar de la galería
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Gallery */}
      <div className="avatar-gallery-section">
        <h2>Galería de Avatares</h2>
        <p className="gallery-subtitle">
          Haz clic en cualquier avatar para seleccionarlo
        </p>
        
        <div className="avatar-grid">
          {FUN_AVATARS.map((avatarUrl, index) => (
            <div
              key={index}
              className={`avatar-option ${selectedAvatar === avatarUrl ? 'selected' : ''}`}
              onClick={() => handleAvatarChange(avatarUrl)}
              title={`Avatar ${index + 1}`}
            >
              <img src={avatarUrl} alt={`Avatar ${index + 1}`} />
              {selectedAvatar === avatarUrl && (
                <div className="selected-badge">
                  <span>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings Placeholder */}
      <div className="additional-settings">
        <h2>Más Configuraciones</h2>
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-icon">🔔</div>
            <div className="setting-content">
              <h3>Notificaciones</h3>
              <p>Gestiona tus preferencias de notificaciones</p>
              <span className="coming-soon">Próximamente</span>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-icon">🌙</div>
            <div className="setting-content">
              <h3>Tema Oscuro</h3>
              <p>Cambia entre modo claro y oscuro</p>
              <span className="coming-soon">Próximamente</span>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-icon">🔒</div>
            <div className="setting-content">
              <h3>Privacidad</h3>
              <p>Controla la privacidad de tu cuenta</p>
              <span className="coming-soon">Próximamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
