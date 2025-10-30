import React from 'react';
import { X, Users, Mail, Phone, Calendar } from 'lucide-react';

const ParticipantsList = ({ isOpen, onClose, participants, giftTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={24} />
              Participants pour : {giftTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {participants.length} participant(s) trouvé(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {participants.length > 0 ? (
            <div className="p-6">
              <div className="grid gap-4">
                {participants.map((participant, index) => (
                  <div
                    key={participant._id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nom complet</label>
                        <p className="font-semibold text-gray-900">
                          {participant.name} {participant.surname}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Mail size={14} />
                          Email
                        </label>
                        <p className="text-gray-900 break-all">{participant.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Code</label>
                        <p className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm inline-block">
                          {participant.code}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Calendar size={14} />
                          Date d'inscription
                        </label>
                        <p className="text-gray-900">
                          {new Date(participant.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {participant.phone && (
                      <div className="mt-3">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Phone size={14} />
                          Téléphone
                        </label>
                        <p className="text-gray-900">{participant.phone}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun participant
              </h3>
              <p className="text-gray-600">
                Aucun participant n'a encore rejoint ce cadeau.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total : {participants.length} participant(s)
            </span>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;