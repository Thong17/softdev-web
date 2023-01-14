
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { getListLoan, selectListLoan } from './redux'
import { useEffect, useState } from 'react'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { currencyFormat, dateFormat } from 'utils/index'
import useAuth from 'hooks/useAuth'
import { IconButton } from '@mui/material'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { useNavigate } from 'react-router-dom'

const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'Invoice' },
  { id: 'customer', label: 'Customer' },
  { id: 'contact', label: 'Contact' },
  { id: 'actualPaid', label: 'Actual\u00a0Paid' },
  { id: 'totalPaid', label: 'Total\u00a0Paid' },
  { id: 'totalRemain', label: 'Total\u00a0Remain' },
  { id: 'dueDate', label: 'Due\u00a0Date' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const mappedItem = (data, privilege, theme, onCancel, onDetail) => {
  const action = <>
    {privilege?.loan?.cancel && (
      <IconButton
        size='small'
        onClick={() => onCancel(data._id)}
        style={{
          backgroundColor: `${theme.color.error}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.error,
        }}
      >
        <ClearRoundedIcon fontSize='small' />
      </IconButton>
    )}
    {privilege?.loan?.update && (
      <IconButton
        size='small'
        onClick={() => onDetail(data._id)}
        style={{
          backgroundColor: `${theme.color.info}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.info,
        }}
      >
        <ArrowRightAltRoundedIcon fontSize='small' />
      </IconButton>
    )}
  </>
  return {
    _id: data._id,
    invoice: data.payment?.invoice,
    customer: data.customer?.displayName || '...',
    contact: data.customer?.contact || '...',
    actualPaid: currencyFormat(data.actualPaid.value, data.actualPaid.currency),
    totalPaid: currencyFormat(data.totalPaid.total, 'USD'),
    totalRemain: currencyFormat(data.totalRemain.USD, 'USD'),
    dueDate: dateFormat(null),
    action
  }
}

export const Loan = () => {
  const navigate = useNavigate()
  const confirm = useAlert()
  const { notify } = useNotify()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListLoan)
  const [rowData, setRowData] = useState<any>([])

  useEffect(() => {
    dispatch(getListLoan({}))
  }, [dispatch])

  useEffect(() => {
    const handleCancel = (id) => {
      confirm({
        title: 'Are you sure you want to cancel this loan?',
        description: 'By cancel this loan you will remove it from the list.',
        variant: 'error'
      })
       .then(() => {
        Axios({
          method: 'DELETE',
          url: `/function/loan/cancel/${id}`
        })
          .then(() => {
            setRowData(data => data.filter(item => item._id !== id))
          })
          .catch(err => notify(err?.response?.data?.msg))
       })
       .catch(() => {})
    }
    const handleDetail = (id) => {
      navigate(`/function/loan/${id}`)
    }

    setRowData(data.map(item => mappedItem(item, user?.privilege, theme, handleCancel, handleDetail)))
    // eslint-disable-next-line
  }, [data])
  
  return (
    <Container
      header={
        <Header
          styled={theme}
        />
      }
    >
      <StickyTable columns={columnData} rows={rowData} />
    </Container>
  )
}
