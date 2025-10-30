
import { Phone, Mail, MapPin, Info } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F3ED] to-[#ffffff] text-text font-main">
      {/* 🌟 En-tête */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          À propos de <span className="text-accent">Tirage Gagnant</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-white/90 leading-relaxed">
          Découvrez notre mission, nos valeurs et comment nous apportons de la
          joie à nos participants chaque semaine.
        </p>
      </section>

      {/* 💬 Présentation */}
      <section className="py-20 px-6 container mx-auto max-w-6xl">
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
      </section>

      {/* 🎯 Mission */}
      <section className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-extrabold text-primary mb-6">
            Notre mission
          </h2>
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
                <h3 className="text-xl font-semibold text-secondary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📞 Contact */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-primary">
            Nous contacter
          </h2>
          <p className="text-text-light mb-12 max-w-3xl mx-auto text-lg">
            Une question, une suggestion ou besoin d’assistance ?  
            Notre équipe est à votre écoute et vous répondra rapidement.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Phone className="w-7 h-7 text-primary" />,
                title: "Téléphone",
                value: "+216 55 123 456",
              },
              {
                icon: <Mail className="w-7 h-7 text-primary" />,
                title: "Email",
                value: "contact@tirage-gagnant.com",
              },
              {
                icon: <MapPin className="w-7 h-7 text-primary" />,
                title: "Adresse",
                value: "Avenue Habib Bourguiba, Cité El Khadra, Tunis",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 rounded-2xl p-8 flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-1">
                  {item.title}
                </h3>
                <p className="text-text-light">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔻 Footer */}
      <footer className="bg-primary text-white text-center py-6 mt-10">
        <p className="text-sm">
          © {new Date().getFullYear()} Tirage Gagnant — Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default About;
