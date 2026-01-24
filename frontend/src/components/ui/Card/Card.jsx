import { forwardRef } from 'react'
import './Card.css'

const cardVariants = {
  default: 'bg-surface',
  bordered: 'bg-surface border-2 border-neutral-200',
  elevated: 'bg-surface shadow-lg',
  tribal: 'card-variant-tribal',
  fire: 'card-variant-fire',
  rusted: 'card-variant-rusted',
  ancient: 'card-variant-ancient'
}

const cardPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

const cardEffects = {
  dust: 'card-effect-dust',
  weathered: 'card-effect-weathered',
  crack: 'card-effect-crack'
}

const cardAnimations = {
  emerge: 'card-animate-emerge',
  flicker: 'card-animate-flicker',
  settle: 'card-animate-settle'
}

const Card = forwardRef(({
  children,
  variant = 'bordered',
  padding = 'none',
  hover = false,
  effects = [],
  animation = null,
  className = '',
  ...props
}, ref) => {
  const effectClasses = effects
    .map(effect => cardEffects[effect])
    .filter(Boolean)
    .join(' ')

  const animationClass = animation ? cardAnimations[animation] || '' : ''

  const classes = [
    'rounded-stone overflow-hidden',
    cardVariants[variant] || cardVariants.bordered,
    cardPadding[padding] || '',
    hover && 'transition-all duration-normal ease-organic hover:shadow-lg hover:-translate-y-0.5',
    effectClasses,
    animationClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

const CardHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={[
        'px-4 py-3 border-b border-neutral-200 card-content-layer',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

const CardBody = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={[
        'p-4 card-content-layer',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
})

CardBody.displayName = 'CardBody'

const CardFooter = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={[
        'px-4 py-3 border-t border-neutral-200 bg-neutral-50 card-content-layer',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

export default Card
export { Card, CardHeader, CardBody, CardFooter }
