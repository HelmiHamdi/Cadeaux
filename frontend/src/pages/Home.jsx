import React, { useState, useEffect } from 'react';
import GiftCard from '../components/GiftCard';
import ParticipationModal from '../components/ParticipationModal';
import { giftService, drawService } from '../services/api';

const Home = () => {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGifts();
    fetchWinners();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      const response = await giftService.getAllGifts();
      setGifts(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des cadeaux:', error);
      setError('Impossible de charger les cadeaux. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await drawService.getWeeklyWinners();
      setWinners(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des gagnants:', error);
    }
  };

  const handleParticipate = (gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

const handleSubmitParticipation = async (giftId, formData) => {
  try {
    await giftService.participate(giftId, formData);
  
    return Promise.resolve();
  } catch (error) {
   
    return Promise.reject(error);
  }
};

  // Organiser les cadeaux en lignes comme sur la maquette
  const firstRow = gifts.slice(0, 2);
  const secondRow = gifts.slice(2, 4);
  const thirdRow = gifts.slice(4, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">Chargement des cadeaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={fetchGifts}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section exactement comme sur la maquette */}

<section className="relative flex flex-col md:flex-row items-center justify-between bg-bg py-16 px-6 overflow-hidden">
  
  {/* Animation du téléphone à gauche */}
  <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 relative">
    <div className="relative animate-phone-3d">
      {/* Téléphone animé avec effet 3D */}
      <div className="w-64 h-96 md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3rem] p-5 shadow-2xl relative overflow-hidden border-[3px] border-gray-700">
        
        {/* Encadrement de l'écran */}
        <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden relative border-[1px] border-gray-600">
          
          {/* Écran animé avec dégradé dynamique */}
          <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent rounded-[1.8rem] overflow-hidden relative animate-screen-glow">
            
            {/* Animation principale sur l'écran */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Cadeau rotatif */}
                <div className="w-28 h-28 bg-gradient-to-br from-accent to-yellow-300 rounded-2xl relative animate-gift-spin shadow-2xl">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-red-500 rounded-full shadow-lg"></div>
                  <div className="absolute inset-3 bg-yellow-200 rounded-lg flex items-center justify-center shadow-inner">
                    <span className="text-3xl animate-bounce">📱</span>
                  </div>
                </div>
                
                {/* Étoiles tournantes autour du cadeau */}
                <div className="absolute -top-6 -left-6 w-6 h-6 text-yellow-300 animate-star-orbit">⭐</div>
                <div className="absolute -top-6 -right-6 w-5 h-5 text-yellow-200 animate-star-orbit-reverse" style={{animationDelay: '0.5s'}}>✨</div>
                <div className="absolute -bottom-6 -left-8 w-4 h-4 text-yellow-400 animate-star-orbit" style={{animationDelay: '1s'}}>🌟</div>
                <div className="absolute -bottom-8 -right-4 w-5 h-5 text-yellow-300 animate-star-orbit-reverse" style={{animationDelay: '1.5s'}}>⭐</div>
              </div>
            </div>
            
            {/* Notch iPhone moderne */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full flex justify-center items-center">
              <div className="w-4 h-4 bg-gray-600 rounded-full mr-2"></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* Barre de navigation moderne */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white bg-opacity-60 rounded-full"></div>
            
            {/* Indicateurs d'état */}
            <div className="absolute top-4 left-4 text-white text-xs font-bold">12:30</div>
            <div className="absolute top-4 right-4 flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Boutons latéraux réalistes */}
        <div className="absolute -right-1 top-24 h-16 w-1 bg-gray-700 rounded-l-lg shadow-lg"></div>
        <div className="absolute -right-1 top-44 h-12 w-1 bg-gray-700 rounded-l-lg shadow-lg"></div>
        <div className="absolute -left-1 top-32 h-20 w-1 bg-gray-700 rounded-r-lg shadow-lg"></div>
        
        {/* Haut-parleur */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
      </div>
      
      {/* Reflets réalistes */}
      <div className="absolute top-6 left-6 w-20 h-20 bg-white opacity-[0.03] rounded-full blur-sm"></div>
      <div className="absolute bottom-10 right-8 w-16 h-16 bg-white opacity-[0.02] rounded-full blur-sm"></div>
      
      {/* Ombrage 3D */}
      <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-accent/10 to-transparent rounded-[3.5rem] blur-xl -z-10"></div>
    </div>

    {/* Confettis améliorés */}
    <div className="absolute top-4 left-1/4 w-5 h-5 bg-accent rounded-full animate-confetti-slow shadow-lg">🎉</div>
    <div className="absolute top-8 right-1/3 w-4 h-4 bg-pink-400 rounded-full animate-confetti-medium shadow-lg" style={{animationDelay: '0.4s'}}>✨</div>
    <div className="absolute top-12 left-1/2 w-6 h-6 bg-blue-400 rounded-full animate-confetti-fast shadow-lg" style={{animationDelay: '0.8s'}}>⭐</div>
    <div className="absolute bottom-8 right-1/4 w-5 h-5 bg-green-400 rounded-full animate-confetti-slow shadow-lg" style={{animationDelay: '1.2s'}}>🎊</div>
    <div className="absolute bottom-12 left-1/3 w-4 h-4 bg-purple-400 rounded-full animate-confetti-medium shadow-lg" style={{animationDelay: '1.6s'}}>💫</div>
  </div>

  {/* Texte à droite */}
  <div className="w-full md:w-1/2 text-center md:text-left space-y-6 z-10 animate-text-slide">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-text">
      🎁 Gagnez des <span className="text-accent animate-text-glow">cadeaux incroyables</span> chaque semaine !
    </h1>
    <p className="text-lg md:text-xl text-text-light max-w-md mx-auto md:mx-0 leading-relaxed">
      Participez gratuitement à nos tirages au sort exclusifs et tentez de remporter les derniers smartphones haut de gamme !
    </p>
    <button className="bg-accent text-primary font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-pulse-glow text-lg">
      Je participe gratuitement 
    </button>
  </div>

  {/* Texture de fond améliorée */}
  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
</section>
      {/* Section En Cours */}
      <section className="container mx-auto px-4 py-8" id="how-it-works">
        <h2 className="text-2xl font-bold text-text mb-8 text-center">En cours</h2>
        
        {/* Première ligne - 2 cadeaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {firstRow.map((gift) => (
            <GiftCard
              key={gift._id}
              gift={gift}
              onParticipate={handleParticipate}
            />
          ))}
        </div>

        {/* Deuxième ligne - 2 cadeaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {secondRow.map((gift) => (
            <GiftCard
              key={gift._id}
              gift={gift}
              onParticipate={handleParticipate}
            />
          ))}
        </div>

        {/* Troisième ligne - 1 cadeau centré et plus grand */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {thirdRow.map((gift) => (
              <GiftCard
                key={gift._id}
                gift={gift}
                onParticipate={handleParticipate}
                isSpecial={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="bg-white py-12" id='how-it-works' >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-text mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-text mb-2">Inscris-toi</h3>
              <p className="text-text-light">Choisis le cadeau que tu veux</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-text mb-2">Participe gratuitement</h3>
              <p className="text-text-light">Remplis le formulaire de participation</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-text mb-2">Découvre les résultats</h3>
              <p className="text-text-light">Attends le tirage au sort hebdomadaire</p>
            </div>
          </div>
        </div>
      </section>


<section className="bg-bg py-12" id="winners">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-text mb-8">Nos gagnants</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, index) => {
        const winner = winners?.[index];
        const isDrawn = winner?.isDrawn;
        
        return (
          <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-text text-lg">
              {winner?.winnerName || "En attente"}
            </h3>
            <p className="text-text-light">
              {winner?.giftTitle || `Cadeau ${index + 1}`}
            </p>
            <div className="mt-2">
              <span className={`text-sm ${isDrawn ? 'text-green-600 font-bold' : 'text-text-light'}`}>
                {isDrawn ? `Code: ${winner.winnerCode}` : "Code disponible après tirage"}
              </span>
            </div>
            {isDrawn && (
              <div className="mt-2 text-xs text-green-500">
                🎉 Tirage effectué
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>


      {/* Modal de participation */}
      <ParticipationModal
        gift={selectedGift}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onParticipate={handleSubmitParticipation}
      />
    </div>
  );
};

export default Home;