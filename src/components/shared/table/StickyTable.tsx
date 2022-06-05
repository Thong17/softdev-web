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

export interface ITableColumn<Column> {
  id: Column
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => any
}

interface ITable {
  columns: ITableColumn<string>[],
  rows: any[],
  loading?: boolean,
  handleClick?: (id) => void
}

export const StickyTable = ({ columns, rows, loading, handleClick }: ITable) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const { theme } = useTheme()
  const { device } = useWeb()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <CustomTableContainer styled={theme} device={device}>
    <div className='table-container'>
      { loading && <Loading /> }
      <TableContainer className='table'>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                  }}
                  key={column.id}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          { !loading &&
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow onClick={() => { handleClick && handleClick(row.id) }} hover role='checkbox' tabIndex={-1} key={row.id || index} style={{ cursor: handleClick ? 'pointer' : 'default' }}>
                      {columns.map((column) => {
                        let value = row[column.id]
                        if (typeof value === 'boolean') {
                          value = value ? (
                            <span style={{ color: theme.color.success }}>Enabled</span>
                          ) : (
                            <span style={{ color: theme.color.error }}>Disabled</span>
                          )
                        }
                        
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                            }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
                            }
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
            </TableBody>
          }
        </Table>
      </TableContainer>
    </div>
    { !loading && 
        <CustomPagination styled={theme}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CustomPagination>
      }
    </CustomTableContainer>
  )
}
