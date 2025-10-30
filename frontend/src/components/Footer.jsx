import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white text-center py-6 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} Tirage Gagnant — Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;
