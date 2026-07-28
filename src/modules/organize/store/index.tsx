import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListStore, selectListStore } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { Data, createData, columnData } from './constant'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'

export const Store = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const { data: stores, count, status } = useAppSelector(selectListStore)
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [queryParams, setQueryParams] = useSearchParams()

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
    dispatch(getListStore({ query: queryParams }))
  }, [dispatch, queryParams])

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/organize/store/disable/${id}`,
    })
    response
      .then(() => dispatch(getListStore({ query: queryParams })))
      .catch((err) => notify(err?.response?.data?.msg, 'error'))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    const listStores = stores.map((store: any) => {
      return createData(
        store._id,
        store.logo?.filename || store.logo,
        store.name,
        store.type || '...',
        store.contact || '...',
        store.createdBy?.username || store.createdBy || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listStores)
  }, [stores, lang, user, device, navigate])

  return (
    <Container
      header={
        <Header
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
      }
    >
      <DeleteDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDialog({ open: false, id: null })}
      ></DeleteDialog>
      <StickyTable
        columns={columnData}
        rows={rowData}
        setQuery={handleQuery}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0}
      />
    </Container>
  )
}

export { UpdateStore } from './Update'
export { CreateStore } from './Create'
export { DetailStore } from './Detail'
export { LayoutForm } from './LayoutForm'
