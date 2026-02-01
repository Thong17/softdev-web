import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListTransaction, selectListTransaction } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  columnData,
} from './constant'
import { timeFormat, debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'

export const Transactions = () => {
  const dispatch = useAppDispatch()
  const { data: transactions, count, status } = useAppSelector(selectListTransaction)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const confirm = useAlert()

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
    dispatch(getListTransaction({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const handleReverseTransaction = (id) => {
      confirm({
        title: 'Are you sure you want to reverse this transaction',
        description: 'Reverse the transaction will reset stock.',
        variant: 'error'
      })
        .then(() => {
          Axios({
            method: 'DELETE',
            url: `/sale/transaction/remove/${id}`,
          })
            .then(() => {
              dispatch(getListTransaction({}))
            })
            .catch(err => notify(err?.response?.data?.msg, 'error'))
        })
        .catch(() => {})
    }
    const listTransactions = transactions.map((transaction: any) => {
      return createData(
        transaction._id,
        transaction.description,
        transaction.price,
        transaction.currency,
        transaction.quantity,
        transaction.discount,
        transaction.total,
        transaction.status,
        transaction.note,
        transaction.createdBy?.username || '...',
        timeFormat(transaction.createdAt, 'DD-MMM-YYYY HH:mm'),
        user?.privilege,
        theme,
        handleReverseTransaction
      )
    })

    setRowData(listTransactions)
  }, [transactions, lang, user, device, theme, navigate, confirm, dispatch, notify])

  return (
    <Container
      header={
        <Header
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
      }
    >
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
