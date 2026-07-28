import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListProductTemplate, selectListProductTemplate } from './redux'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { Skeleton } from '@mui/material'
import { CustomButton } from 'styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { debounce } from 'utils'

const Header = ({ styled, navigate, handleSearch }) => {
  return (
    <DefaultHeader
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      breadcrumb={<StoreBreadcrumbs page='productTemplate' />}
    />
  )
}

export const ProductTemplates = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const { notify, loadify } = useNotify()
  const { data: templates, status } = useAppSelector(selectListProductTemplate)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const updateQuery = debounce((value) => setSearch(value), 300)
  const handleSearch = (e) => updateQuery(e.target.value)

  useEffect(() => {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    dispatch(getListProductTemplate({ query }))
  }, [dispatch, search])

  // The clone action is a one-off mutation (not a list-populating fetch), so
  // it goes through Axios directly here rather than a redux thunk — matching
  // this codebase's convention for create/delete/toggle actions elsewhere
  // (see e.g. Products' handleConfirm/handleToggleStatus).
  const handleAddToStore = (id: string) => {
    setAddingId(id)
    const response = Axios({
      method: 'POST',
      url: `/organize/product/from-template/${id}`,
    })
    loadify(response)
    response
      .then((res) => {
        const newId = res?.data?.data?._id
        notify(res?.data?.msg || 'Product added to your store', 'success')
        if (newId) navigate(`/organize/product/update/${newId}`)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setAddingId(null))
  }

  return (
    <Container
      header={
        <Header styled={theme} navigate={navigate} handleSearch={handleSearch} />
      }
    >
      <GridLayout>
        {status !== 'SUCCESS'
          ? Array.apply(null, Array(10)).map((_, key) => (
              <div key={key}>
                <Skeleton
                  variant='rectangular'
                  height={130}
                  width={150}
                  style={{ borderRadius: theme.radius.secondary }}
                />
              </div>
            ))
          : templates.map((item: any) => (
              <GridItem
                key={item._id}
                title={item.name?.[lang] || item.name?.['English']}
                picture={item.profile?.filename}
                subLeft={
                  item?.brand?.name?.[lang] || item?.brand?.name?.['English'] || '—'
                }
                subRight={
                  <CustomButton
                    styled={theme}
                    disabled={addingId === item._id}
                    style={{
                      padding: '0 8px',
                      minWidth: 0,
                      backgroundColor: `${theme.color.success}22`,
                      color: theme.color.success,
                    }}
                    onClick={() => handleAddToStore(item._id)}
                  >
                    <AddRoundedIcon fontSize='small' />
                  </CustomButton>
                }
              />
            ))}
      </GridLayout>
      {status === 'SUCCESS' && templates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: theme.text.quaternary }}>
          {language['NO_DATA'] || 'No templates available'}
        </div>
      )}
    </Container>
  )
}
