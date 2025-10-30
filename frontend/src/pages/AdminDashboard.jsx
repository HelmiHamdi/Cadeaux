import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Gift, Trophy, Plus, RefreshCw, 
  LogOut, User, Calendar, TrendingUp, Edit, Trash2, Eye
} from 'lucide-react';
import { adminService, authService } from '../services/adminApi';
import EditGiftModal from '../components/EditGiftModal';
import ParticipantsList from '../components/ParticipantsList';
import Window from '../components/Window';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newGifts, setNewGifts] = useState([
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admin, setAdmin] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedGiftParticipants, setSelectedGiftParticipants] = useState([]);
  const [selectedGiftTitle, setSelectedGiftTitle] = useState('');

  useEffect(() => {
    const adminData = authService.getProfile();
    setAdmin(adminData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError(error.response?.data?.message || 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleGiftChange = (index, field, value) => {
    const updatedGifts = [...newGifts];
    updatedGifts[index][field] = value;
    setNewGifts(updatedGifts);
  };

  const handleSubmitNewGifts = async () => {
    const validGifts = newGifts.filter(gift => gift.title.trim());
    
    if (validGifts.length === 0) {
      setError('Veuillez remplir au moins un cadeau');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await adminService.addNewGifts({ gifts: validGifts });
      setSuccess(`${validGifts.length} cadeaux ajoutés avec succès!`);
      setNewGifts(newGifts.map(() => ({ title: '', description: '', image: '' })));
      fetchDashboardData();
      setActiveTab('dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout des cadeaux');
    } finally {
      setLoading(false);
    }
  };

  const handleManualDraw = async () => {
    const confirmed = await Window.confirm(
      'Êtes-vous sûr de vouloir déclencher le tirage pour tous les cadeaux actuels? Cette action est irréversible.',
      'Tirage Manuel'
    );
    
    if (!confirmed) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await adminService.triggerManualDraw();
      await Window.success('Tirage effectué avec succès! Les résultats ont été générés.', 'Tirage Réussi');
      console.log('Résultats du tirage:', result.data);
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du tirage');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGift = async (giftId, formData) => {
    setLoading(true);
    setError('');
    try {
      await adminService.updateGift(giftId, formData);
      setSuccess('Cadeau modifié avec succès!');
      fetchDashboardData();
      setEditModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (giftId, giftTitle) => {
    const confirmed = await Window.confirm(
      `Êtes-vous sûr de vouloir supprimer le cadeau "${giftTitle}" ? Cette action est irréversible.`,
      'Supprimer le cadeau'
    );
    
    if (!confirmed) return;
    
    setLoading(true);
    setError('');
    try {
      await adminService.deleteGift(giftId);
      await Window.success('Cadeau supprimé avec succès!', 'Suppression réussie');
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGift = (gift) => {
    setSelectedGift(gift);
    setEditModalOpen(true);
  };

  const handleViewParticipants = async (giftId, giftTitle) => {
    setLoading(true);
    try {
      const response = await adminService.getGiftParticipants(giftId);
      const participants = response.data.participants;
      
      setSelectedGiftParticipants(participants);
      setSelectedGiftTitle(giftTitle);
      setShowParticipants(true);
    } catch (error) {
      setError('Erreur lors du chargement des participants',error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = await Window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      'Déconnexion'
    );
    
    if (confirmed) {
      authService.logout();
      window.location.reload();
    }
  };

  if (!dashboardData && loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              {admin && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User size={16} />
                  Connecté en tant que {admin.name}
                </p>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleManualDraw}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-colors popup-button"
              >
                <RefreshCw size={20} />
                Tirage Manuel
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 popup-button"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-scale-in">
            <strong>Erreur :</strong> {error}
            <button 
              onClick={fetchDashboardData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm popup-button"
            >
              Réessayer
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-scale-in">
            <strong>Succès :</strong> {success}
            <button 
              onClick={() => setSuccess('')}
              className="ml-4 bg-green-600 text-white px-3 py-1 rounded text-sm popup-button"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex space-x-8 mb-8 border-b">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
            { id: 'new-gifts', label: 'Nouveaux cadeaux', icon: Plus }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } transition-colors duration-200`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tableau de bord */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Cadeaux Actifs', value: dashboardData.stats.activeGifts, icon: Gift, color: 'blue' },
                { label: 'Total Participants', value: dashboardData.stats.totalParticipants, icon: Users, color: 'green' },
                { label: 'Tirages Effectués', value: dashboardData.stats.totalDraws, icon: Trophy, color: 'purple' },
                { label: 'Total Cadeaux', value: dashboardData.stats.totalGifts, icon: BarChart3, color: 'orange' },
                { label: 'Participants (7j)', value: dashboardData.stats.weeklyParticipants, icon: TrendingUp, color: 'red' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' : 
                      stat.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      <stat.icon className={`${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' : 
                        stat.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                      }`} size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cadeaux actifs avec DESIGN AMÉLIORÉ */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Cadeaux Actifs ({dashboardData.activeGifts.length})</h2>
                <p className="text-sm text-gray-600">
                  Gérez vos cadeaux 
                </p>
              </div>
              <div className="p-6">
                {dashboardData.activeGifts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.activeGifts.map((gift) => (
                      <div key={gift._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                        {/* Header avec boutons d'action - POSITIONNÉ AU-DESSUS DE L'IMAGE */}
                        <div className="relative">
                          {/* Conteneur image avec overlay pour les boutons */}
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img 
                              src={gift.image || 'https://via.placeholder.com/300x200?text=Image+Cadeau'} 
                              alt={gift.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-gray-400 bg-gray-100">
                              <Gift size={48} />
                            </div>
                            
                            {/* Overlay gradient pour meilleure visibilité des boutons */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            
                            {/* Boutons d'action - POSITIONNÉS AU-DESSUS DE L'IMAGE */}
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button
                                onClick={() => handleEditGift(gift)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20 popup-button"
                                title="Modifier le cadeau"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleViewParticipants(gift._id, gift.title)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-green-600 rounded-lg hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20 popup-button"
                                title="Voir les participants"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteGift(gift._id, gift.title)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20 popup-button"
                                title="Supprimer le cadeau"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Contenu texte */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                            {gift.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                            {gift.description || 'Aucune description'}
                          </p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={12} />
                              <span>Créé le {new Date(gift.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Actif"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gift size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">Aucun cadeau actif</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Ajoutez de nouveaux cadeaux via l'onglet "Nouveaux cadeaux"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Participants récents */}
            {dashboardData.recentParticipants && dashboardData.recentParticipants.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Participants Récents</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {dashboardData.recentParticipants.slice(0, 5).map((participant) => (
                      <div key={participant._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div>
                          <p className="font-medium text-gray-900">
                            {participant.name} {participant.surname}
                          </p>
                          <p className="text-sm text-gray-600">{participant.email}</p>
                          <p className="text-xs text-gray-500">
                            {participant.giftId?.title || 'Cadeau inconnu'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-blue-600">{participant.code}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(participant.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nouveaux cadeaux */}
        {activeTab === 'new-gifts' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Ajouter de nouveaux cadeaux</h2>
              <p className="text-sm text-gray-600">
                Les anciens cadeaux seront automatiquement archivés
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {newGifts.map((gift, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4 hover:border-blue-300 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Cadeau {index + 1}</h3>
                    {newGifts.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedGifts = newGifts.filter((_, i) => i !== index);
                          setNewGifts(updatedGifts);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm popup-button"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                      </label>
                      <input
                        type="text"
                        value={gift.title}
                        onChange={(e) => handleGiftChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="iPhone 15 Pro Max"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={gift.image}
                        onChange={(e) => handleGiftChange(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={gift.description}
                      onChange={(e) => handleGiftChange(index, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Description du cadeau..."
                    />
                  </div>

                  {/* Aperçu de l'image */}
                  {gift.image && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aperçu de l'image
                      </label>
                      <div className="w-32 h-32 border rounded-lg overflow-hidden">
                        <img 
                          src={gift.image} 
                          alt="Aperçu" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  onClick={() => setNewGifts([...newGifts, { title: '', description: '', image: '' }])}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors popup-button"
                >
                  <Plus size={16} />
                  Ajouter un cadeau
                </button>
                
                <button
                  onClick={handleSubmitNewGifts}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold transition-colors flex items-center justify-center gap-2 popup-button"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Ajouter les {newGifts.filter(g => g.title.trim()).length} cadeaux valides
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      <EditGiftModal
        gift={selectedGift}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdateGift}
      />

      {/* Composant ParticipantsList */}
      <ParticipantsList
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={selectedGiftParticipants}
        giftTitle={selectedGiftTitle}
      />
    </div>
  );
};

export default AdminDashboard;