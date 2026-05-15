import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListMembership, selectListMembership } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  columnData,
} from './constant'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'

export const Memberships = () => {
  const dispatch = useAppDispatch()
  const { data: memberships, count, status } = useAppSelector(selectListMembership)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
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

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/organize/membership/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListMembership({})))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    dispatch(getListMembership({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const listMemberships = memberships.map((membership: any) => {
      return createData({
        id: membership._id,
        name: membership.description?.[lang] || membership.description?.['English'] || '...',
        discounts: membership.discount || membership.discounts,
        target: membership.discounts?.[0]?.target?.length || 0,
        startAt: membership.startAt,
        expireAt: membership.expireAt,
        note: membership.note,
        createdBy: membership.createdBy || '...',
        privilege: user?.privilege,
        device,
        navigate,
        setDialog,
      })
    })

    setRowData(listMemberships)
  }, [memberships, lang, user, device, theme, navigate])

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
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      />
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

export { CreateMembership } from './Create'
export { UpdateMembership } from './Update'
export { DetailMembership } from './Detail'