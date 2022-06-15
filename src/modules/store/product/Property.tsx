import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import NotFound from 'components/shared/NotFound'
import { CustomColorContainer, CustomOptionContainer } from 'styles'
import { Section } from 'components/shared/Section'
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { Button, MenuList } from '@mui/material'
import { useEffect, useState } from 'react'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  selectProduct,
  getProduct,
  deleteOption,
  deleteProperty,
  deleteColor
} from './redux'
import useLanguage from 'hooks/useLanguage'
import { MenuDialog } from 'components/shared/MenuDialog'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { OptionForm } from './OptionForm'
import {
  DeleteButton,
  UpdateButton,
} from 'components/shared/table/ActionButton'
import useAlert from 'hooks/useAlert'
import {
  initColor,
  initOption,
  initProperty,
  mapOptionBody,
  mapPropertyBody,
  mapColorBody
} from './redux/constant'
import { PropertyForm } from './PropertyForm'
import { ColorForm } from './ColorForm'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
}

export const PropertyProduct = () => {
  const dispatch = useAppDispatch()
  const { data: product, status } = useAppSelector(selectProduct)
  const { id, action } = useParams()
  const [optionValue, setOptionValue] = useState(initOption)
  const [colorValue, setColorValue] = useState(initColor)
  const [propertyValue, setPropertyValue] = useState(initProperty)
  const [optionDialog, setOptionDialog] = useState({
    open: false,
    propertyId: null,
    productId: id,
    optionId: null,
  })
  const [colorDialog, setColorDialog] = useState({
    open: false,
    colorId: null,
    productId: id,
  })
  const [propertyDialog, setPropertyDialog] = useState({
    open: false,
    propertyId: null,
    productId: id,
  })
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()

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
      title: 'Setup',
    },
  ]

  const handleEditProperty = (propId) => {
    Axios({
      method: 'GET',
      url: `/store/product/property/detail/${propId}`,
    })
      .then((data) => {
        setPropertyValue(mapPropertyBody(data.data.data))
        setPropertyDialog({
          ...optionDialog,
          propertyId: propId,
          open: true,
        })
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleDeleteProperty = (id) => {
    confirm({
      title: 'Delete Property',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: `/store/product/property/disable/${id}`,
        })
          .then((data: any) => {
            if (data?.data?.code !== 'SUCCESS') {
              notify(data?.data?.msg, 'error')
              return
            }
            dispatch(deleteProperty(data?.data?.data?._id))
            notify(data?.data?.msg, 'success')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {
        return
      })
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
            if (data?.data?.code !== 'SUCCESS') {
              notify(data?.data?.msg, 'error')
              return
            }
            dispatch(deleteOption(data?.data?.data?._id))
            notify(data?.data?.msg, 'success')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {
        return
      })
  }

  const handleEditColor = (cid) => {
    Axios({
      method: 'GET',
      url: `/store/product/color/detail/${cid}`,
    })
      .then((data) => {
        setColorValue(mapColorBody(data.data.data))
        setColorDialog({
          ...optionDialog,
          colorId: cid,
          open: true,
        })
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleDeleteColor = (id) => {
    confirm({
      title: 'Delete Color',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: `/store/product/color/disable/${id}`,
        })
          .then((data: any) => {
            if (data?.data?.code !== 'SUCCESS') {
              notify(data?.data?.msg, 'error')
              return
            }
            dispatch(deleteColor(data?.data?.data?._id))
            notify(data?.data?.msg, 'success')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {
        return
      })
  }

  return (
    <Container header={<Header stages={propertyBreadcrumb} />}>
      <OptionForm
        dialog={optionDialog}
        setDialog={setOptionDialog}
        theme={theme}
        defaultValues={optionValue}
      />
      <ColorForm
        dialog={colorDialog}
        setDialog={setColorDialog}
        theme={theme}
        defaultValues={colorValue}
      />
      <PropertyForm
        dialog={propertyDialog}
        setDialog={setPropertyDialog}
        theme={theme}
        defaultValues={propertyValue}
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
          <Section
            describe='Color'
            style={{
              boxShadow: theme.shadow.container,
              borderRadius: theme.radius.secondary
            }}
          >
            <CustomColorContainer
              device={device}
              styled={theme}
              loading={'false'}
            >
              <Button
                className='create-button'
                onClick={() => {
                  setColorValue(initColor)
                  setColorDialog({
                    ...colorDialog,
                    open: true,
                  })
                }}
              >
                <AddRoundedIcon />
              </Button>
              {
                product?.colors?.map((color, index) => {
                  return (
                    <div key={index}>
                       <div className='action'>
                        <UpdateButton
                          style={{ margin: 0 }}
                          onClick={() =>
                            handleEditColor(color._id)
                          }
                        />
                        <DeleteButton
                          onClick={() => handleDeleteColor(color._id)}
                        />
                      </div>
                      {color?.name?.[lang] || color?.name?.['English']}
                    </div>
                  )
                })
              }
            </CustomColorContainer>
          </Section>
          <Button
            fullWidth
            variant='outlined'
            style={{ marginTop: 20 }}
            onClick={() => {
              setPropertyValue(initProperty)
              setPropertyDialog({
                ...propertyDialog,
                open: true,
              })
            }}
          >
            Add Property
          </Button>
          {status === 'SUCCESS' &&
            product?.properties?.map((property, index) => {
              return (
                <Section
                  style={{
                    boxShadow: theme.shadow.container,
                    borderRadius: theme.radius.secondary,
                    marginTop: 30,
                  }}
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
                                onClick={() =>
                                  handleEditOption(option._id, property._id)
                                }
                              />
                              <DeleteButton
                                onClick={() => handleDeleteOption(option._id)}
                              />
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
