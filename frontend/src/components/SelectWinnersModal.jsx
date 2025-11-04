import React, { useState, useEffect } from 'react';
import { X, Search, Check, Users, Gift, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminApi';
import Window from '../components/Window'; // IMPORT AJOUTÉ

const SelectWinnersModal = ({ isOpen, onClose, onWinnersSelected }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [searchLoading, setSearchLoading] = useState({});

  // SUPPRIMER LES ANCIENNES FONCTIONS showAlert, showConfirm, showSuccess
  // ET LES REMPLACER PAR Window DIRECTEMENT

  useEffect(() => {
    if (!isOpen) return;

    const fetchGifts = async () => {
      setLoading(true);
      try {
        const response = await adminService.getDashboard();
        const activeGifts = response.data.activeGifts;
        setGifts(activeGifts);
        
        console.log(`🎁 Chargement de ${activeGifts.length} cadeaux pour la sélection`);

        // Réinitialiser tous les états
        const initialSelected = {};
        const initialSearchTerms = {};
        const initialSearchResults = {};
        const initialSearchLoading = {};
        
        activeGifts.forEach(gift => {
          const giftId = gift._id.toString();
          initialSelected[giftId] = null;
          initialSearchTerms[giftId] = '';
          initialSearchResults[giftId] = null;
          initialSearchLoading[giftId] = false;
        });
        
        setSelectedWinners(initialSelected);
        setSearchTerms(initialSearchTerms);
        setSearchResults(initialSearchResults);
        setSearchLoading(initialSearchLoading);
      } catch (error) {
        console.error('Erreur chargement cadeaux:', error);
        await Window.info('Erreur lors du chargement des cadeaux', 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [isOpen]);

  // CORRECTION : Utilisation de Window au lieu des anciennes fonctions
  const searchParticipant = async (giftId, code) => {
    if (!code.trim()) {
      await Window.info('Veuillez entrer un code', 'Code manquant');
      return;
    }

    setSearchLoading(prev => ({ ...prev, [giftId]: true }));
    try {
      console.log(`🔍 Recherche du code: "${code}" pour le cadeau: ${giftId}`);
      
      const response = await adminService.searchByCode(code.trim());
      console.log('📋 Réponse API searchByCode:', response.data);
      
      const participant = response.data.participant;
      
      if (!participant) {
        await Window.info(
          `Aucun participant trouvé avec le code: ${code}`,
          'Code non trouvé'
        );
        setSearchResults(prev => ({ ...prev, [giftId]: null }));
        return;
      }

      // Vérification améliorée des IDs de cadeau
      const participantGiftId = participant.gift?.id?.toString() || 
                               participant.giftId?._id?.toString() || 
                               participant.giftId?.toString();
      
      const currentGiftId = giftId.toString();
      
      console.log('🔍 Comparaison IDs:', {
        participantGiftId,
        currentGiftId,
        participantGiftTitle: participant.gift?.title || participant.giftId?.title,
        currentGiftTitle: gifts.find(g => g._id.toString() === currentGiftId)?.title
      });
      
      if (participantGiftId !== currentGiftId) {
        const giftTitle = gifts.find(g => g._id.toString() === currentGiftId)?.title;
        const participantGiftTitle = participant.gift?.title || participant.giftId?.title || 'Cadeau inconnu';
        
        await Window.info(
          `Ce code appartient au cadeau "${participantGiftTitle}" et non à "${giftTitle}".`,
          'Code invalide'
        );
        setSearchResults(prev => ({ ...prev, [giftId]: null }));
        return;
      }
      
      console.log('✅ Participant trouvé et validé:', participant);
      setSearchResults(prev => ({ 
        ...prev, 
        [giftId]: {
          ...participant,
          name: participant.name,
          surname: participant.surname,
          email: participant.email,
          phone: participant.phone,
          code: participant.code,
          giftId: participant.gift || participant.giftId
        }
      }));
      
    } catch (error) {
      console.error('❌ Erreur recherche participant:', error);
      
      if (error.response?.status === 404) {
        await Window.info(
          `Aucun participant trouvé avec le code: ${code}`,
          'Code non trouvé'
        );
      } else {
        await Window.info(
          error.response?.data?.message || 'Erreur lors de la recherche du participant',
          'Erreur'
        );
      }
      setSearchResults(prev => ({ ...prev, [giftId]: null }));
    } finally {
      setSearchLoading(prev => ({ ...prev, [giftId]: false }));
    }
  };

  const selectWinner = (giftId, participant) => {
    console.log('🏆 Sélection du gagnant:', { giftId, participant });
    setSelectedWinners(prev => ({
      ...prev,
      [giftId]: participant
    }));
    setSearchResults(prev => ({ ...prev, [giftId]: null }));
    setSearchTerms(prev => ({ ...prev, [giftId]: '' }));
  };

  const removeWinner = (giftId) => {
    setSelectedWinners(prev => ({
      ...prev,
      [giftId]: null
    }));
  };

  const handleSubmit = async () => {
    const winners = Object.entries(selectedWinners)
      .filter(([, winner]) => winner !== null)
      .map(([giftId, winner]) => ({
        giftId: giftId.toString(),
        code: winner.code
      }));

    console.log('🏆 Gagnants à soumettre:', winners);

    if (winners.length === 0) {
      await Window.info(
        'Veuillez sélectionner au moins un gagnant',
        'Aucun gagnant sélectionné'
      );
      return;
    }

    // Créer le message de confirmation
    const confirmationMessage = winners.map(w => {
      const gift = gifts.find(g => g._id.toString() === w.giftId);
      const winnerData = selectedWinners[w.giftId];
      return `• ${gift?.title}: ${winnerData?.name} ${winnerData?.surname} (${w.code})`;
    }).join('\n');

    // CORRECTION : Utilisation de Window.confirm
    const confirmed = await Window.confirm(
      `Êtes-vous sûr de vouloir sélectionner ${winners.length} gagnant(s) ?\n\n${confirmationMessage}`,
      'Confirmer la sélection'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await adminService.selectManualWinners({ winners });
      console.log('✅ Réponse du serveur:', response.data);
      
      // CORRECTION : Utilisation de Window.success
      await Window.success(
        `${winners.length} gagnant(s) sélectionné(s) avec succès!`,
        'Sélection réussie'
      );
      onWinnersSelected();
      onClose();
    } catch (error) {
      console.error('❌ Erreur soumission gagnants:', error);
      // CORRECTION : Utilisation de Window.info pour les erreurs
      await Window.info(
        error.response?.data?.message || 'Erreur lors de la sélection',
        'Erreur'
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const selectedCount = Object.values(selectedWinners).filter(w => w !== null).length;
  const totalGifts = gifts.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              🏆 Sélectionner les Gagnants
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sélectionnez un gagnant pour chaque cadeau ({selectedCount}/{totalGifts} sélectionnés)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors popup-button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des cadeaux...</p>
            </div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-8">
              <Gift size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Aucun cadeau actif</p>
              <p className="text-gray-400 text-sm mt-2">
                Ajoutez d'abord des cadeaux avant de sélectionner des gagnants
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {gifts.map((gift, index) => {
                const giftId = gift._id.toString();
                const searchResult = searchResults[giftId];
                const selectedWinner = selectedWinners[giftId];
                const searchTerm = searchTerms[giftId] || '';
                const isLoading = searchLoading[giftId];

                return (
                  <div key={giftId} className="border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Gift size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Cadeau {index + 1}: {gift.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {gift.description || "Aucune description"}
                        </p>
                      </div>
                    </div>

                    {/* Gagnant sélectionné */}
                    {selectedWinner ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-green-800 flex items-center gap-2">
                              <Check size={16} />
                              Gagnant sélectionné
                            </h4>
                            <p className="text-green-700 mt-1">
                              <strong>Nom:</strong> {selectedWinner.name} {selectedWinner.surname}
                            </p>
                            <p className="text-green-700">
                              <strong>Code:</strong> {selectedWinner.code}
                            </p>
                            <p className="text-green-700">
                              <strong>Email:</strong> {selectedWinner.email}
                            </p>
                            {selectedWinner.phone && (
                              <p className="text-green-700">
                                <strong>Téléphone:</strong> {selectedWinner.phone}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeWinner(giftId)}
                            className="text-red-600 hover:text-red-800 popup-button"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Recherche de participant */
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              placeholder="Entrer un code participant..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerms(prev => ({
                                ...prev,
                                [giftId]: e.target.value
                              }))}
                              onKeyPress={(e) => e.key === 'Enter' && searchParticipant(giftId, searchTerm)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => searchParticipant(giftId, searchTerm)}
                            disabled={isLoading || !searchTerm.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 popup-button"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Search size={16} />
                            )}
                            {isLoading ? 'Recherche...' : 'Rechercher'}
                          </button>
                        </div>

                        {/* Résultat de recherche */}
                        {isLoading && (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Recherche en cours...</p>
                          </div>
                        )}

                        {searchResult && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <Users size={16} />
                              Participant trouvé
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Nom:</strong> {searchResult.name} {searchResult.surname}</p>
                              <p><strong>Email:</strong> {searchResult.email}</p>
                              <p><strong>Téléphone:</strong> {searchResult.phone || 'Non renseigné'}</p>
                              <p><strong>Code:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{searchResult.code}</span></p>
                              <p><strong>Cadeau:</strong> {searchResult.giftId?.title || gift.title}</p>
                            </div>
                            <button
                              onClick={() => selectWinner(giftId, searchResult)}
                              className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 popup-button"
                            >
                              <Check size={16} />
                              Sélectionner comme gagnant
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedCount} / {totalGifts} gagnants sélectionnés
              {selectedCount < totalGifts && (
                <span className="text-orange-600 ml-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {totalGifts - selectedCount} cadeau(x) sans gagnant
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors popup-button"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedCount === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 popup-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sélection en cours...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Valider la sélection ({selectedCount})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectWinnersModal;