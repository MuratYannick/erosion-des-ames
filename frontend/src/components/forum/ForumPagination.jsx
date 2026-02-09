import Pagination from '@/components/ui/Pagination/Pagination'

const ForumPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = 'messages',
  className = '',
}) => {
  if (totalPages <= 1) return null

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
    >
      {totalItems !== undefined && (
        <span className="font-ui text-sm text-skin-muted">
          {totalItems} {itemLabel} · Page {currentPage} sur {totalPages}
        </span>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showFirstLast
      />
    </div>
  )
}

ForumPagination.displayName = 'ForumPagination'
export default ForumPagination
