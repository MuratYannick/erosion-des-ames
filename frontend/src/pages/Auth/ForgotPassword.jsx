import { useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { forgotPassword } from '@/services/authService';
import AuthLayout from './AuthLayout';
import './ForgotPassword.css';

/**
 * Page de récupération de mot de passe
 * Permet d'envoyer un email de réinitialisation
 */
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Gestion du submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation côté client
    if (!email) {
      setErrors({ email: 'L\'adresse spirituelle est requise' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'L\'adresse spirituelle n\'est pas valide' });
      return;
    }

    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      console.error('Erreur mot de passe oublié:', error);
      // On affiche quand même le message de succès pour ne pas révéler si l'email existe
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du message de succès
  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="alert-success p-4 bg-info/10 border border-info/30 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <span className="alert-icon text-2xl text-info flex-shrink-0">✓</span>
            <div className="flex-1">
              <div className="alert-title font-alert text-lg text-info mb-1">
                Lien Envoyé aux Ruines
              </div>
              <p className="font-body text-sm text-primary-300">
                Si cette adresse spirituelle existe dans nos archives, un lien sacré a été envoyé à
                ton messager spirituel. Consulte-le pour forger un nouveau sceau.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/connexion"
          className="auth-link block text-center font-body text-sm text-secondary-400 hover:text-secondary-300 hover:underline transition-colors duration-normal"
        >
          ← Retour à la connexion
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="auth-title font-heading text-3xl md:text-4xl text-secondary-400 text-center mb-3">
        Réinitialise les Cendres
      </h2>
      <p className="auth-subtitle font-body text-sm md:text-base text-primary-300 text-center mb-8 leading-relaxed">
        Les mémoires s&apos;effacent dans les ruines. Nous t&apos;enverrons un lien sacré pour
        forger un nouveau sceau.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="form-group mb-6">
          <label htmlFor="email" className="form-label font-ui text-sm text-primary-200 mb-2 block">
            Adresse Spirituelle <span className="text-secondary-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            placeholder="ton.ame@ruines.com"
            className={`form-input w-full py-3 px-4 bg-primary-800/50 border rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal ${
              errors.email ? 'border-error' : 'border-primary-600'
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.email && <FieldError message={errors.email} />}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Lien Sacré'}
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
        ← Retour à la connexion
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

export default ForgotPassword;
