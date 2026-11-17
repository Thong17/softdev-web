import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomPagination, CustomTableContainer } from 'styles'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { CircularProgress, IconButton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'

export interface ITableColumn<Column> {
  id: Column
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => any
  // Keeps the header on one line; the column grows to fit it
  noWrap?: boolean
}

interface ITable {
  backgroundColor?: string
  pagination?: Boolean
  columns: ITableColumn<string>[]
  rows: any[]
  count?: number
  skip?: number
  limit?: number
  loading?: boolean
  handleClick?: (id) => void
  onToggleStatus?: (id: string | number, columnKey?: string) => void
  setQuery?: (id) => void
  style?: React.CSSProperties
}

export const StickyTable = ({
  backgroundColor = 'primary',
  pagination = true,
  columns,
  rows,
  count,
  skip = 0,
  limit = 10,
  loading,
  handleClick,
  onToggleStatus,
  setQuery,
  style,
}: ITable) => {
  const [page, setPage] = React.useState(skip || 0)
  const [rowsPerPage, setRowsPerPage] = React.useState(limit || 10)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()

  React.useEffect(() => {
    setPage(skip)
  }, [skip])
  
  React.useEffect(() => {
    setRowsPerPage(limit)
  }, [limit])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setQuery && setQuery({ page: newPage })
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const limit = event.target.value
    setRowsPerPage(+limit)
    setPage(0)
    setQuery && setQuery({ limit })
  }
  
  // While reloading, keep the header, rows and page controls in place and only dim the rows
  const bodyStyle: React.CSSProperties = {
    opacity: loading ? 0.4 : 1,
    pointerEvents: loading ? 'none' : undefined,
    transition: 'opacity 0.15s',
  }

  return (
    <CustomTableContainer color={backgroundColor} styled={theme} device={device} style={style}>
      {/* The bottom space is room for the page controls; none without them */}
      <div className='table-container' style={pagination ? undefined : { paddingBottom: 0 }}>
        <TableContainer className='table'>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      whiteSpace: column.noWrap ? 'nowrap' : undefined,
                    }}
                    key={column.id}
                    align={column.align}
                  >
                    {language[column.label] || column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {rows?.length > 0 && (
              pagination ? (
                <TableBody style={bodyStyle}>
                  {rows
                    .slice(0, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          onClick={() => {
                            handleClick && handleClick(row.id)
                          }}
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={row.id || index}
                          data-value={row._dataValue}
                          data-id={row._dataId}
                          style={{
                            cursor: handleClick ? 'pointer' : 'default',
                          }}
                        >
                          {columns.map((column) => {
                            let value = row[column.id]
                            if (typeof value === 'boolean') {
                              value = value ? (
                                <IconButton
                                  onClick={() => onToggleStatus && onToggleStatus(row.id, column.id)}
                                  size='small'
                                  style={{ color: theme.color.success }}
                                >
                                  <ToggleOnIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() => onToggleStatus && onToggleStatus(row.id, column.id)}
                                  size='small'
                                  style={{ color: theme.color.error }}
                                >
                                  <ToggleOffIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              )
                            }

                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                  minWidth: column.minWidth,
                                  maxWidth: column.maxWidth,
                                }}
                              >
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              ) : (
                <TableBody style={bodyStyle}>
                  {rows.map((row, index) => {
                    return (
                      <TableRow
                        onClick={() => {
                          handleClick && handleClick(row.id)
                        }}
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.id || index}
                        data-value={row._dataValue}
                        data-id={row._dataId}
                        style={{ cursor: handleClick ? 'pointer' : 'default' }}
                      >
                        {columns.map((column) => {
                          let value = row[column.id]
                          if (typeof value === 'boolean') {
                            value = value ? (
                              <IconButton
                                onClick={() => onToggleStatus && onToggleStatus(row.id, column.id)}
                                size='small'
                                style={{ color: theme.color.success }}
                              >
                                <ToggleOnIcon style={{ fontSize: 30 }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => onToggleStatus && onToggleStatus(row.id, column.id)}
                                size='small'
                                style={{ color: theme.color.error }}
                              >
                                <ToggleOffIcon style={{ fontSize: 30 }} />
                              </IconButton>
                            )
                          }

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                              }}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              )
            )}
            {/* Nothing to dim yet (first load or an empty result), so show a spinner under the header */}
            {loading && !(rows?.length > 0) && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} align='center' style={{ borderBottom: 0, padding: 40 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
      {/* Kept while reloading; hidden only on a first load, when there is no count yet */}
      {pagination && !(loading && !(rows?.length > 0)) && (
        <CustomPagination styled={theme}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component='div'
            count={count || rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CustomPagination>
      )}
    </CustomTableContainer>
  )
}