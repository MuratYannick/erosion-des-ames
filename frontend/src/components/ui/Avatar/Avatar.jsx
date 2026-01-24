import { forwardRef, useState } from 'react'
import './Avatar.css'

const avatarSizes = {
  xs: 'w-6 h-6 text-xs avatar-xs',
  sm: 'w-8 h-8 text-sm avatar-sm',
  md: 'w-10 h-10 text-base avatar-md',
  lg: 'w-12 h-12 text-lg avatar-lg',
  xl: 'w-16 h-16 text-xl avatar-xl'
}

const avatarShapes = {
  circle: 'rounded-full',
  square: 'rounded-stone'
}

/**
 * Default tribal user icon
 */
const DefaultUserIcon = () => (
  <svg
    width="60%"
    height="60%"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Head - circular with tribal mark */}
    <circle cx="12" cy="8" r="4" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.3" />
    {/* Body - tribal robe shape */}
    <path d="M4 21 Q4 14, 12 14 Q20 14, 20 21" />
    {/* Small tribal marks */}
    <path d="M8 18 L8 20 M16 18 L16 20" strokeWidth="1.5" opacity="0.5" />
  </svg>
)

/**
 * Get initials from name
 */
const getInitials = (name) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const Avatar = forwardRef(({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
  status,
  ring = false,
  className = '',
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false)

  const showFallback = !src || imageError
  const initials = getInitials(name || alt)

  const classes = [
    'avatar avatar-frame',
    avatarSizes[size] || avatarSizes.md,
    avatarShapes[shape] || avatarShapes.circle,
    ring && 'avatar-ring',
    className
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} {...props}>
      {!showFallback ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="avatar-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="avatar-fallback">
          {initials ? initials : <DefaultUserIcon />}
        </div>
      )}

      {status && (
        <span
          className={`avatar-status avatar-status-${status}`}
          aria-label={`Statut: ${status}`}
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

/**
 * Avatar Group - Stack multiple avatars
 */
const AvatarGroup = forwardRef(({
  children,
  max = 4,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const childArray = Array.isArray(children) ? children : [children]
  const visibleChildren = childArray.slice(0, max)
  const remainingCount = childArray.length - max

  return (
    <div ref={ref} className={`avatar-group ${className}`} {...props}>
      {remainingCount > 0 && (
        <Avatar
          size={size}
          name={`+${remainingCount}`}
          aria-label={`${remainingCount} autres utilisateurs`}
        />
      )}
      {visibleChildren.reverse().map((child, index) => (
        <div key={index}>
          {child}
        </div>
      ))}
    </div>
  )
})

AvatarGroup.displayName = 'AvatarGroup'

export default Avatar
export { Avatar, AvatarGroup, DefaultUserIcon }
