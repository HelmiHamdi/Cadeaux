import React, { useEffect, useState } from "react";

const GiftCard = ({ gift, onParticipate, isSpecial = false }) => {
  // 🧮 Fonction pour calculer le prochain dimanche à 23h
  const getNextSunday = () => {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7)); // prochain dimanche
    nextSunday.setHours(23, 0, 0, 0); // 23h00
    return nextSunday;
  };

  // 🕒 Fonction pour calculer le temps restant avant dimanche 23h
  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  // 📆 Initialisation du compte à rebours
  const [endDate, setEndDate] = useState(getNextSunday());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  // 🔁 Met à jour chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      // Quand le tirage est passé, réinitialiser pour la semaine suivante
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        const nextEnd = getNextSunday();
        setEndDate(nextEnd);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div
      className={`gift-card relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 bg-white ${
        isSpecial ? "border-4 border-yellow-400" : "border border-gray-200"
      }`}
    >
      {/* 🖼️ Image du cadeau */}
      <div className="relative w-full h-60 overflow-hidden flex items-center justify-center bg-white">
        <img
          src={gift.image || "/default-gift.jpg"}
          alt={gift.title}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          style={{ maxWidth: "90%", maxHeight: "90%", marginTop: "50px" }}
        />
        {isSpecial && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            🎉 Spécial
          </div>
        )}
      </div>

      {/* 🧾 Contenu du cadeau */}
      <div className="p-6 text-center bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{gift.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{gift.description}</p>

        {/* ⏳ Timer - désincrémente chaque seconde */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          {[
            { label: "Jours", value: timeLeft.days },
            { label: "Heures", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Secondes", value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">
                {item.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Bouton participer */}
        <button
          onClick={() => onParticipate(gift)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isSpecial
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-primary text-white hover:bg-secondary"
          }`}
        >
          {isSpecial ? "🎁 Participer maintenant" : "Participer gratuitement"}
        </button>
      </div>
    </div>
  );
};

export default GiftCard;
