import React from 'react';
import '../../assets/css/LandingPage.css';
import AuthSection from '../../components/authSection';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Bienvenido a Mero Papeleo</h1>
        <p className="tagline">La solución perfecta para gestionar tus documentos.</p>
        <h2>Características</h2>
      </header>
      
      <section className="features">
        
        <div className="feature">
          <h3>Fácil de usar</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..</p>
        </div>
        <div className="feature">
          <h3>Acceso seguro</h3>
          <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et feugiat augue facilisis sit amet. Donec sed nisi sagittis, commodo metus vitae, facilisis massa. In consequat ligula ut nulla bibendum, sit amet fringilla odio blandit. Suspendisse potenti. Vivamus malesuada, mi non tincidunt interdum, felis elit lacinia risus, a pulvinar justo nisl a orci. Integer euismod, nisi vitae fermentum pharetra, arcu mi gravida libero, vel dapibus erat metus nec ante.</p>
        </div>
        <div className="feature">
          <h3>Soporte 24/7</h3>
          <p>Mauris vitae elit eget eros gravida eleifend sit amet ac sapien. Quisque quis arcu ac lorem pretium malesuada. Ut consectetur eros vel sapien dignissim, eu placerat velit pulvinar. Sed vitae facilisis eros, id dictum est. Aenean nec nibh euismod, posuere sapien non, finibus eros. In hac habitasse platea dictumst. Fusce tincidunt nibh vel efficitur facilisis. Suspendisse potenti.

Phasellus sit amet eros et erat cursus dapibus. Sed euismod tincidunt sapien a lacinia. Integer dapibus lectus id dignissim aliquet. Nulla sit amet felis eu velit bibendum sodales et vitae arcu. Donec condimentum vehicula velit, in scelerisque nunc convallis sed. Nulla quis lorem at libero sodales cursus. Mauris ultricies felis nec magna ultricies, non auctor quam vulputate.</p>
        </div>
      </section>

      <section className="auth-section d-flex justify-content-center align-items-center">
        <div className="auth-buttons">
          <AuthSection />
        </div>
      </section>
      <footer className="landing-footer">
        <p>© 2024 Mero Papeleo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
