import React from "react";
import { Info } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 container mx-auto max-w-6xl">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div className="overflow-hidden rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-300">
          <img
            src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=800&q=80"
            alt="À propos"
            className="w-full h-[380px] object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-5 flex items-center gap-3 text-primary">
            <Info className="w-7 h-7" /> Qui sommes-nous ?
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Nous sommes une plateforme dédiée aux tirages au sort gratuits 🎁.
            Chaque semaine, des centaines de participants tentent leur chance
            pour remporter des cadeaux exceptionnels.
            <br /><br />
            Notre objectif est simple : offrir de la joie, de la transparence
            et de l’équité à travers des tirages automatisés et vérifiables.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="container mx-auto max-w-6xl text-center mt-16">
        <h2 className="text-4xl font-extrabold text-primary mb-6">Notre mission</h2>
        <p className="text-text-light text-lg leading-relaxed max-w-3xl mx-auto mb-12">
          Offrir une expérience ludique, équitable et 100% gratuite à nos
          utilisateurs, tout en diffusant des ondes positives à travers nos
          jeux hebdomadaires.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "💡 Innovation",
              desc: "Nous repoussons les limites avec des technologies modernes pour rendre chaque participation fluide et agréable.",
            },
            {
              title: "🏆 Fiabilité",
              desc: "Des tirages 100% automatisés et transparents pour garantir l’égalité des chances.",
            },
            {
              title: "🤝 Communauté",
              desc: "Une communauté soudée de passionnés de jeux et de belles surprises.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-bg to-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-secondary mb-3">{item.title}</h3>
              <p className="text-text-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
