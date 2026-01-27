/**
 * TextBlock - Container pour texte long avec typographie optimisée
 * Support drop caps et style manuscrit tribal
 */

import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import './TextBlock.css'

const TextBlock = forwardRef(({
  children,
  dropCap = false,
  columns = 1,
  variant = 'default',
  maxWidth = 'prose',
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        text-block
        text-block--${variant}
        text-block--cols-${columns}
        text-block--${maxWidth}
        ${dropCap ? 'text-block--drop-cap' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
})

TextBlock.displayName = 'TextBlock'

TextBlock.propTypes = {
  /** Contenu texte (paragraphes, listes, etc.) */
  children: PropTypes.node.isRequired,
  /** Activer la lettrine sur le premier paragraphe */
  dropCap: PropTypes.bool,
  /** Nombre de colonnes (1-3) */
  columns: PropTypes.oneOf([1, 2, 3]),
  /** Variante de style */
  variant: PropTypes.oneOf(['default', 'manuscript', 'quote', 'lore']),
  /** Largeur maximale */
  maxWidth: PropTypes.oneOf(['prose', 'wide', 'full']),
  /** Classes CSS additionnelles */
  className: PropTypes.string
}

/**
 * Paragraphe stylisé pour TextBlock
 */
export const Paragraph = forwardRef(({
  children,
  lead = false,
  className = '',
  ...props
}, ref) => (
  <p
    ref={ref}
    className={`text-block__paragraph ${lead ? 'text-block__paragraph--lead' : ''} ${className}`}
    {...props}
  >
    {children}
  </p>
))

Paragraph.displayName = 'Paragraph'

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
  /** Style "lead" pour paragraphe d'introduction */
  lead: PropTypes.bool,
  className: PropTypes.string
}

/**
 * Citation en bloc stylisée
 */
export const BlockQuote = forwardRef(({
  children,
  author,
  source,
  className = '',
  ...props
}, ref) => (
  <blockquote
    ref={ref}
    className={`text-block__quote ${className}`}
    {...props}
  >
    <p className="text-block__quote-text">{children}</p>
    {(author || source) && (
      <footer className="text-block__quote-footer">
        {author && <cite className="text-block__quote-author">{author}</cite>}
        {source && <span className="text-block__quote-source">{source}</span>}
      </footer>
    )}
  </blockquote>
))

BlockQuote.displayName = 'BlockQuote'

BlockQuote.propTypes = {
  children: PropTypes.node.isRequired,
  author: PropTypes.string,
  source: PropTypes.string,
  className: PropTypes.string
}

/**
 * Liste stylisée avec puces tribales
 */
export const TribalList = forwardRef(({
  children,
  ordered = false,
  className = '',
  ...props
}, ref) => {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag
      ref={ref}
      className={`text-block__list ${ordered ? 'text-block__list--ordered' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
})

TribalList.displayName = 'TribalList'

TribalList.propTypes = {
  children: PropTypes.node.isRequired,
  ordered: PropTypes.bool,
  className: PropTypes.string
}

export default TextBlock
