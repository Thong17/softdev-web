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
import Loading from '../Loading'
import { CustomPagination, CustomTableContainer } from 'styles'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import { IconButton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import { ITableColumn } from './StickyTable'

interface IExpandableTable {
  backgroundColor?: string
  pagination?: boolean
  columns: ITableColumn<string>[]
  rows: any[]
  count?: number
  skip?: number
  limit?: number
  loading?: boolean
  handleClick?: (id) => void
  onToggleStatus?: (id) => void
  setQuery?: (id) => void
  style?: React.CSSProperties
  expandedRowIds?: any[]
  renderRowDetail?: (row: any) => React.ReactNode
}

export const ExpandableTable = ({
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
  expandedRowIds = [],
  renderRowDetail,
}: IExpandableTable) => {
  const [page, setPage] = React.useState(skip || 0)
  const [rowsPerPage, setRowsPerPage] = React.useState(limit || 10)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const hasRowDetails = Boolean(renderRowDetail)

  React.useEffect(() => {
    setPage(skip)
  }, [skip])
  
  React.useEffect(() => {
    setRowsPerPage(limit)
  }, [limit])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setQuery?.({ page: newPage })
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const limit = event.target.value
    setRowsPerPage(+limit)
    setPage(0)
    setQuery?.({ limit })
  }
  
  return (
    <CustomTableContainer color={backgroundColor} styled={theme} device={device} style={style}>
      {loading && <Loading />}
      <div className='table-container'>
        <TableContainer className='table'>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {hasRowDetails && (
                  <TableCell
                    style={{ width: 40, maxWidth: 40, padding: '0 8px' }}
                    key='expand-toggle'
                    align='center'
                  />
                )}
                {columns.map((column) => (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
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
              !loading && pagination ? (
                <TableBody>
                  {rows
                    .slice(0, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <>
                          <TableRow
                            onClick={() => {
                              handleClick?.(row.id)
                            }}
                            hover
                            role='checkbox'
                            tabIndex={-1}
                            key={row.id || index}
                            style={{
                              cursor: handleClick ? 'pointer' : 'default',
                            }}
                          >
                            {hasRowDetails && (
                              <TableCell style={{ width: 40, maxWidth: 40, padding: '0 8px' }}>
                                <IconButton
                                  size='small'
                                  style={{ color: theme.text.secondary }}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    handleClick?.(row.id)
                                  }}
                                >
                                  {expandedRowIds?.includes(row.id) ? (
                                    <KeyboardArrowUpRoundedIcon fontSize='small' />
                                  ) : (
                                    <KeyboardArrowDownRoundedIcon fontSize='small' />
                                  )}
                                </IconButton>
                              </TableCell>
                            )}
                            {columns.map((column) => {
                              let value = row[column.id]
                              if (typeof value === 'boolean') {
                                value = value ? (
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onToggleStatus?.(row.id)
                                    }}
                                    size='small'
                                    style={{ color: theme.color.success }}
                                  >
                                    <ToggleOnIcon style={{ fontSize: 30 }} />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onToggleStatus?.(row.id)
                                    }}
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
                          {renderRowDetail && expandedRowIds?.includes(row.id) && (
                            <TableRow key={`${row.id}-detail`}>
                              <TableCell colSpan={columns.length + (hasRowDetails ? 1 : 0)} style={{ padding: 0 }}>
                                <div style={{ paddingLeft: 64, paddingTop: 8, paddingBottom: 8 }}>
                                  {renderRowDetail(row)}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                </TableBody>
              ) : (
                !loading && <TableBody>
                  {rows.map((row, index) => {
                    return (
                      <>
                        <TableRow
                          onClick={() => {
                            handleClick?.(row.id)
                          }}
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={row.id || index}
                          style={{ cursor: handleClick ? 'pointer' : 'default' }}
                        >
                          {hasRowDetails && (
                            <TableCell style={{ width: 40, maxWidth: 40, padding: '0 8px' }}>
                              <IconButton
                                size='small'
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleClick?.(row.id)
                                }}
                              >
                                {expandedRowIds?.includes(row.id) ? (
                                  <KeyboardArrowUpRoundedIcon fontSize='small' />
                                ) : (
                                  <KeyboardArrowDownRoundedIcon fontSize='small' />
                                )}
                              </IconButton>
                            </TableCell>
                          )}
                          {columns.map((column) => {
                            let value = row[column.id]
                            if (typeof value === 'boolean') {
                              value = value ? (
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    onToggleStatus?.(row.id)
                                  }}
                                  size='small'
                                  style={{ color: theme.color.success }}
                                >
                                  <ToggleOnIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    onToggleStatus?.(row.id)
                                  }}
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
                        {renderRowDetail && expandedRowIds?.includes(row.id) && (
                          <TableRow key={`${row.id}-detail`}>
                            <TableCell colSpan={columns.length + (hasRowDetails ? 1 : 0)} style={{ padding: 0 }}>
                              <div style={{ paddingLeft: 64, paddingTop: 8, paddingBottom: 8 }}>
                                {renderRowDetail(row)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })}
                </TableBody>
              )
            )}
          </Table>
        </TableContainer>
      </div>
      {!loading && pagination && (
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
