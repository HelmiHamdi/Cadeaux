import React from "react";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F3ED] to-[#ffffff] text-text font-main">
      {/* En-tête général */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          À propos de <span className="text-accent">Tirage Gagnant</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-white/90 leading-relaxed">
          Découvrez notre mission, nos valeurs et comment nous apportons de la
          joie à nos participants chaque semaine.
        </p>
      </section>

      {/* Sections séparées */}
      <AboutSection />
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
