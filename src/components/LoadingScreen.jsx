import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Cargando...', fullScreen = false }) => {
  const containerClass = fullScreen ? 'loading-screen-fullscreen' : 'loading-screen-inline';

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className="loading-logo-wrapper">
          <img 
            src="/favicon.svg" 
            alt="SIRH Molino" 
            className="loading-logo"
          />
        </div>
        <p className="loading-message">{message}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
