import useTheme from 'hooks/useTheme'

interface IPagination {
  page: number
  limit: number
  totalCount: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, limit, totalCount, onChange }: IPagination) => {
  const { theme } = useTheme()
  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  if (totalPages <= 1) return null

  const buttonStyle = (disabled: boolean) => ({
    border: 'none',
    background: 'transparent',
    color: disabled ? theme.text.quaternary : theme.text.primary,
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 14,
    padding: '6px 12px',
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 0' }}>
      <button
        style={buttonStyle(page <= 0)}
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        ‹ Prev
      </button>
      <span style={{ fontSize: 13, color: theme.text.tertiary }}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        style={buttonStyle(page >= totalPages - 1)}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next ›
      </button>
    </div>
  )
}
