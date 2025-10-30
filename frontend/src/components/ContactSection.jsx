import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-primary">Nous contacter</h2>
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
              <div className="bg-primary/10 rounded-full p-4 mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-secondary mb-1">{item.title}</h3>
              <p className="text-text-light">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
