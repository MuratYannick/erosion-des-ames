import { forwardRef } from 'react'

const MenuBurgerButton = forwardRef(({
  isOpen = false,
  onClick,
  className = '',
  ariaLabel = 'Menu',
  ...props
}, ref) => {
  const barBase = [
    'block absolute h-0.5 w-6 bg-current',
    'transform transition-all duration-normal ease-tribal'
  ].join(' ')

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={[
        'relative w-8 h-8 flex items-center justify-center',
        'text-primary hover:text-secondary',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md',
        'transition-colors duration-fast ease-organic',
        className
      ].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      {...props}
    >
      <span className="sr-only">{isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>

      <span className="relative w-6 h-5">
        {/* Barre du haut */}
        <span
          className={[
            barBase,
            isOpen
              ? 'rotate-45 top-2'
              : 'rotate-0 top-0'
          ].join(' ')}
        />

        {/* Barre du milieu */}
        <span
          className={[
            barBase,
            'top-2',
            isOpen
              ? 'opacity-0 scale-x-0'
              : 'opacity-100 scale-x-100'
          ].join(' ')}
        />

        {/* Barre du bas */}
        <span
          className={[
            barBase,
            isOpen
              ? '-rotate-45 top-2'
              : 'rotate-0 top-4'
          ].join(' ')}
        />
      </span>
    </button>
  )
})

MenuBurgerButton.displayName = 'MenuBurgerButton'

export default MenuBurgerButton
