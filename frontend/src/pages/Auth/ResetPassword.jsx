import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import PropTypes from 'prop-types';
import { resetPassword } from '@/services/authService';
import AuthLayout from './AuthLayout';
import './ResetPassword.css';

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
 * Page de réinitialisation du mot de passe
 * Permet de définir un nouveau mot de passe avec un token
 */
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Vérifier la présence du token
  useEffect(() => {
    if (!token) {
      setIsError(true);
    }
  }, [token]);

  // Calcul de la force du mot de passe
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthInfo(passwordStrength);

  // Gestion du changement de valeur des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Nettoyer l'erreur du champ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation côté client
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Le nouveau sceau est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le sceau doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme ton nouveau sceau';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les sceaux ne correspondent pas';
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
      await resetPassword(token, formData.password, formData.confirmPassword);
      setIsSuccess(true);
    } catch (error) {
      console.error('Erreur réinitialisation mot de passe:', error);

      if (error.code === 'TOKEN_EXPIRED' || error.code === 'INVALID_TOKEN') {
        setIsError(true);
      } else {
        setErrors({
          general: error.message || 'Une erreur est survenue lors de la réinitialisation',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage de l'état succès
  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="state-container text-center py-10">
          <div className="state-icon success mx-auto mb-6">✓</div>
          <h3 className="state-title success font-heading text-2xl mb-4">
            Sceau Forgé avec Succès
          </h3>
          <p className="state-message font-body text-primary-300 mb-6 leading-relaxed">
            Ton nouveau sceau est gravé dans la pierre. Tu peux maintenant entrer dans les ruines
            avec ton âme renouvelée.
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

  // Affichage de l'état erreur (token invalide/expiré)
  if (isError) {
    return (
      <AuthLayout>
        <div className="alert-error p-4 bg-error/10 border border-error/30 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <span className="alert-icon text-2xl text-error flex-shrink-0">✖</span>
            <div className="flex-1">
              <div className="alert-title font-alert text-lg text-error mb-1">
                Lien Sacré Expiré
              </div>
              <p className="font-body text-sm text-primary-300">
                Les runes du lien se sont effacées dans le temps. Demande un nouveau lien sacré pour
                réinitialiser ton sceau.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/mot-de-passe-oublie"
          className="btn-primary block text-center py-3.5 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow"
        >
          Demander un Nouveau Lien
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="auth-title font-heading text-3xl md:text-4xl text-secondary-400 text-center mb-3">
        Forge un Nouveau Sceau
      </h2>
      <p className="auth-subtitle font-body text-sm md:text-base text-primary-300 text-center mb-8 leading-relaxed">
        Les anciennes runes sont oubliées. Grave un nouveau sceau dans la pierre.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Erreur générale */}
        {errors.general && (
          <div className="form-error-general mb-6 p-4 bg-error/10 border border-error/30 rounded-md font-body text-error text-sm">
            {errors.general}
          </div>
        )}

        {/* Password */}
        <div className="form-group mb-5">
          <label htmlFor="password" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Nouveau Sceau Secret <span className="text-secondary-500">*</span>
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
        <div className="form-group mb-6">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Forgeage...' : 'Réinitialiser mon Sceau'}
        </button>
      </form>
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

export default ResetPassword;
