import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="bg-bg shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo à gauche */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="BAMBOU"
              className="h-10"
            />
          </div>

          {/* Navigation centrée */}
          <nav className="flex space-x-8 ml-auto">
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

          {/* Espace vide à droite pour équilibrer la disposition */}
          <div className="w-10"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
