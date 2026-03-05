import { Helmet } from 'react-helmet-async'

/**
 * Composant SEO — injecte les balises <title>, <meta description> et Open Graph
 * dans le <head> via react-helmet-async.
 *
 * @param {string}  title       - Titre de la page (sans le nom du site)
 * @param {string}  description - Description de la page pour les moteurs de recherche
 * @param {string}  image       - URL absolue de l'image Open Graph
 * @param {string}  url         - URL canonique de la page
 * @param {string}  type        - Type Open Graph (défaut : 'website')
 *
 * @example
 * <SEO title="Forum" description="Discussions de la communauté Erosion des Âmes" />
 */
const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteName = 'Erosion des Âmes'
  const fullTitle = title ? `${title} - ${siteName}` : siteName
  const defaultDescription =
    'Erosion des Âmes — forum de jeu de rôle dark fantasy tribale. Rejoignez la communauté, créez votre personnage et explorez un monde de cendres et de désolation.'

  return (
    <Helmet>
      {/* Titre */}
      <title>{fullTitle}</title>

      {/* Meta description */}
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}

export default SEO
