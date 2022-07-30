import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { ITableColumn } from './StickyTable'

interface ITable {
  columns: ITableColumn<string>[]
  rows: any[]
}

export const InvoiceTable = ({
  columns,
  rows,
}: ITable) => {
  return (
    <div className='table-container'>
      <TableContainer className='table'>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    padding: 5,
                    backgroundColor: '#ccc',
                    color: '#000',
                    border: 'none',
                    fontWeight: 600
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
      <div style={{ height: rows?.length > 0 ? 70 : 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 13 }}>{rows?.length === 0 && 'No Transaction'}</div>
    </div>
  )
}