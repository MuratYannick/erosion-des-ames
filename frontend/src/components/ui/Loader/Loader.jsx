import { forwardRef } from 'react'
import './Loader.css'

const loaderSizes = {
  sm: { spinner: 24, dots: { w: 40, h: 16 }, bars: { w: 32, h: 20 } },
  md: { spinner: 48, dots: { w: 60, h: 24 }, bars: { w: 50, h: 32 } },
  lg: { spinner: 72, dots: { w: 90, h: 36 }, bars: { w: 75, h: 48 } }
}

/**
 * Soul Vortex Spinner - Spiraling energy with concentric circles
 */
const SoulVortex = ({ size = 'md', className = '' }) => {
  const s = loaderSizes[size]?.spinner || loaderSizes.md.spinner

  return (
    <svg
      className={className}
      width={s}
      height={s}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chargement en cours"
    >
      {/* Outer ritual circle (slow rotation) */}
      <g className="loader-vortex-outer">
        <circle
          cx="24"
          cy="24"
          r="20"
          strokeWidth="1.5"
          strokeDasharray="8 4"
          opacity="0.4"
        />
        {/* Cardinal marks */}
        <line x1="24" y1="2" x2="24" y2="6" strokeWidth="2" />
        <line x1="24" y1="42" x2="24" y2="46" strokeWidth="2" />
        <line x1="2" y1="24" x2="6" y2="24" strokeWidth="2" />
        <line x1="42" y1="24" x2="46" y2="24" strokeWidth="2" />
      </g>

      {/* Middle torn circle (medium rotation) */}
      <g className="loader-vortex-middle">
        <circle
          cx="24"
          cy="24"
          r="14"
          strokeWidth="2"
          strokeDasharray="18 8"
          opacity="0.6"
        />
      </g>

      {/* Inner energy spiral (fast rotation) */}
      <g className="loader-vortex-inner">
        <path
          d="M 24 10 Q 34 14, 34 24 Q 34 34, 24 38 Q 14 34, 14 24 Q 14 18, 18 14"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
          fill="none"
        />
      </g>

      {/* Center pulse */}
      <circle
        cx="24"
        cy="24"
        r="2"
        fill="currentColor"
        className="loader-vortex-pulse"
      />
    </svg>
  )
}

/**
 * Heartbeat Dots - Three ember shapes pulsing in sequence
 */
const HeartbeatDots = ({ size = 'md', className = '' }) => {
  const s = loaderSizes[size]?.dots || loaderSizes.md.dots

  return (
    <svg
      className={className}
      width={s.w}
      height={s.h}
      viewBox="0 0 60 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chargement en cours"
    >
      {/* Three ember triangles */}
      <g className="loader-ember loader-ember-1">
        <path d="M 10 18 L 6 22 L 14 22 Z" opacity="0.7" />
        <path d="M 10 12 L 8 16 L 12 16 Z" opacity="0.9" />
      </g>

      <g className="loader-ember loader-ember-2">
        <path d="M 30 18 L 26 22 L 34 22 Z" opacity="0.7" />
        <path d="M 30 12 L 28 16 L 32 16 Z" opacity="0.9" />
      </g>

      <g className="loader-ember loader-ember-3">
        <path d="M 50 18 L 46 22 L 54 22 Z" opacity="0.7" />
        <path d="M 50 12 L 48 16 L 52 16 Z" opacity="0.9" />
      </g>
    </svg>
  )
}

/**
 * Ritual Chant Bars - Five oscillating bars like sound waves
 */
const RitualChantBars = ({ size = 'md', className = '' }) => {
  const s = loaderSizes[size]?.bars || loaderSizes.md.bars

  return (
    <svg
      className={className}
      width={s.w}
      height={s.h}
      viewBox="0 0 50 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chargement en cours"
    >
      {/* Five bars with varying heights */}
      <rect className="loader-bar loader-bar-1" x="2" y="20" width="6" height="12" rx="1" />
      <rect className="loader-bar loader-bar-2" x="12" y="12" width="6" height="20" rx="1" />
      <rect className="loader-bar loader-bar-3" x="22" y="6" width="6" height="26" rx="1" />
      <rect className="loader-bar loader-bar-4" x="32" y="12" width="6" height="20" rx="1" />
      <rect className="loader-bar loader-bar-5" x="42" y="20" width="6" height="12" rx="1" />

      {/* Jagged tops for weathered effect */}
      <path
        d="M 2 20 L 3 18 L 5 19 L 7 18 L 8 20
           M 12 12 L 13 10 L 15 11 L 17 10 L 18 12
           M 22 6 L 23 4 L 25 5 L 27 4 L 28 6
           M 32 12 L 33 10 L 35 11 L 37 10 L 38 12
           M 42 20 L 43 18 L 45 19 L 47 18 L 48 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

/**
 * Corner Altar Stone - Decorative corner for fullscreen overlay
 */
const AltarStone = ({ position }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]'
  }

  return (
    <svg
      className={`absolute ${positionClasses[position]} w-12 h-12 pointer-events-none text-primary-400`}
      viewBox="0 0 24 24"
      fill="currentColor"
      opacity="0.25"
      aria-hidden="true"
    >
      <path d="M 0 0 L 12 0 L 0 12 Z" />
      <line x1="4" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  )
}

/**
 * Floating Ash Particles
 */
const AshParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="loader-ash absolute w-0.5 h-0.5 bg-primary-300 rounded-full opacity-30"
        style={{
          left: `${15 + i * 18}%`,
          bottom: '10%'
        }}
      />
    ))}
  </div>
)

const loaderComponents = {
  spinner: SoulVortex,
  dots: HeartbeatDots,
  bars: RitualChantBars
}

const Loader = forwardRef(({
  variant = 'spinner',
  size = 'md',
  fullscreen = false,
  text,
  showAura = false,
  showAsh = false,
  className = '',
  ...props
}, ref) => {
  const LoaderComponent = loaderComponents[variant] || loaderComponents.spinner

  const loaderElement = (
    <div className="relative flex flex-col items-center gap-4">
      {/* Aura effect behind loader */}
      {showAura && (
        <div
          className="loader-aura absolute w-32 h-32 border-2 border-current rounded-full opacity-10"
          aria-hidden="true"
        />
      )}

      {/* Main loader */}
      <LoaderComponent size={size} className={`text-primary-500 ${className}`} />

      {/* Loading text */}
      {text && (
        <p className="loader-text font-display text-sm text-primary-400 uppercase tracking-wider">
          {text}
        </p>
      )}
    </div>
  )

  // Fullscreen overlay mode
  if (fullscreen) {
    return (
      <div
        ref={ref}
        className="loader-overlay fixed inset-0 z-[9999] flex items-center justify-center"
        role="alert"
        aria-busy="true"
        aria-live="polite"
        {...props}
      >
        {/* Corner altar stones */}
        <AltarStone position="top-left" />
        <AltarStone position="top-right" />
        <AltarStone position="bottom-left" />
        <AltarStone position="bottom-right" />

        {/* Ash particles */}
        {showAsh && <AshParticles />}

        {/* Centered loader */}
        <div className="loader-overlay-content">
          {loaderElement}
        </div>
      </div>
    )
  }

  // Inline mode
  return (
    <div
      ref={ref}
      className="inline-flex items-center justify-center"
      role="status"
      aria-busy="true"
      {...props}
    >
      {loaderElement}
    </div>
  )
})

Loader.displayName = 'Loader'

export default Loader
export { Loader, SoulVortex, HeartbeatDots, RitualChantBars }
