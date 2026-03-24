import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { ITableColumn } from './StickyTable'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import { Box } from '@mui/material'

interface ITable {
  columns: ITableColumn<string>[]
  rows: any[]
  font?: string
  tableSpaceHeight?: number
}

export const InvoiceTable = ({
  columns,
  rows,
  tableSpaceHeight = 70
}: ITable) => {
  const { language } = useLanguage()
  const { theme } = useTheme()
  return (
    <div className='table-container' style={{ position: 'relative' }}>
      <TableContainer className='table'>
        <Box style={{ lineHeight: 0 }}>{'-'.repeat(300)}</Box>
        <Box style={{ lineHeight: 0, position: 'absolute', top: '30px' }}>{'-'.repeat(300)}</Box>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    fontWeight: 500,
                    backgroundColor: 'inherit',
                    color: theme.text.secondary,
                    textTransform: 'none',
                    border: 'none',
                    lineHeight: 0,
                    padding: '18px 0 13px 0'
                  }}
                  key={column.id}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {rows?.length > 0 && (
            <TableBody>
              {rows
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.id || index}
                    >
                      {columns.map((column) => {
                        let value = row[column.id]
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              padding: '5px 5px',
                              borderBottom: 'none',
                              color: theme.text.secondary
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
          )}
        </Table>
      </TableContainer>
      <div style={{ height: rows?.length > 0 ? tableSpaceHeight : tableSpaceHeight + 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{rows?.length === 0 && language['NO_TRANSACTION']}</div>
    </div>
  )
}