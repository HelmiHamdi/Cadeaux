import React, { useState, useEffect } from 'react';
import { Search, X, Check, FileText, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { codeService } from '../services/codeApi';
import Window from './Window';

const CodeManagement = ({ isOpen, onClose, giftId, giftTitle }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [currentResult, setCurrentResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    if (isOpen && giftId) {
      fetchCodes();
      // Réinitialiser la pagination à l'ouverture
      setCurrentPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, giftId]);

  const fetchCodes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await codeService.getGiftCodes(giftId);
      setCodes(response.data.participants || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du chargement des codes');
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = codes.filter(participant =>
    participant.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculs pour la pagination
  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCodes = filteredCodes.slice(startIndex, endIndex);

  const toggleCodeSelection = (code) => {
    const newSelected = new Set(selectedCodes);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCodes(newSelected);
  };

  const selectAllCodes = () => {
    if (selectedCodes.size === filteredCodes.length) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(filteredCodes.map(p => p.code)));
    }
  };

  // Navigation des pages
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Recherche unitaire par code
  const searchSingleCode = async () => {
    if (!searchInput.trim()) {
      await Window.alert('Veuillez entrer un code à rechercher', 'Code manquant');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await codeService.searchByCode(searchInput.trim());
      setCurrentResult(response.data.participant);
      setSearchInput('');
    } catch (error) {
      console.error('Erreur recherche unitaire:', error);
      if (error.response?.status === 404) {
        await Window.alert(
          `Aucun participant trouvé avec le code: ${searchInput}`,
          'Code non trouvé'
        );
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la recherche');
      }
      setCurrentResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Recherche multiple (pour l'impression)
  const searchSelectedCodes = async () => {
    if (selectedCodes.size === 0) {
      await Window.alert('Veuillez sélectionner au moins un code', 'Aucun code sélectionné');
      return;
    }

    setSearchLoading(true);
    try {
      const codesArray = Array.from(selectedCodes);
      const response = await codeService.searchByCodes(codesArray);
      
      // Afficher seulement le premier résultat ou un message
      if (response.data.participants && response.data.participants.length > 0) {
        setCurrentResult(response.data.participants[0]);
      }
      
      if (response.data.notFoundCodes && response.data.notFoundCodes.length > 0) {
        await Window.alert(
          `Codes non trouvés: ${response.data.notFoundCodes.join(', ')}`,
          'Recherche partielle'
        );
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la recherche');
    } finally {
      setSearchLoading(false);
    }
  };

  const generatePDF = async () => {
    if (selectedCodes.size === 0) {
      await Window.alert('Veuillez sélectionner des codes à imprimer', 'Aucun code sélectionné');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      const selectedCodesArray = Array.from(selectedCodes);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Codes Participants - ${giftTitle}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333; 
              padding-bottom: 10px; 
            }
            .header h1 { 
              color: #333; 
              margin: 0; 
              font-size: 24px;
            }
            .header .subtitle { 
              color: #666; 
              font-size: 14px; 
              margin-top: 5px;
            }
            .codes-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
              gap: 15px; 
              margin-top: 20px;
            }
            .code-card { 
              border: 2px solid #2563eb; 
              padding: 20px 10px; 
              border-radius: 8px; 
              text-align: center;
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              min-height: 80px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            .code { 
              font-size: 20px; 
              font-weight: bold; 
              color: #2563eb; 
              margin: 0;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
            }
            .count { 
              font-size: 11px; 
              color: #666; 
              margin-top: 5px;
            }
            @media print {
              body { 
                margin: 10px; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .codes-grid { 
                grid-template-columns: repeat(6, 1fr); 
                gap: 8px;
              }
              .code-card { 
                border: 2px solid #2563eb !important;
                padding: 15px 5px;
                break-inside: avoid;
              }
              .code { 
                font-size: 16px;
              }
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎁 ${giftTitle}</h1>
            <div class="subtitle">Liste des codes participants - ${selectedCodesArray.length} codes</div>
            <div class="subtitle">Généré le ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="codes-grid">
            ${selectedCodesArray.map((code, index) => `
              <div class="code-card">
                <div class="code">${code}</div>
                <div class="count">#${index + 1}</div>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 500);
      }, 500);
    } catch (error) {
      setError('Erreur lors de la génération du PDF');
      console.error('Erreur PDF:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Gestion des Codes - {giftTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {codes.length} codes participants au total - {selectedCodes.size} codes sélectionnés
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
        <div className="flex-1 overflow-hidden flex">
          {/* Liste des codes */}
          <div className="flex-1 border-r p-6 overflow-y-auto">
            {/* Barre de recherche et actions - IDENTIQUE À L'ORIGINAL */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={selectAllCodes}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors popup-button"
              >
                {selectedCodes.size === filteredCodes.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              
              <button
                onClick={searchSelectedCodes}
                disabled={selectedCodes.size === 0 || searchLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 popup-button"
              >
                <Search size={20} />
                Rechercher
              </button>
              
              <button
                onClick={generatePDF}
                disabled={selectedCodes.size === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 popup-button"
              >
                <FileText size={20} />
                Imprimer
              </button>
            </div>

            {/* PAGINATION - NOUVEAU */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {filteredCodes.length} codes trouvés - Page {currentPage} sur {totalPages}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Afficher:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Navigation des pages */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-colors popup-button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="text-sm text-gray-600 mx-2">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-colors popup-button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Liste des codes */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des codes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                {error}
              </div>
            ) : filteredCodes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun code trouvé
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {currentCodes.map((participant) => (
                  <div
                    key={participant.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      selectedCodes.has(participant.code)
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCodeSelection(participant.code)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedCodes.has(participant.code)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedCodes.has(participant.code) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <div className="font-mono font-bold text-lg text-blue-600 flex-1 text-center">
                        {participant.code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Résultats de recherche */}
          <div className="w-96 p-6 bg-gray-50 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} />
              Recherche Participant
            </h3>

            {/* Champ de recherche unitaire */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Entrer un code..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchSingleCode()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={searchSingleCode}
                  disabled={searchLoading || !searchInput.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors popup-button"
                >
                  <Search size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Entrez un code et appuyez sur Entrée ou cliquez sur la loupe
              </p>
            </div>

            {/* Affichage du résultat unique */}
            {searchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Recherche en cours...</p>
              </div>
            ) : currentResult ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="font-mono font-bold text-blue-600 text-center mb-3 text-lg border-b pb-2">
                  {currentResult.code}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <strong className="text-gray-700">Nom:</strong>
                    <span className="text-right">{currentResult.name} {currentResult.surname}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <strong className="text-gray-700">Email:</strong>
                    <span className="text-right text-blue-600 break-all">{currentResult.email}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <strong className="text-gray-700">Téléphone:</strong>
                    <span className="text-right">{currentResult.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <strong className="text-gray-700">Cadeau:</strong>
                    <span className="text-right text-green-600">{currentResult.gift.title}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <strong className="text-gray-700">Date participation:</strong>
                    <span className="text-right">{new Date(currentResult.participationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bouton pour effacer le résultat */}
                <button
                  onClick={() => setCurrentResult(null)}
                  className="w-full mt-4 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm popup-button"
                >
                  Effacer le résultat
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                <p>Entrez un code pour rechercher</p>
                <p className="mt-1">les informations d'un participant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeManagement;