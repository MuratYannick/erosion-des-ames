import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import AuthLayout from './AuthLayout';
import './Register.css';

/**
 * Calcule la force d'un mot de passe
 * @param {string} password - Le mot de passe à évaluer
 * @returns {number} Score de 0 à 4
 */
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

/**
 * Retourne les infos de force du mot de passe
 * @param {number} score - Score de 0 à 4
 * @returns {Object} Classe CSS et texte
 */
function getPasswordStrengthInfo(score) {
  const strengthMap = {
    0: { className: '', text: '' },
    1: { className: 'weak', text: 'Faible' },
    2: { className: 'medium', text: 'Moyenne' },
    3: { className: 'strong', text: 'Forte' },
    4: { className: 'very-strong', text: 'Très forte' },
  };
  return strengthMap[score];
}

/**
 * Page d'inscription
 * Permet à un nouvel utilisateur de créer un compte
 */
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedCgu: false,
    acceptedRules: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Calcul de la force du mot de passe
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthInfo(passwordStrength);

  // Gestion du changement de valeur des inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Nettoyer l'erreur du champ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation côté client
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Le nom de guerrier est requis';
    } else if (formData.username.length < 5) {
      newErrors.username = 'Le nom doit contenir au moins 5 caractères';
    }

    if (!formData.email) {
      newErrors.email = 'L\'adresse spirituelle est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'adresse spirituelle n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le sceau secret est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le sceau doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme ton sceau secret';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les sceaux ne correspondent pas';
    }

    if (!formData.acceptedCgu) {
      newErrors.acceptedCgu = 'Tu dois accepter les Lois des Ruines';
    }

    if (!formData.acceptedRules) {
      newErrors.acceptedRules = 'Tu dois accepter le Code des Survivants';
    }

    return newErrors;
  };

  // Gestion du submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptedCgu: formData.acceptedCgu,
        acceptedRules: formData.acceptedRules,
      });

      setRegistrationSuccess(true);
      addToast({
        variant: 'success',
        title: 'Âme forgée avec succès',
        message: 'Vérifie ton email pour activer ton compte',
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);

      // Gestion des erreurs spécifiques
      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        setErrors({
          email: 'Cette adresse spirituelle est déjà utilisée',
        });
      } else if (error.code === 'USERNAME_ALREADY_EXISTS') {
        setErrors({
          username: 'Ce nom de guerrier est déjà pris',
        });
      } else {
        setErrors({
          general: error.message || 'Une erreur est survenue lors de l\'inscription',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du message de succès
  if (registrationSuccess) {
    return (
      <AuthLayout>
        <div className="state-container text-center py-10">
          <div className="state-icon success mx-auto mb-6">✓</div>
          <h3 className="state-title success font-heading text-2xl mb-4">Ton Âme est Forgée</h3>
          <p className="state-message font-body text-primary-300 mb-6 leading-relaxed">
            Bienvenue parmi les survivants des ruines. Un lien sacré a été envoyé à ton messager
            spirituel. Consulte-le pour vérifier ton âme et entrer dans les flammes.
          </p>
          <Link
            to="/connexion"
            className="btn-primary inline-block px-8 py-3 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow"
          >
            Se Connecter
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="auth-title font-heading text-3xl md:text-4xl text-secondary-400 text-center mb-3">
        Forge ton Âme
      </h2>
      <p className="auth-subtitle font-body text-sm md:text-base text-primary-300 text-center mb-8">
        Rejoins les survivants dans les ruines du monde ancien
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Erreur générale */}
        {errors.general && (
          <div className="form-error-general mb-6 p-4 bg-error/10 border border-error/30 rounded-md font-body text-error text-sm">
            {errors.general}
          </div>
        )}

        {/* Username */}
        <div className="form-group mb-5">
          <label htmlFor="username" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Nom de Guerrier <span className="text-secondary-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Chasseur des Cendres"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.username ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.username && <FieldError message={errors.username} />}
        </div>

        {/* Email */}
        <div className="form-group mb-5">
          <label htmlFor="email" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Adresse Spirituelle <span className="text-secondary-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ton.ame@ruines.com"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.email ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.email && <FieldError message={errors.email} />}
        </div>

        {/* Password */}
        <div className="form-group mb-5">
          <label htmlFor="password" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Sceau Secret <span className="text-secondary-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.password ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.password && <FieldError message={errors.password} />}

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className={`password-strength mt-3 ${passwordStrengthInfo.className}`}>
              <span className="password-strength-label font-ui text-xs text-primary-300 block mb-2">
                Force du sceau:
              </span>
              <div className="password-strength-bars flex gap-1.5 h-1.5">
                <div className="password-strength-bar flex-1 bg-primary-800 border border-primary-700 rounded-sm transition-all"></div>
                <div className="password-strength-bar flex-1 bg-primary-800 border border-primary-700 rounded-sm transition-all"></div>
                <div className="password-strength-bar flex-1 bg-primary-800 border border-primary-700 rounded-sm transition-all"></div>
                <div className="password-strength-bar flex-1 bg-primary-800 border border-primary-700 rounded-sm transition-all"></div>
              </div>
              <span className="password-strength-text font-ui text-xs mt-1.5 block text-right">
                {passwordStrengthInfo.text}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-5">
          <label
            htmlFor="confirmPassword"
            className="form-label font-ui text-sm text-primary-200 mb-2 block"
          >
            Confirme ton Sceau <span className="text-secondary-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.confirmPassword ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
        </div>

        {/* Accept CGU */}
        <div className="form-checkbox mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="acceptedCgu"
              name="acceptedCgu"
              checked={formData.acceptedCgu}
              onChange={handleChange}
              className="custom-checkbox mt-0.5"
              disabled={isSubmitting}
            />
            <span className="font-body text-sm text-primary-200">
              J&apos;accepte les{' '}
              <a href="#" className="text-secondary-400 hover:text-secondary-300 hover:underline">
                Lois des Ruines
              </a>{' '}
              (CGU)
            </span>
          </label>
          {errors.acceptedCgu && <FieldError message={errors.acceptedCgu} />}
        </div>

        {/* Accept Rules */}
        <div className="form-checkbox mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="acceptedRules"
              name="acceptedRules"
              checked={formData.acceptedRules}
              onChange={handleChange}
              className="custom-checkbox mt-0.5"
              disabled={isSubmitting}
            />
            <span className="font-body text-sm text-primary-200">
              J&apos;accepte le{' '}
              <a href="#" className="text-secondary-400 hover:text-secondary-300 hover:underline">
                Code des Survivants
              </a>{' '}
              (Règlement)
            </span>
          </label>
          {errors.acceptedRules && <FieldError message={errors.acceptedRules} />}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Forgeage...' : 'Forger mon Âme'}
        </button>
      </form>

      {/* Divider tribal */}
      <div className="tribal-divider my-8">
        <span className="tribal-divider-icon text-secondary-500 text-xl">◆</span>
      </div>

      {/* Link to Login */}
      <Link
        to="/connexion"
        className="auth-link block text-center font-body text-sm text-secondary-400 hover:text-secondary-300 hover:underline transition-colors duration-normal"
      >
        Déjà une âme forgée ? Connecte-toi
      </Link>
    </AuthLayout>
  );
}

/**
 * Composant pour afficher les erreurs de champ
 */
function FieldError({ message }) {
  return (
    <div className="form-error font-alert text-error text-sm mt-1.5 flex items-center gap-1.5">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}

FieldError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Register;
