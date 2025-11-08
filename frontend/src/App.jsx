import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  // Méthode pour vous identifier
  const isYouTheAdmin = () => {
    // OPTION 1: Vérifier par URL spéciale
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('admin') === 'votre-code-secret';
    
    // OPTION 2: Vérifier par localStorage
    // return localStorage.getItem('adminToken') === 'votre-token-secret';
  };

  const isAdminPath = window.location.pathname === '/admin';
  const shouldShowAdmin = isAdminPath && isYouTheAdmin();
  
  // SI quelqu'un essaie d'accéder à /admin sans autorisation
  // On le REDIRIGE vers la page d'accueil
  if (isAdminPath && !isYouTheAdmin()) {
    // Changer l'URL sans recharger la page
    window.history.replaceState(null, '', '/');
    
    return (
      <div className="App font-main">
        <Header />
        <Home />
        <About />
      </div>
    );
  }
  
  return (
    <div className="App font-main">
      {/* Afficher Header sauf si VOUS êtes sur admin */}
      {!shouldShowAdmin && <Header />}
      
      {/* Si VOUS êtes sur admin ET c'est vous, montrer Admin */}
      {shouldShowAdmin ? (
        <Admin />
      ) : (
        /* Sinon, TOUJOURS montrer l'accueil à tout le monde */
        <>
          <Home />
          <About />
        </>
      )}
    </div>
  );
}

export default App;