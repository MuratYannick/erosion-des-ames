import { Link } from 'react-router-dom'
import { LogoEmblem } from './Header'
import './Footer.css'

/**
 * Footer Border - Foundation Edge
 */
const FooterBorder = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 12"
    preserveAspectRatio="none"
    className={`footer-border ${className}`}
    aria-hidden="true"
  >
    {/* Thicker carved base */}
    <path
      d="M0 6 Q50 4, 100 6 T200 6 T300 6 T400 6 T500 6 T600 6 T700 6 T800 6 T900 6 T1000 6 T1100 6 L1200 6"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    {/* Upper accent line */}
    <path
      d="M0 2 L1200 2"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.4"
      className="text-primary-600"
    />
    {/* Ritual markings */}
    <circle cx="100" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    <circle cx="300" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    <circle cx="500" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    <circle cx="700" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    <circle cx="900" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    <circle cx="1100" cy="6" r="2" fill="currentColor" className="text-secondary-500" />
    {/* Small vertical marks */}
    <line x1="200" y1="3" x2="200" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="400" y1="3" x2="400" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="600" y1="3" x2="600" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="800" y1="3" x2="800" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="1000" y1="3" x2="1000" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
)

/**
 * Mobile Divider
 */
const MobileDivider = () => (
  <svg
    viewBox="0 0 200 24"
    preserveAspectRatio="none"
    className="footer-mobile-divider w-full"
    aria-hidden="true"
  >
    <line
      x1="0"
      y1="12"
      x2="200"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 2"
      opacity="0.4"
    />
    <path
      d="M100 8 L104 12 L100 16 L96 12 Z"
      fill="currentColor"
      opacity="0.6"
      className="text-secondary-500"
    />
    <circle cx="100" cy="12" r="1.5" fill="currentColor" className="text-surface" />
  </svg>
)

/**
 * Social Icons
 */
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

/**
 * Navigation Links
 */
const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Avant-propos', href: '/avant-propos' },
  { label: 'Univers', href: '/univers' },
  { label: 'Personnages', href: '/personnages' },
  { label: 'Forum', href: '/forum' },
]

/**
 * Legal Links
 */
const legalLinks = [
  { label: 'Mentions legales', href: '/mentions-legales' },
  { label: "Conditions d'utilisation", href: '/cgu' },
  { label: 'Politique de confidentialite', href: '/confidentialite' },
  { label: 'Gestion des cookies', href: '/cookies' },
]

/**
 * Social Links
 */
const socialLinks = [
  { name: 'Discord', href: 'https://discord.gg/erosiondesames', Icon: DiscordIcon, label: 'Rejoindre notre Discord' },
  { name: 'Twitter', href: 'https://twitter.com/erosiondesames', Icon: TwitterIcon, label: 'Nous suivre sur X (Twitter)' },
  { name: 'GitHub', href: 'https://github.com/erosiondesames', Icon: GitHubIcon, label: 'Voir le projet sur GitHub' },
]

/**
 * Footer Component
 */
const Footer = ({ className = '', ...props }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`footer-tribal mt-auto ${className}`} {...props}>
      {/* Top border */}
      <FooterBorder />

      {/* Main content */}
      <div className="footer-content">
        <div className="container mx-auto px-4">
          <div className="footer-grid">
            {/* Logo column */}
            <div className="footer-column footer-logo-zone">
              <Link to="/" className="footer-logo">
                <LogoEmblem className="footer-logo-emblem" />
                <span className="footer-logo-text">Erosion des Ames</span>
              </Link>
              <p className="footer-tagline">
                La ou les ames s'erodent, les legendes naissent. Un jeu de role textuel
                dans un univers post-apocalyptique tribal.
              </p>
            </div>

            {/* Mobile divider */}
            <MobileDivider />

            {/* Navigation column */}
            <div className="footer-column">
              <h3 className="footer-heading">Navigation</h3>
              <ul className="footer-links">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile divider */}
            <MobileDivider />

            {/* Legal column */}
            <div className="footer-column">
              <h3 className="footer-heading">Informations</h3>
              <ul className="footer-links">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile divider */}
            <MobileDivider />

            {/* Social column */}
            <div className="footer-column">
              <h3 className="footer-heading">Communaute</h3>
              <div className="footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="social-icon"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-copyright">
        <div className="container mx-auto px-4">
          <p className="footer-copyright-text">
            Copyright &copy; {currentYear} Erosion des Ames &bull; Cree avec passion et cendres
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
export { Footer, FooterBorder }
