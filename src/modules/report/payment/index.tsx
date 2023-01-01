import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListPayment, selectListPayment } from './redux'
import useNotify from 'hooks/useNotify'
import { Header } from './Header'
import {
  Data,
  createData,
  columnData,
} from './constant'
import { currencyFormat, debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import Axios from 'constants/functions/Axios'
import { Detail } from './Detail'
import useTheme from 'hooks/useTheme'

export const Payments = () => {
  const dispatch = useAppDispatch()
  const { data: payments, count, status } = useAppSelector(selectListPayment)
  const { notify } = useNotify()
  const { theme } = useTheme()
  const [rowData, setRowData] = useState<Data[]>([])
  const [queryParams, setQueryParams] = useSearchParams()
  const [paymentDialog, setPaymentDialog] = useState<any>({ open: false, payment: null })

  const updateQuery = debounce((value) => {
    handleQuery({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleFilter = (option) => {
    handleQuery({ filter: option.filter, sort: option.asc ? 'asc' : 'desc' })
  }

  const handleQuery = (data) => {
    let { limit, search } = data

    let query = {}
    const _limit = queryParams.get('limit')
    const _page = queryParams.get('page')
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')

    if (_limit) query = { limit: _limit, ...query }
    if (_page) query = { page: _page, ...query }
    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }

    if (limit || search) return setQueryParams({ ...query, ...data, page: 0 })
    setQueryParams({ ...query, ...data })
  }

  useEffect(() => {
    dispatch(getListPayment({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const handleView = (id) => {
      Axios({
        url: `/sale/payment/detail/${id}`,
        method: 'GET'
      })
        .then(data => {
          setPaymentDialog({ payment: data?.data?.data, open: true })
        })
        .catch(err => notify(err?.response?.data?.msg))
    }
    const listPayments = payments.map((payment: any) => {
      return createData(
        payment._id,
        payment.invoice,
        payment.paymentMethod?.toUpperCase(),
        currencyFormat(payment.subtotal.BOTH, 'USD'),
        currencyFormat(payment.discounts[0]?.value, payment.discounts[0]?.type),
        currencyFormat(payment.services[0]?.value, payment.services[0]?.type),
        currencyFormat(payment.vouchers[0]?.value, payment.vouchers[0]?.type),
        currencyFormat(payment.total.value, payment.total.currency),
        payment.createdBy?.username,
        handleView
      )
    })

    setRowData(listPayments)
    // eslint-disable-next-line
  }, [payments, notify])

  return (
    <Container
      header={
        <Header
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
      }
    >
      <Detail theme={theme} dialog={paymentDialog} setDialog={setPaymentDialog} />
      <StickyTable
        columns={columnData}
        rows={rowData}
        setQuery={handleQuery}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={
          status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0
        }
      />
    </Container>
  )
}
