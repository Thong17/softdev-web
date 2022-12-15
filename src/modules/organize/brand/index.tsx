import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListBrand, selectListBrand } from './redux'
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
  importColumns,
  importColumnData,
} from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CustomButton } from 'styles'
import { languages } from 'contexts/language/constant'

export const Brands = () => {
  const dispatch = useAppDispatch()
  const { data: brands, count, status } = useAppSelector(selectListBrand)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify, notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })
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

  const handleImport = (e) => {
    const response = ImportExcel(
      '/organize/brand/excel/import',
      e.target.files[0],
      importColumns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data.map((importData) => {
        const ImportAction = ({ no }) => (
          <IconButton
            onClick={() => {
              setImportDialog((prevData) => {
                return {
                  ...prevData,
                  data: prevData.data.filter(
                    (prevItem: any) => prevItem.no !== no
                  ),
                }
              })
            }}
          >
            <CloseRoundedIcon
              style={{ color: theme.color.error, fontSize: 19 }}
            />
          </IconButton>
        )
        let mappedData = { ...importData, action: <ImportAction no={importData?.no} /> }
        Object.keys(languages).forEach(lang => {
          mappedData[`name${lang}`] = importData.name[lang]
        })
        return mappedData
      })

      return setImportDialog({ open: true, data: importList })
    })
  }

  const handleCloseImport = () => {
    confirm({
      title: 'Discard Import',
      description: 'Do you want to discard all the change?',
      variant: 'error',
    })
      .then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    const response = Axios({
      method: 'POST',
      url: '/organize/brand/batch',
      body: importDialog.data,
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListBrand({ query: queryParams }))
    })
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/organize/brand/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListBrand({})))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    dispatch(getListBrand({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const listBrands = brands.map((brand: any) => {
      return createData(
        brand._id,
        brand.icon?.filename,
        brand.name?.[lang] || brand.name?.['English'],
        brand.description || '...',
        brand.createdBy || '...',
        brand.status,
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listBrands)
  }, [brands, lang, user, device, theme, navigate])

  const handleToggleStatus = (id) => {
    confirm({
      title: 'Are you sure you want to toggle the status?',
      description:
        'Toggle the status will update brand status to opposite current status.',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'PUT',
          url: `/organize/brand/toggleStatus/${id}`,
        })
          .then(() => {
            dispatch(getListBrand({ query: queryParams }))
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
      })
      .catch(() => {})
  }

  return (
    <Container
      header={
        <Header
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          handleImport={handleImport}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div
          style={{ position: 'relative', padding: 10, boxSizing: 'border-box' }}
        >
          <StickyTable
            columns={importColumnData}
            rows={importDialog.data}
            style={{ maxWidth: '90vw' }}
          />
        </div>
        <DialogActions>
          <Button
            onClick={handleCloseImport}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </Button>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              borderRadius: theme.radius.secondary,
            }}
            styled={theme}
            onClick={handleConfirmImport}
            autoFocus
          >
            Import
          </CustomButton>
        </DialogActions>
      </AlertDialog>
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

export { CreateBrand } from './Create'
export { UpdateBrand } from './Update'
export { DetailBrand } from './Detail'
