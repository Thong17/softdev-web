
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { getListLoan, selectListLoan } from './redux'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { useNavigate } from 'react-router-dom'
import { RequestLoanDialog } from './RequestLoanDialog'
import { columnData, mappedItem } from './constant'

export const Loan = () => {
  const navigate = useNavigate()
  const confirm = useAlert()
  const { notify } = useNotify()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListLoan)
  const [rowData, setRowData] = useState<any>([])
  const [requestDialog, setRequestDialog] = useState({ open: false })

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
            dispatch(getListLoan({}))
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
          onOpenRequest={() => setRequestDialog({ open: true })}
        />
      }
    >
      <RequestLoanDialog dialog={requestDialog} setDialog={setRequestDialog} />
      <StickyTable columns={columnData} rows={rowData} />
    </Container>
  )
}
