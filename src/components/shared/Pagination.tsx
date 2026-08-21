import useTheme from 'hooks/useTheme'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

interface IPagination {
  page: number
  limit: number
  totalCount: number
  onChange: (page: number) => void
}

const SIBLINGS = 1

// Builds a 1-indexed page list with 'ellipsis' markers for skipped ranges,
// e.g. totalPages=9, current=1 -> [1,2,3,'ellipsis',9] rendered as 1 2 3 … 9.
const buildPageList = (current: number, totalPages: number): (number | 'ellipsis')[] => {
  const list: (number | 'ellipsis')[] = []
  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages
    const isNeighbor = i >= current - SIBLINGS && i <= current + SIBLINGS
    if (isEdge || isNeighbor) {
      list.push(i)
    } else if (list[list.length - 1] !== 'ellipsis') {
      list.push('ellipsis')
    }
  }
  return list
}

export const Pagination = ({ page, limit, totalCount, onChange }: IPagination) => {
  const { theme } = useTheme()
  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  if (totalPages <= 1) return null

  const current = page + 1
  const pageList = buildPageList(current, totalPages)

  const arrowStyle = (disabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: theme.radius.rounded,
    border: 'none',
    background: 'transparent',
    color: disabled ? theme.text.quaternary : theme.text.primary,
    cursor: disabled ? 'default' : 'pointer',
  })

  const pageButtonStyle = (active: boolean) => ({
    minWidth: 32,
    height: 32,
    borderRadius: theme.radius.rounded,
    border: 'none',
    background: active ? theme.color.info : 'transparent',
    color: active ? theme.background.secondary : theme.text.primary,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 400,
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '24px 0' }}>
      <button
        style={arrowStyle(page <= 0)}
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeftRoundedIcon fontSize='small' />
      </button>
      {pageList.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} style={{ width: 32, textAlign: 'center', color: theme.text.tertiary }}>
            …
          </span>
        ) : (
          <button
            key={item}
            style={pageButtonStyle(item === current)}
            onClick={() => onChange(item - 1)}
          >
            {item}
          </button>
        )
      )}
      <button
        style={arrowStyle(page >= totalPages - 1)}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRightRoundedIcon fontSize='small' />
      </button>
    </div>
  )
}
