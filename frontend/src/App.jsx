import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App font-main">
        <Routes>
          {/* Page d’accueil (home + about) */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <About />
              </>
            }
          />

          {/* Page Admin */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
