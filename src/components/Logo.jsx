import './Logo.css';

const Logo = ({ size = 'medium', showText = true, variant = 'default' }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  const variantClasses = {
    default: 'logo-default',
    light: 'logo-light',
    dark: 'logo-dark'
  };

  return (
    <div className={`logo-container ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <img 
        src="/favicon.svg" 
        alt="SIRH Molino" 
        className="logo-icon"
      />
      {showText && (
        <span className="logo-text">SIRH Molino</span>
      )}
    </div>
  );
};

export default Logo;
