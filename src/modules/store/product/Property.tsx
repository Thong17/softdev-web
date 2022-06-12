import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import NotFound from 'components/shared/NotFound'
import { CustomColorContainer, CustomOptionContainer } from 'styles'
import { LocaleField, DetailField } from 'components/shared/form'
import { Section } from 'components/shared/Section'
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { Button, MenuList } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { propertySchema } from './schema'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectProduct, getProduct, deleteOption } from './redux'
import useLanguage from 'hooks/useLanguage'
import { MenuDialog } from 'components/shared/MenuDialog'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { OptionForm } from './OptionForm'
import { DeleteButton, UpdateButton } from 'components/shared/table/ActionButton'
import useAlert from 'hooks/useAlert'
import { initOption, mapOptionBody } from './redux/constant'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
}

export const PropertyProduct = () => {
  const dispatch = useAppDispatch()
  const { data: product, status } = useAppSelector(selectProduct)
  const { id, action } = useParams()
  const [showForm, setShowForm] = useState(false)
  const [optionValue, setOptionValue] = useState(initOption)
  const [optionDialog, setOptionDialog] = useState({
    open: false,
    propertyId: null,
    productId: id,
    optionId: null
  })
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(propertySchema) })

  useEffect(() => {
    if (id) {
      dispatch(getProduct({ id }))
    }
  }, [dispatch, id])

  if (action !== 'create' && action !== 'update') return <NotFound />

  const propertyBreadcrumb = [
    {
      title: 'Store',
      path: '/store',
    },
    {
      title: 'Product',
      path: '/store/product',
    },
    {
      title: action === 'create' ? 'Create' : 'Update',
      path:
        action === 'create'
          ? '/store/product/create'
          : `/store/product/update/${id}`,
    },
    {
      title: 'Property',
    },
  ]

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const submit = (data) => {
    Axios({
      method: 'POST',
      url: `/store/product/property/create`,
      body: { ...data, product: id },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        id && dispatch(getProduct({ id }))
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleEditProperty = (id) => {
    console.log(id)
  }

  const handleDeleteProperty = (id) => {
    console.log(id)
  }

  const handleEditOption = (oid, propId) => {
    Axios({
      method: 'GET',
      url: `/store/product/option/detail/${oid}`,
    })
      .then((data) => {
        setOptionValue(mapOptionBody(data.data.data))
        setOptionDialog({
          ...optionDialog,
          propertyId: propId,
          optionId: oid,
          open: true,
        })
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleDeleteOption = (id) => {
    confirm({
      title: 'Delete Option',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: `/store/product/option/disable/${id}`,
        })
          .then((data: any) => {
            if (data?.data?.code === 'SUCCESS') {
              dispatch(deleteOption(data?.data?.data?._id))
            }
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch()
  }

  return (
    <Container header={<Header stages={propertyBreadcrumb} />}>
      <OptionForm
        optionDialog={optionDialog}
        setOptionDialog={setOptionDialog}
        theme={theme}
        defaultValues={optionValue}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: device === 'desktop' ? '500px 1fr' : '1fr',
          gridGap: 20,
        }}
      >
        <div className='preview'>Preview</div>
        <div>
          <Section describe='Color'>
            <CustomColorContainer
              device={device}
              styled={theme}
              loading={'false'}
            >
              <div className='color'></div>
              <div className='color'></div>
              <div className='color'></div>
              <div className='color'></div>
              <div className='color'></div>
            </CustomColorContainer>
          </Section>
          <form
            onSubmit={handleSubmit(submit)}
            className='property-form'
            style={{
              marginTop: 40,
              height: showForm ? 'fit-content' : 36.5,
              padding: showForm ? 30 : 0,
              border: theme.border.quaternary,
              borderRadius: theme.radius.secondary,
            }}
          >
            {showForm && (
              <>
                <LocaleField
                  name='name'
                  err={errors?.name}
                  describe='Property'
                  onChange={handleLocaleChange}
                />
                <DetailField
                  type='text'
                  label='Description'
                  style={{ height: 70 }}
                  {...register('description')}
                />
              </>
            )}
            <Button
              fullWidth={showForm ? false : true}
              variant='contained'
              color={showForm ? 'error' : 'info'}
              onClick={toggleForm}
            >
              {showForm ? 'Cancel' : 'Add Property'}
            </Button>
            {showForm && (
              <Button
                variant='contained'
                type='submit'
                style={{ marginLeft: 20 }}
              >
                Create
              </Button>
            )}
          </form>
          {status === 'SUCCESS' &&
            product?.properties?.map((property, index) => {
              return (
                <Section
                  key={index}
                  describe={
                    property?.name?.[lang] || property?.name?.['English']
                  }
                >
                  <div
                    className='action'
                    style={{ position: 'absolute', top: -7, right: 0 }}
                  >
                    <MenuDialog
                      label={
                        <MoreHorizIcon
                          style={{
                            color: theme.text.secondary,
                          }}
                        />
                      }
                    >
                      <MenuList
                        component='div'
                        onClick={() => handleEditProperty(property?._id)}
                      >
                        Edit
                      </MenuList>
                      <MenuList
                        component='div'
                        onClick={() => handleDeleteProperty(property?._id)}
                      >
                        Delete
                      </MenuList>
                    </MenuDialog>
                  </div>
                  <CustomOptionContainer
                    device={device}
                    styled={theme}
                    loading={'false'}
                  >
                    <Button
                      className='create-button'
                      onClick={() => {
                        setOptionValue(initOption)
                        setOptionDialog({
                          ...optionDialog,
                          propertyId: property?._id,
                          open: true,
                        })
                      }}
                    >
                      <AddRoundedIcon />
                    </Button>
                    {product.options.map((option, index) => {
                      return (
                        option.property === property._id && (
                          <div key={index} className='option-container'>
                            <div className='action'>
                              <UpdateButton
                                style={{ margin: 0 }}
                                onClick={() => handleEditOption(option._id, property._id)}
                              />
                              <DeleteButton onClick={() => handleDeleteOption(option._id)} />
                            </div>
                            {option.name?.[lang] || option.name?.['English']}
                            <span>
                              {option.price} {option.currency}
                            </span>
                          </div>
                        )
                      )
                    })}
                  </CustomOptionContainer>
                </Section>
              )
            })}
        </div>
      </div>
    </Container>
  )
}
