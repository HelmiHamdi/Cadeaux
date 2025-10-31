import React, { useState } from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-bg shadow-lg relative">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="BAMBOU"
              className="h-8 md:h-10"
            />
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 ml-auto">
            <a
              href="#hero"
              className="text-text hover:text-primary font-medium transition-colors"
            >
              Accueil
            </a>
            <a
              href="#winners"
              className="text-text hover:text-primary font-medium transition-colors"
            >
              Gagnants
            </a>
            <a
              href="#how-it-works"
              className="text-text hover:text-primary font-medium transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="#about"
              className="text-text hover:text-primary font-medium transition-colors"
            >
              À propos
            </a>
            <a
              href="#contact"
              className="text-text hover:text-primary font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-text transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-text transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-text transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          {/* Espace pour équilibrer */}
          <div className="hidden md:block w-10"></div>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
            <nav className="flex flex-col space-y-4 p-4">
              <a
                href="#hero"
                className="text-text hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#winners"
                className="text-text hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Gagnants
              </a>
              <a
                href="#how-it-works"
                className="text-text hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a
                href="#about"
                className="text-text hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </a>
              <a
                href="#contact"
                className="text-text hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;