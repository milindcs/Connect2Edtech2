import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react'

// Shared table toolbar: search input + pagination controls + CSV export.
// Used by AdminCourses, AdminContacts, AdminEnrollments, AdminMentorApplications.
function TableControls({
  searchValue = '',
  onSearchChange,
  page = 1,
  pages = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  loading = false,
  exportData = null,
  exportFilename = 'export',
}) {
  const canPrev = page > 1
  const canNext = page < pages

  const handleExport = () => {
    if (!exportData || exportData.length === 0) return

    const headers = Object.keys(exportData[0])
    const escape = (v) => {
      const s = v == null ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const rows = exportData.map((row) => headers.map((h) => escape(row[h])).join(','))
    const csv = [headers.join(','), ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${exportFilename}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-lg border border-black/10 text-xs sm:text-sm focus:outline-none focus:border-accent disabled:cursor-not-allowed"
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-1 text-xs text-gray-muted">
        {exportData && exportData.length > 0 && (
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-1 rounded-full border border-black/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-gray-muted hover:text-black hover:border-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Export CSV"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Export
          </button>
        )}

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={loading}
          className="rounded border border-black/10 px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-semibold focus:outline-none focus:border-accent disabled:cursor-not-allowed"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <span className="text-[10px] sm:text-xs">
          Page {page} of {pages || 1}
        </span>

        <button
          onClick={() => onPageChange(canPrev ? page - 1 : page)}
          disabled={!canPrev || loading}
          className="p-1 rounded hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onPageChange(canNext ? page + 1 : page)}
          disabled={!canNext || loading}
          className="p-1 rounded hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}

export default TableControls

