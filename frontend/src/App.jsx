/*import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';

import About from './pages/About';

function App() {
  return (
    <div className="App font-main">
      <Header />
      <Home />
      <About/>
    </div>
  );
}

export default App;*/
import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  // Vérifier si nous sommes sur la route admin
  const isAdminPage = window.location.pathname === '/admin';
  
  return (
    <div className="App font-main">
      {/* Ne pas afficher le Header sur la page admin */}
      {!isAdminPage && <Header />}
      
      {/* Afficher le composant correspondant à la route */}
      {isAdminPage ? <Admin /> : (
        <>
          <Home />
          <About />
        </>
      )}
    </div>
  );
}

export default App;