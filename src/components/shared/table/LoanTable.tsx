import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { currencyFormat, dateFormat } from 'utils/index'
import { ITableColumn, StickyTable } from './StickyTable'

const columnData: ITableColumn<any>[] = [
  { id: 'dueDate', label: 'DUE_DATE' },
  { id: 'principalAmount', label: 'PRINCIPAL_AMOUNT' },
  { id: 'interestAmount', label: 'INTEREST_AMOUNT' },
  { id: 'totalAmount', label: 'TOTAL_AMOUNT' },
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'action', label: 'ACTION' },
]

const mapData = (data) => {
  return {
    dueDate: dateFormat(data.dueDate),
    principalAmount: currencyFormat(data.principalAmount.value, data.principalAmount.currency),
    interestAmount: currencyFormat(data.interestAmount.value, data.interestAmount.currency),
    totalAmount: currencyFormat(data.totalAmount.value, data.totalAmount.currency),
    principalBalance: currencyFormat(data.principalBalance.value, data.principalBalance.currency),
  }
}

const LoanTable = ({ data }) => {
  const [rowData, setRowData] = useState<any>([])

  useEffect(() => {
    if (!data) return
    setRowData(data.map(item => mapData(item)))
  }, [data])

  return (
    <Box>
      <StickyTable
        columns={columnData}
        rows={rowData}
        pagination={false}
      />
    </Box>
  )
}

export default LoanTable
