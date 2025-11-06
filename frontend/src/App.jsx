import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

// ✅ On sépare pour pouvoir utiliser useLocation à l'intérieur du Router
function MainApp() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App font-main">
      {/* Header visible sauf sur les pages admin */}
      {!isAdminPage && <Header />}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Route admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
