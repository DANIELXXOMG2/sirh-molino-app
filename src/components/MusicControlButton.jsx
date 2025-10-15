import { useMusicContext } from '../contexts/MusicContext';
import './MusicControlButton.css';

const MusicControlButton = () => {
  const { isMuted, toggleMute } = useMusicContext();

  return (
    <button 
      className="music-control-btn"
      onClick={toggleMute}
      title={isMuted ? 'Activar música' : 'Silenciar música'}
      aria-label={isMuted ? 'Activar música' : 'Silenciar música'}
    >
      {isMuted ? '🔇' : '🔈'}
    </button>
  );
};

export default MusicControlButton;
