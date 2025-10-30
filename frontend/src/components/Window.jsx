// components/Window.jsx
import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

const Window = {
  // Popup de confirmation
  confirm: (message, title = 'Confirmation') => {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-scale-in">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-yellow-100 rounded-full">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex gap-3 justify-end">
              <button id="cancel-btn" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                Annuler
              </button>
              <button id="confirm-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const confirmBtn = modal.querySelector('#confirm-btn');
      const cancelBtn = modal.querySelector('#cancel-btn');

      const cleanup = () => {
        modal.classList.add('animate-scale-out');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 200);
      };

      confirmBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(false);
      };

      // Fermer en cliquant en dehors
      modal.onclick = (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(false);
        }
      };

      // Échap pour fermer
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          resolve(false);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  },

  // Popup d'information
  info: (message, title = 'Information') => {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-scale-in">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-blue-100 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end">
              <button id="ok-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                OK
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const okBtn = modal.querySelector('#ok-btn');

      const cleanup = () => {
        modal.classList.add('animate-scale-out');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 200);
      };

      okBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(true);
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          resolve(true);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  },

  // Popup de succès
  success: (message, title = 'Succès') => {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-scale-in">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end">
              <button id="ok-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
                OK
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const okBtn = modal.querySelector('#ok-btn');

      const cleanup = () => {
        modal.classList.add('animate-scale-out');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 200);
      };

      okBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(true);
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          resolve(true);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  }
};

export default Window;