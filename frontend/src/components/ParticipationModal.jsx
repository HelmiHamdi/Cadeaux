import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ParticipationModal = ({ gift, isOpen, onClose, onParticipate }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false
  });

  // Fonctions de validation
  const validateName = (name) => {
    if (!name.trim()) return 'Le nom est requis';
    if (name.length < 2) return 'Le nom doit contenir au moins 2 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return 'Le nom contient des caractères invalides';
    return '';
  };

  const validateSurname = (surname) => {
    if (!surname.trim()) return 'Le prénom est requis';
    if (surname.length < 2) return 'Le prénom doit contenir au moins 2 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(surname)) return 'Le prénom contient des caractères invalides';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'L\'email est requis';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format d\'email invalide';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Le téléphone est requis';
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) return 'Le téléphone doit contenir exactement 8 chiffres';
    return '';
  };

  // Validation générale du formulaire
  const isFormValid = () => {
    return !validateName(formData.name) && 
           !validateSurname(formData.surname) && 
           !validateEmail(formData.email) && 
           !validatePhone(formData.phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés pour afficher les erreurs
    setTouched({
      name: true,
      surname: true,
      email: true,
      phone: true
    });

    // Valider tous les champs
    const newErrors = {
      name: validateName(formData.name),
      surname: validateSurname(formData.surname),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };
    
    setErrors(newErrors);

    // Si le formulaire n'est pas valide, arrêter la soumission
    if (!isFormValid()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onParticipate(gift._id, formData);
      setParticipantName(`${formData.name} ${formData.surname}`);
      setShowSuccess(true);

      // Fermeture automatique après 4 secondes
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({ name: '', surname: '', email: '', phone: '' });
        setTouched({ name: false, surname: false, email: false, phone: false });
        setErrors({ name: '', surname: '', email: '', phone: '' });
      }, 4000);
    } catch (error) {
      toast.error(error.message || "Erreur lors de la participation.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Traitement spécifique pour chaque champ
    if (name === 'phone') {
      // N'autoriser que les chiffres et limiter à 8
      processedValue = value.replace(/\D/g, '').slice(0, 8);
    } else if (name === 'name' || name === 'surname') {
      // Capitaliser la première lettre
      if (value.length === 1) {
        processedValue = value.toUpperCase();
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });

    // Validation en temps réel si le champ a déjà été touché
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'name':
          error = validateName(processedValue);
          break;
        case 'surname':
          error = validateSurname(processedValue);
          break;
        case 'email':
          error = validateEmail(processedValue);
          break;
        case 'phone':
          error = validatePhone(processedValue);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Valider le champ lorsqu'il perd le focus
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'surname':
        error = validateSurname(formData.surname);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
    setFormData({ name: '', surname: '', email: '', phone: '' });
    setTouched({ name: false, surname: false, email: false, phone: false });
    setErrors({ name: '', surname: '', email: '', phone: '' });
  };

  // Fonction pour obtenir la classe CSS en fonction de l'état du champ
  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors";
    
    if (!touched[fieldName]) {
      return `${baseClass} border-gray-300`;
    }
    
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 bg-red-50`;
    } else {
      return `${baseClass} border-green-500 bg-green-50`;
    }
  };

  // Fonction pour obtenir l'icône d'état
  const getFieldIcon = (fieldName) => {
    if (!touched[fieldName] || !formData[fieldName]) {
      return null;
    }
    
    if (errors[fieldName]) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {/* Modal Principal - Formulaire */}
        <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${showSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text">Participer au cadeau</h2>
              <button
                onClick={handleClose}
                className="text-text-light hover:text-text text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="mb-6 p-4 bg-primary bg-opacity-10 rounded-lg border border-primary border-opacity-20">
              <h3 className="font-semibold text-primary mb-2">{gift.title}</h3>
              <p className="text-sm text-text-light">Tous les champs sont obligatoires</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Nom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={getFieldClassName('name')}
                    placeholder="Votre nom"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldIcon('name')}
                  </div>
                </div>
                {touched.name && errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={getFieldClassName('surname')}
                    placeholder="Votre prénom"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldIcon('surname')}
                  </div>
                </div>
                {touched.surname && errors.surname && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.surname}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={getFieldClassName('email')}
                    placeholder="votre@email.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldIcon('email')}
                  </div>
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Téléphone *
                  <span className="text-xs text-gray-500 ml-1">(8 chiffres)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength="8"
                    className={getFieldClassName('phone')}
                    placeholder="12345678"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldIcon('phone')}
                  </div>
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
                {touched.phone && !errors.phone && formData.phone && (
                  <p className="text-green-500 text-xs mt-1 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Format valide
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-text rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </>
                  ) : (
                    'Participer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Animation de Succès */}
        <div className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-500 ${showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-gift-open">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-accent rounded-lg transform rotate-45 shadow-lg animate-pulse"></div>
                <div className="absolute inset-2 bg-yellow-400 rounded transform rotate-45"></div>
                <div className="absolute inset-0 rounded-lg bg-yellow-200 animate-ping opacity-20"></div>
              </div>
              <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">✨</div>
              <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce delay-150">⭐</div>
              <div className="absolute -bottom-2 -right-2 text-yellow-400 animate-bounce delay-300">🌟</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary mb-2">Félicitations !</h3>
              <p className="text-lg text-text">
                <span className="font-semibold text-secondary">{participantName}</span>
              </p>
              <p className="text-text-light">
                Vous êtes participant pour<br />
                <span className="font-semibold text-primary">{gift.title}</span>
              </p>
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-white mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="font-semibold">Vérifiez votre email</p>
                    <p className="text-xs text-white text-opacity-90">Code envoyé avec succès</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-accent text-primary py-3 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 mt-4"
              >
                Parfait !
              </button>
              <p className="text-xs text-text-light mt-3">
                Fermeture automatique dans 4 secondes
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipationModal;