import { forwardRef, useMemo } from 'react'

/**
 * Navigation arrow icons
 */
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6 L15 12 L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronsLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M11 6 L5 12 L11 18 M19 6 L13 12 L19 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronsRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 6 L11 12 L5 18 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Ellipsis tribal dots
 */
const Ellipsis = () => (
  <span className="flex items-center justify-center w-8 h-8 text-neutral-400" aria-hidden="true">
    <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor">
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="8" cy="2" r="1.5" />
      <circle cx="14" cy="2" r="1.5" />
    </svg>
  </span>
)

const baseButtonClass = [
  'inline-flex items-center justify-center',
  'w-8 h-8 rounded-md',
  'font-ui text-sm',
  'transition-all duration-fast ease-organic',
  'focus:outline-none focus:ring-2 focus:ring-primary/30'
].join(' ')

const activeButtonClass = [
  'bg-primary text-white border-2 border-primary-600',
  'shadow-inner'
].join(' ')

const inactiveButtonClass = [
  'bg-surface text-primary-700 border-2 border-neutral-200',
  'hover:bg-primary-50 hover:border-primary-300'
].join(' ')

const disabledButtonClass = [
  'opacity-40 cursor-not-allowed pointer-events-none'
].join(' ')

/**
 * Generate page numbers with ellipsis
 */
const generatePages = (currentPage, totalPages, siblingCount = 1) => {
  const totalNumbers = siblingCount * 2 + 5 // siblings + first + last + current + 2 ellipsis

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)
    return [1, 'ellipsis', ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  )
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}

const Pagination = forwardRef(({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showInfo = false,
  siblingCount = 1,
  className = '',
  ...props
}, ref) => {
  const pages = useMemo(
    () => generatePages(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  )

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  if (totalPages <= 1) return null

  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      {/* First page */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className={[
            baseButtonClass,
            inactiveButtonClass,
            !canGoPrevious && disabledButtonClass
          ].join(' ')}
          aria-label="Première page"
        >
          <ChevronsLeftIcon />
        </button>
      )}

      {/* Previous page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={[
          baseButtonClass,
          inactiveButtonClass,
          !canGoPrevious && disabledButtonClass
        ].join(' ')}
        aria-label="Page précédente"
      >
        <ChevronLeftIcon />
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return <Ellipsis key={`ellipsis-${index}`} />
        }

        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={[
              baseButtonClass,
              isActive ? activeButtonClass : inactiveButtonClass
            ].join(' ')}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      })}

      {/* Next page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={[
          baseButtonClass,
          inactiveButtonClass,
          !canGoNext && disabledButtonClass
        ].join(' ')}
        aria-label="Page suivante"
      >
        <ChevronRightIcon />
      </button>

      {/* Last page */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className={[
            baseButtonClass,
            inactiveButtonClass,
            !canGoNext && disabledButtonClass
          ].join(' ')}
          aria-label="Dernière page"
        >
          <ChevronsRightIcon />
        </button>
      )}

      {/* Info text */}
      {showInfo && (
        <span className="ml-4 text-sm font-ui text-neutral-500">
          Page {currentPage} sur {totalPages}
        </span>
      )}
    </nav>
  )
})

Pagination.displayName = 'Pagination'

export default Pagination
export { Pagination }
