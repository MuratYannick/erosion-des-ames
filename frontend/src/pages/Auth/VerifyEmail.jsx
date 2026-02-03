import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import PropTypes from 'prop-types';
import { verifyEmail, resendVerification } from '@/services/authService';
import { useToast } from '@/components/ui/Toast';
import Loader from '@/components/ui/Loader/Loader';
import AuthLayout from './AuthLayout';
import './VerifyEmail.css';

/**
 * Page de vérification d'email
 * Vérifie automatiquement le token au chargement
 */
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Vérifier le token au montage
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Aucun lien de vérification trouvé');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        console.error('Erreur vérification email:', error);
        setStatus('error');

        if (error.code === 'TOKEN_EXPIRED') {
          setErrorMessage('Le lien de vérification a expiré');
        } else if (error.code === 'INVALID_TOKEN') {
          setErrorMessage('Le lien de vérification est invalide');
        } else {
          setErrorMessage(error.message || 'Une erreur est survenue lors de la vérification');
        }
      }
    };

    verifyToken();
  }, [token]);

  // Renvoyer l'email de vérification
  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!resendEmail) {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: 'Saisis ton adresse spirituelle',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resendEmail)) {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: 'Adresse spirituelle invalide',
      });
      return;
    }

    setIsResending(true);

    try {
      await resendVerification(resendEmail);
      addToast({
        variant: 'success',
        title: 'Email envoyé',
        message: 'Consulte ton messager spirituel',
      });
      setShowResendForm(false);
    } catch (error) {
      console.error('Erreur renvoi vérification:', error);
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de renvoyer l\'email',
      });
    } finally {
      setIsResending(false);
    }
  };

  // État Loading
  if (status === 'loading') {
    return (
      <AuthLayout>
        <div className="loading-container text-center py-12">
          <Loader variant="spinner" size="lg" showAura className="mx-auto mb-6" />
          <p className="loading-text font-ui text-base text-primary-300">
            Vérification de ton âme dans les flammes...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // État Success
  if (status === 'success') {
    return (
      <AuthLayout>
        <div className="state-container text-center py-10">
          <div className="state-icon success mx-auto mb-6">✓</div>
          <h3 className="state-title success font-heading text-2xl md:text-3xl mb-4">
            Ton Âme est Vérifiée
          </h3>
          <p className="state-message font-body text-primary-300 mb-6 leading-relaxed">
            Les flammes sacrées ont reconnu ton essence. Bienvenue parmi les survivants des ruines.
          </p>
          <Link
            to="/connexion"
            className="btn-primary inline-block px-8 py-3 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow"
          >
            Entrer dans les Ruines
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // État Error
  return (
    <AuthLayout>
      <div className="state-container text-center py-10">
        <div className="state-icon error mx-auto mb-6">✖</div>
        <h3 className="state-title error font-heading text-2xl md:text-3xl mb-4">
          Vérification Échouée
        </h3>
        <p className="state-message font-body text-primary-300 mb-6 leading-relaxed">
          {errorMessage || 'Les flammes n\'ont pas reconnu le sceau. Le lien est peut-être expiré ou invalide.'}
        </p>

        {/* Formulaire de renvoi ou bouton */}
        {showResendForm ? (
          <form onSubmit={handleResendVerification} className="mb-6">
            <div className="form-group mb-4">
              <label htmlFor="resend-email" className="form-label font-ui text-sm text-primary-200 mb-2 block">
                Adresse Spirituelle
              </label>
              <input
                type="email"
                id="resend-email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="ton.ame@ruines.com"
                className="form-input w-full py-3 px-4 bg-primary-800/50 border border-primary-600 rounded-md font-body text-primary-100 placeholder:text-primary-400 focus:border-secondary-500 focus:outline-none transition-all duration-normal"
                disabled={isResending}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isResending}
              className="btn-primary w-full py-3 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Envoi...' : 'Envoyer'}
            </button>
            <button
              type="button"
              onClick={() => setShowResendForm(false)}
              className="mt-3 text-primary-400 hover:text-secondary-400 font-body text-sm underline"
            >
              Annuler
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowResendForm(true)}
            className="btn-primary inline-block px-8 py-3 font-button text-lg text-primary-900 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg transition-all duration-normal hover:shadow-glow mb-6"
          >
            Renvoyer l&apos;Email de Vérification
          </button>
        )}

        {/* Divider tribal */}
        <div className="tribal-divider my-6">
          <span className="tribal-divider-icon text-secondary-500 text-xl">◆</span>
        </div>

        {/* Link to Login */}
        <Link
          to="/connexion"
          className="auth-link block text-center font-body text-sm text-secondary-400 hover:text-secondary-300 hover:underline transition-colors duration-normal"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
