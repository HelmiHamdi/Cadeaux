import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/AdminLogin"; // si tu as une page login admin

function App() {
  return (
    <Router>
      <div className="App font-main">
        {/* Le header s’affiche sauf sur la route /admin */}
        {window.location.pathname.startsWith("/admin") ? null : <Header />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Routes admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
