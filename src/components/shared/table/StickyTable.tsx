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
import { CustomPagination } from 'styles'

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
  const [rowsPerPage, setRowsPerPage] = React.useState(50)
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
    <>
    <div style={{ position: 'relative' }}>
      { loading && <Loading /> }
      <TableContainer style={{ paddingBottom: 50, overflowX: 'initial' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  style={{
                    backgroundColor: theme.background.secondary,
                    color: theme.text.primary,
                    minWidth: column.minWidth,
                    borderBottom: theme.border.secondary,
                    fontWeight: theme.font.weight,
                    fontSize: theme.responsive[device]?.text.tertiary,
                    padding: '11px 20px'
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
                .map((row) => {
                  return (
                    <TableRow onClick={() => { handleClick && handleClick(row.id) }} hover role='checkbox' tabIndex={-1} key={row.id} style={{ cursor: handleClick ? 'pointer' : 'default' }}>
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              color: theme.text.secondary,
                              minWidth: column.minWidth,
                              borderBottom: theme.border.quaternary,
                              fontSize: theme.responsive[device]?.text.quaternary,
                              fontWeight: theme.font.weight,
                              padding: '11px 20px'
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
    </>
  )
}
