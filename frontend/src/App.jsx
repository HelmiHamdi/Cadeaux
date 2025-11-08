import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";

function ScrollToHomeOnFirstLoad() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // si on ouvre directement /admin/login (premier chargement)
    // redirige vers /
    if (location.pathname !== "/" && !location.pathname.startsWith("/admin")) {
      navigate("/");
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToHomeOnFirstLoad />
      <div className="App font-main">
        <Routes>
          {/* Page d'accueil toujours visible */}
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

          {/* Page admin accessible manuellement */}
          <Route path="/admin/*" element={<Admin />} />

          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
