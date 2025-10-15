import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext debe usarse dentro de un MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  // Obtener preferencia guardada o usar false por defecto (música activada)
  const [isMuted, setIsMuted] = useState(() => {
    const savedPreference = localStorage.getItem('musicMuted');
    return savedPreference === 'true';
  });
  
  const audioRef = useRef(null);

  // Guardar preferencia en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('musicMuted', isMuted);
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <MusicContext.Provider value={{ isMuted, toggleMute, audioRef }}>
      {/* Audio global que persiste entre rutas */}
      <audio 
        ref={audioRef}
        autoPlay 
        loop
        muted={isMuted}
      >
        <source 
          src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" 
          type="audio/mpeg" 
        />
        Tu navegador no soporta el elemento de audio.
      </audio>
      {children}
    </MusicContext.Provider>
  );
};
