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
          {/* Route Admin sans Header */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Routes principales avec Header */}
          <Route path="/*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={
                  <>
                    <Home />
                    <About />
                  </>
                } />
                <Route path="/about" element={<About />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;