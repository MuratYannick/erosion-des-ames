import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Button, Badge } from '@/components'
import { TribalDivider } from '@/components/ui/Card'
import { formatRelativeDate } from '@/utils/dateFormatter'
import './NewsSection.css'

/**
 * NewsSection - Section actualités/annonces
 *
 * Design "Chroniques des Ruines":
 * - Grille asymétrique (featured + grid)
 * - Cards avec icônes tribales pour types
 * - Badge "Nouveau" pour récentes
 * - Animations scroll-triggered
 * - Transition fluide depuis Présentation
 */
const NewsSection = ({
  title = "Chroniques des Ruines",
  subtitle = "Les dernières nouvelles du monde",
  newsItems = [],
  viewAllLink = "/news"
}) => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer pour animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Séparer la première (featured) des autres
  const [featuredNews, ...restNews] = newsItems.slice(0, 4)

  return (
    <section
      ref={sectionRef}
      className={`news-section relative w-full py-20 md:py-32 bg-surface overflow-hidden ${isVisible ? 'is-visible' : ''}`}
    >
      {/* Pattern tribal subtil */}
      <NewsTribalPattern />

      {/* Conteneur principal */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Header de section */}
        <div className="text-center mb-12 md:mb-16 news-header">
          <h2 className="font-heading text-4xl md:text-5xl text-primary-800 mb-4">
            {title}
          </h2>
          <p className="font-body text-lg text-primary-600 mb-6 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <TribalDivider
            variant="ornate"
            className="max-w-md mx-auto text-primary-300 h-6"
          />
        </div>

        {/* Grille asymétrique d'actualités */}
        <div className="news-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Featured news (2 colonnes) */}
          {featuredNews && (
            <div className="md:col-span-2 news-card-featured">
              <NewsCard
                news={featuredNews}
                featured={true}
              />
            </div>
          )}

          {/* Autres news (1 colonne chacune) */}
          {restNews.map((news, index) => (
            <div
              key={news.id}
              className="news-card-item"
              style={{ '--animation-delay': `${index * 100}ms` }}
            >
              <NewsCard news={news} />
            </div>
          ))}
        </div>

        {/* Call-to-action - Voir toutes les actualités */}
        <div className="text-center news-cta">
          <Link to={viewAllLink}>
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[220px]"
            >
              Voir toutes les chroniques
            </Button>
          </Link>
        </div>
      </div>

      {/* Transition gradient vers section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-neutral-100 pointer-events-none" />
    </section>
  )
}

/**
 * NewsCard - Card individuelle d'actualité
 */
const NewsCard = ({ news, featured = false }) => {
  const {
    id,
    type = 'update',
    title,
    excerpt,
    date,
    isNew = false,
    link = '#'
  } = news

  const typeConfig = {
    update: {
      icon: <UpdateIcon />,
      color: 'primary',
      label: 'Mise à jour',
      accentClass: 'border-l-primary-400'
    },
    event: {
      icon: <EventIcon />,
      color: 'secondary',
      label: 'Événement',
      accentClass: 'border-l-secondary-400'
    },
    announcement: {
      icon: <AnnouncementIcon />,
      color: 'warning',
      label: 'Annonce',
      accentClass: 'border-l-warning'
    }
  }

  const config = typeConfig[type] || typeConfig.update

  return (
    <Link to={link} className="block h-full">
      <Card
        variant="tribal"
        padding="none"
        hover={true}
        effects={['weathered']}
        animation="emerge"
        className={`news-card h-full border-l-4 ${config.accentClass} transition-all duration-normal hover:shadow-xl`}
      >
        <CardBody className="p-6 h-full flex flex-col">
          {/* Header: Type + Badge nouveau */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-primary-600">
              <span className="w-5 h-5 flex-shrink-0">
                {config.icon}
              </span>
              <span className="font-ui text-sm font-medium uppercase tracking-wide">
                {config.label}
              </span>
            </div>

            {isNew && (
              <Badge variant="error" size="sm" dot={true}>
                Nouveau
              </Badge>
            )}
          </div>

          {/* Titre */}
          <h3 className={`font-accent mb-3 text-primary-900 line-clamp-2 ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {title}
          </h3>

          {/* Extrait */}
          <p className={`font-body text-primary-700 leading-relaxed mb-4 flex-grow ${featured ? 'text-base md:text-lg line-clamp-3' : 'text-sm md:text-base line-clamp-2'}`}>
            {excerpt}
          </p>

          {/* Footer: Date */}
          <div className="flex items-center gap-2 pt-4 border-t border-primary-200">
            <TimeIcon className="w-4 h-4 text-primary-400" />
            <time className="font-ui text-sm text-primary-500" dateTime={date}>
              {formatDate(date)}
            </time>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}

/**
 * Icônes tribales pour types d'actualités
 */
const UpdateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <title>Mise à jour</title>
    {/* Pierre gravée - tablette */}
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" opacity="0.6" />
    {/* Marque tribale */}
    <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.3" />
  </svg>
)

const EventIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <title>Événement</title>
    {/* Flamme sacrée */}
    <path d="M12 2C12 2 8 6 8 10C8 13.31 10.69 16 14 16C14.34 16 14.67 15.97 15 15.91" />
    <path d="M16 10C16 10 14 12 14 14C14 15.66 15.34 17 17 17C18.66 17 20 15.66 20 14C20 12 18 10 18 10" opacity="0.6" />
    {/* Base - bûcher */}
    <path d="M6 20h12M8 20v2M16 20v2" />
  </svg>
)

const AnnouncementIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <title>Annonce importante</title>
    {/* Corne tribale / Mégaphone */}
    <path d="M3 11l18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" opacity="0.6" />
    {/* Cercles sonores */}
    <circle cx="21" cy="12" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="23" cy="12" r="0.5" fill="currentColor" opacity="0.3" />
  </svg>
)

const TimeIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

/**
 * Pattern tribal pour arrière-plan
 */
const NewsTribalPattern = () => (
  <svg
    className="news-pattern absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="news-tribal-pattern"
        x="0"
        y="0"
        width="180"
        height="180"
        patternUnits="userSpaceOnUse"
      >
        {/* Cercles rituels */}
        <circle cx="40" cy="40" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.15" />

        {/* Losanges */}
        <path
          d="M140 40 L150 50 L140 60 L130 50 Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.15"
        />

        {/* Traits rituels */}
        <line x1="90" y1="130" x2="90" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="80" y1="135" x2="80" y2="145" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <line x1="100" y1="135" x2="100" y2="145" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      </pattern>
    </defs>

    <rect
      width="100%"
      height="100%"
      fill="url(#news-tribal-pattern)"
      className="text-primary-200"
    />
  </svg>
)

/**
 * Utilitaire: Formatage de date (wrapper)
 */
const formatDate = (dateString) => formatRelativeDate(dateString)

export default NewsSection
