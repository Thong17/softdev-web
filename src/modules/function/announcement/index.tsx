import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListAnnouncement, selectListAnnouncement } from './redux'
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
import useAlert from 'hooks/useAlert'

export const Announcements = () => {
  const dispatch = useAppDispatch()
  const { data: announcements, count, status } = useAppSelector(selectListAnnouncement)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify, notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
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

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/function/announcement/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListAnnouncement({})))

    setDialog({ open: false, id: null })
  }

  const handleToggleStatus = (id) => {
    confirm({
      title: 'Are you sure you want to toggle the status?',
      description:
        'Toggle the status will update announcement status to opposite current status.',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'PUT',
          url: `/function/announcement/toggleStatus/${id}`,
        })
          .then(() => {
            dispatch(getListAnnouncement({ query: queryParams }))
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
      })
      .catch(() => {})
  }

  useEffect(() => {
    dispatch(getListAnnouncement({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const listAnnouncements = announcements.map((announcement: any) => {
      return createData(
        announcement._id,
        announcement.banner?.filename,
        announcement.title?.[lang] || announcement.title?.['English'],
        announcement.startAt,
        announcement.expireAt,
        announcement.order,
        announcement.status,
        announcement.createdBy || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })

    setRowData(listAnnouncements)
  }, [announcements, lang, user, device, theme, navigate])

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
        onToggleStatus={handleToggleStatus}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={
          status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0
        }
      />
    </Container>
  )
}

export { CreateAnnouncement } from './Create'
export { UpdateAnnouncement } from './Update'
export { DetailAnnouncement } from './Detail'
