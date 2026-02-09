import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { resendVerification } from '@/services/authService';
import AuthLayout from './AuthLayout';
import './Login.css';

/**
 * Page de connexion
 * Permet à l'utilisateur de se connecter avec email/username et mot de passe
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

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

  // Gestion du submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setEmailNotVerified(false);

    // Validation côté client
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'L\'identifiant est requis';
    }
    if (!formData.password) {
      newErrors.password = 'Le sceau secret est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.identifier, formData.password);

      addToast({
        variant: 'success',
        title: 'Bienvenue dans les Ruines',
        message: 'Connexion réussie',
      });

      // Redirection vers la page d'origine ou la page d'accueil
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);

      // Gestion des erreurs spécifiques
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        setEmailNotVerified(true);
        setErrors({
          general:
            'Ton âme n\'est pas encore vérifiée. Consulte ton messager spirituel pour activer ton compte.',
        });
      } else if (error.code === 'INVALID_CREDENTIALS') {
        setErrors({
          general: 'Identifiant ou sceau secret incorrect',
        });
      } else {
        setErrors({
          general: error.message || 'Une erreur est survenue lors de la connexion',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renvoyer l'email de vérification
  const handleResendVerification = async () => {
    // Vérifier si l'identifiant est un email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
    if (!formData.identifier || !isEmail) {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: 'Saisis ton adresse email pour renvoyer la vérification',
      });
      return;
    }

    setIsResendingVerification(true);

    try {
      await resendVerification(formData.identifier);
      addToast({
        variant: 'success',
        title: 'Email envoyé',
        message: 'Consulte ton messager spirituel',
      });
    } catch (error) {
      console.error('Erreur renvoi vérification:', error);
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de renvoyer l\'email',
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title font-heading text-3xl md:text-4xl text-secondary-400 text-center mb-8">
        Entrez dans les Ruines
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Erreur générale */}
        {errors.general && (
          <div className="form-error-general mb-6 p-4 bg-error/10 border border-error/30 rounded-md font-body text-error text-sm">
            {errors.general}
            {emailNotVerified && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className="block mt-3 text-secondary-400 hover:text-secondary-300 underline font-ui text-sm disabled:opacity-50"
              >
                {isResendingVerification
                  ? 'Envoi en cours...'
                  : 'Renvoyer l\'email de vérification'}
              </button>
            )}
          </div>
        )}

        {/* Identifier (email ou username) */}
        <div className="form-group mb-6">
          <label htmlFor="identifier" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Nom de Guerrier ou Email <span className="text-secondary-500">*</span>
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="ton.ame@ruines.com ou ChasseurDesCendres"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.identifier ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.identifier && <FieldError message={errors.identifier} />}
        </div>

        {/* Password */}
        <div className="form-group mb-6">
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
        </div>

        {/* Remember Me */}
        <div className="form-checkbox mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="custom-checkbox mt-0.5"
              disabled={isSubmitting}
            />
            <span className="font-body text-sm text-primary-200">Se souvenir de mon âme</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Connexion...' : 'Se Connecter'}
        </button>
      </form>

      {/* Divider tribal */}
      <div className="tribal-divider my-8">
        <span className="tribal-divider-icon text-secondary-500 text-xl">◆</span>
      </div>

      {/* Links */}
      <div className="auth-links flex flex-col gap-3">
        <Link
          to="/mot-de-passe-oublie"
          className="auth-link text-center font-body text-sm text-secondary-400 hover:text-secondary-300 hover:underline transition-colors duration-normal"
        >
          Sceau oublié ? Réinitialiser
        </Link>
        <Link
          to="/inscription"
          className="auth-link text-center font-body text-sm text-secondary-400 hover:text-secondary-300 hover:underline transition-colors duration-normal"
        >
          Pas encore d&apos;âme érodée ? Rejoins-nous
        </Link>
      </div>
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

export default Login;
