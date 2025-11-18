import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';


function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Date de lancement : 28 novembre 2025 à 20h00 temps Tunisien
  const launchDate = new Date('2025-11-18T14:58:00+01:00');

  // Vérifier si nous sommes sur la route admin
  const isAdminPage = window.location.pathname === '/admin';

  useEffect(() => {
    checkLaunchStatus();
    checkMobileView();
    
    const timer = setInterval(checkLaunchStatus, 1000);
    const resizeListener = () => checkMobileView();
    
    window.addEventListener('resize', resizeListener);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', resizeListener);
    };
  }, ); // ← CORRECTION : Ajout du tableau de dépendances vide

  const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const checkLaunchStatus = () => {
    const now = new Date();
    const difference = launchDate - now;
    
    if (difference <= 0) {
      setIsLaunched(true);
      setLoading(false);
      return;
    }

    setIsLaunched(false);
    setLoading(false);
    
    // Calcul du temps restant
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    });
  };

  // Écran de compte à rebours avant le lancement
  if (!isLaunched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-bubbles"></div>
          <div className="pulse-glow"></div>
        </div>

        <div className="text-center text-white max-w-4xl mx-auto relative z-10 w-full">
          {/* Logo ou icône principale */}
          <div className="mb-6 md:mb-8 animate-float">
            <div className="text-6xl md:text-8xl mb-4 transform transition-transform duration-1000 hover:scale-110 hover:rotate-12">
              🎁
            </div>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 animate-slide-up">
            Ça arrive bientôt !
          </h1>
          
          {/* Sous-titre */}
          <p className="text-lg md:text-2xl mb-8 md:mb-12 opacity-90 animate-slide-up delay-200">
            Notre grand jeux de cadeaux débute le<br />
            <strong className="text-accent glow-text">28 Novembre 2025 à 20h00</strong>
          </p>
          
          {/* Compte à rebours responsive */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4 md:gap-6'} max-w-2xl mx-auto mb-8 md:mb-12`}>
            <div 
              className="bg-white bg-opacity-20 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-30 animate-countdown-tile"
              style={{ animationDelay: '400ms' }}
            >
              <div className="text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-accent animate-pulse-slow">
                {timeLeft.days || '00'}
              </div>
              <div className="text-xs md:text-base opacity-80">Jours</div>
            </div>
            
            <div 
              className="bg-white bg-opacity-20 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-30 animate-countdown-tile"
              style={{ animationDelay: '500ms' }}
            >
              <div className="text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-accent animate-pulse-slow">
                {timeLeft.hours || '00'}
              </div>
              <div className="text-xs md:text-base opacity-80">Heures</div>
            </div>
            
            <div 
              className="bg-white bg-opacity-20 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-30 animate-countdown-tile"
              style={{ animationDelay: '600ms' }}
            >
              <div className="text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-accent animate-pulse-slow">
                {timeLeft.minutes || '00'}
              </div>
              <div className="text-xs md:text-base opacity-80">Minutes</div>
            </div>
            
            <div 
              className="bg-white bg-opacity-20 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-30 animate-countdown-tile"
              style={{ animationDelay: '700ms' }}
            >
              <div className="text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-accent animate-pulse-slow">
                {timeLeft.seconds || '00'}
              </div>
              <div className="text-xs md:text-base opacity-80">Secondes</div>
            </div>
          </div>
          
          {/* Message d'attente */}
          <div className="bg-white bg-opacity-10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-20 max-w-2xl mx-auto animate-fade-in-up delay-500">
            <p className="text-base md:text-xl mb-3 md:mb-4 flex items-center justify-center gap-2">
              
              Préparez-vous à gagner des cadeaux incroyables !
            </p>
            <p className="text-sm md:text-base opacity-80 leading-relaxed">
              Participation 100% gratuite • Tirage au sort hebdomadaire • Cadeaux exclusifs
            </p>
          </div>

         

          {/* Message spécial pour la page admin */}
          {isAdminPage && (
            <div className="mt-6 md:mt-8 bg-red-500 bg-opacity-20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-red-400 animate-pulse">
              <p className="text-base md:text-lg font-semibold text-red-200 flex items-center justify-center gap-2">
                <span>⚠️</span>
                L'administration n'est accessible qu'après le lancement
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center relative overflow-hidden">
        <div className="pulse-glow"></div>
        <div className="text-center text-white relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  // Application normale après le lancement
  return (
    <div className="App font-main">
      {/* Ne pas afficher le Header sur la page admin */}
      {!isAdminPage && <Header />}
      
      {/* Afficher le composant correspondant à la route */}
      {isAdminPage ? <Admin /> : (
        <div className="animate-fade-in">
          <Home />
          <About />
        </div>
      )}
    </div>
  );
}

export default App;