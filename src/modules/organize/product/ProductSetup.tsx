import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import NotFound from 'components/shared/NotFound'
import { CustomColorContainer, CustomOptionContainer } from 'styles'
import { Section } from 'components/shared/Section'
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  selectProduct,
  getProduct,
  deleteOption,
  deleteProperty,
  deleteColor,
  deleteCustomerOption,
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
  initCustomerOption,
  initColor,
  initOption,
  initProperty,
  mapOptionBody,
  mapPropertyBody,
  mapColorBody,
  mapCustomerOptionBody,
} from './redux/constant'
import { PropertyForm } from './PropertyForm'
import { ColorForm } from './ColorForm'
import { ProductInfo } from 'components/shared/ProductInfo'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import Button from 'components/shared/Button'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import { CustomerOptionForm } from './CustomerOptionForm'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
}

export const ProductSetup = () => {
  const dispatch = useAppDispatch()
  const { data: product, status } = useAppSelector(selectProduct)
  const { id, action } = useParams()
  const [properties, setProperties] = useState(product?.properties || [])
  const [optionValue, setOptionValue] = useState(initOption)
  const [colorValue, setColorValue] = useState(initColor)
  const [customerOptionValue, setCustomerOptionValue] = useState(initCustomerOption)
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
  const [customerOptionDialog, setCustomerOptionDialog] = useState({
    open: false,
    customerId: null,
    productId: id,
  })
  const [propertyDialog, setPropertyDialog] = useState({
    open: false,
    propertyId: null,
    productId: id,
  })
  const { lang, language } = useLanguage()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()

  useEffect(() => {
    if (status !== 'SUCCESS') return

    setProperties(product.properties)
  }, [product, status])

  useEffect(() => {
    if (id) {
      dispatch(getProduct({ id }))
    }
  }, [dispatch, id])

  if (action !== 'create' && action !== 'update') return <NotFound />

  const propertyBreadcrumb = [
    {
      title: language['ORGANIZE'],
      path: '/organize',
    },
    {
      title: language['PRODUCT'],
      path: '/organize/product',
    },
    {
      title: action === 'create' ? language['CREATE'] : language['UPDATE'],
      path:
        action === 'create'
          ? '/organize/product/create'
          : `/organize/product/update/${id}`,
    },
    {
      title: language['SETUP'],
    },
  ]

  const handleEditProperty = (propId) => {
    Axios({
      method: 'GET',
      url: `/organize/product/property/detail/${propId}`,
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
          url: `/organize/product/property/disable/${id}`,
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
      url: `/organize/product/option/detail/${oid}`,
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
          url: `/organize/product/option/disable/${id}`,
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
      url: `/organize/product/color/detail/${cid}`,
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
          url: `/organize/product/color/disable/${id}`,
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

  const handleEditCustomerOption = (cid) => {
    Axios({
      method: 'GET',
      url: `/organize/product/customer/detail/${cid}`,
    })
      .then((data) => {
        setCustomerOptionValue(mapCustomerOptionBody(data.data.data))
        setCustomerOptionDialog({
          ...optionDialog,
          customerId: cid,
          open: true,
        })
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleDeleteCustomerOption = (id) => {
    confirm({
      title: 'Delete Customer Option',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: `/organize/product/customer/disable/${id}`,
        })
          .then((data: any) => {
            if (data?.data?.code !== 'SUCCESS') {
              notify(data?.data?.msg, 'error')
              return
            }
            dispatch(deleteCustomerOption(data?.data?.data?._id))
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

  const handleDropProperty = (event: any) => {
    if (!event.destination || event.destination?.index === event.source?.index)
      return

    const items = Array.from(properties)
    const [reorderItem] = items.splice(event?.source?.index, 1)
    items.splice(event?.destination?.index, 0, reorderItem)
    const reorderedItems = items.map((item: any, index) => {
      return { _id: item._id, order: index }
    })
    setProperties(items)
    Axios({
      method: 'PUT',
      url: `/organize/product/property/reorder`,
      body: reorderedItems,
    })
      .then((data) => {
        notify(data?.data?.msg, data?.data?.code?.toLowerCase())
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleToggleDefault = (optionId) => {
    Axios({
      method: 'PUT',
      url: `/organize/product/option/toggle/${optionId}`,
    })
      .then((data) => {
        id && dispatch(getProduct({ id }))
        notify(data?.data?.msg, data?.data?.code?.toLowerCase())
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
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
      <CustomerOptionForm
        dialog={customerOptionDialog}
        setDialog={setCustomerOptionDialog}
        theme={theme}
        defaultValues={customerOptionValue}
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
          gridTemplateColumns: device === 'mobile' ? '1fr' : '400px 1fr',
          gridGap: 20,
        }}
      >
        {device !== 'mobile' && (
          <div className='preview' style={{ paddingTop: 20 }}>
            <ProductInfo
              info={product}
              loading={status !== 'SUCCESS' ? true : false}
            />
          </div>
        )}
        <div>
        <Section
            describe={language['COLOR']}
            style={{
              boxShadow: theme.shadow.secondary,
              borderRadius: theme.radius.ternary,
              marginTop: 20,
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
              {product?.colors?.map((color, index) => {
                return (
                  <div className='color-container' key={index}>
                    <div className='action'>
                      <UpdateButton
                        style={{ margin: 0 }}
                        onClick={() => handleEditColor(color._id)}
                      />
                      <DeleteButton
                        onClick={() => handleDeleteColor(color._id)}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        height: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          width: 'calc(100% - 7px)',
                          paddingRight: 10,
                          boxSizing: 'border-box',
                        }}
                      >
                        <div className='option-detail'>
                          <TextEllipsis className='title'>
                            {color?.name?.[lang] || color?.name?.['English']}
                          </TextEllipsis>
                          <TextEllipsis className='description'>
                            {color?.description}
                          </TextEllipsis>
                        </div>
                        <TextEllipsis className='option-price'>
                          {color?.price} {color?.currency}
                        </TextEllipsis>
                      </div>
                      <span
                        style={{
                          width: 7,
                          height: '100%',
                          backgroundColor: color?.code,
                          boxShadow: theme.shadow.inset,
                          borderRadius: 3,
                        }}
                      ></span>
                    </div>
                  </div>
                )
              })}
            </CustomColorContainer>
          </Section>
          <Section
            describe={language['CUSTOMER']}
            style={{
              boxShadow: theme.shadow.secondary,
              borderRadius: theme.radius.ternary,
              marginTop: 20,
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
                  setCustomerOptionValue(initColor)
                  setCustomerOptionDialog({
                    ...customerOptionDialog,
                    open: true,
                  })
                }}
              >
                <AddRoundedIcon />
              </Button>
              {product?.customers?.map((color, index) => {
                return (
                  <div className='color-container' key={index}>
                    <div className='action'>
                      <UpdateButton
                        style={{ margin: 0 }}
                        onClick={() => handleEditCustomerOption(color._id)}
                      />
                      <DeleteButton
                        onClick={() => handleDeleteCustomerOption(color._id)}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        height: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div className='option-detail'>
                          <TextEllipsis className='title'>
                            {color?.name?.[lang] || color?.name?.['English']}
                          </TextEllipsis>
                          <TextEllipsis className='description'>
                            {color?.description}
                          </TextEllipsis>
                        </div>
                        <TextEllipsis className='option-price'>
                          {color?.price} {color?.currency}
                        </TextEllipsis>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CustomColorContainer>
          </Section>
          <Button
            fullWidth
            style={{
              marginTop: 20,
              backgroundColor: theme.background.secondary,
              color: theme.text.secondary,
              boxShadow: theme.shadow.secondary,
            }}
            onClick={() => {
              setPropertyValue(initProperty)
              setPropertyDialog({
                ...propertyDialog,
                open: true,
              })
            }}
          >
            {language['ADD_PROPERTY']}
          </Button>
          <DragDropContext onDragEnd={handleDropProperty}>
            <Droppable droppableId='properties'>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {properties?.map((property, index) => {
                    return (
                      <Draggable
                        key={property._id}
                        draggableId={property._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Section
                              style={{
                                position: 'relative',
                                boxSizing: 'border-box',
                                paddingTop: 20,
                              }}
                              boxShadow={theme.shadow.secondary}
                              describe={
                                property?.name?.[lang] ||
                                property?.name?.['English']
                              }
                            >
                              <div
                                className='action'
                                style={{
                                  position: 'absolute',
                                  top: -7,
                                  right: 0,
                                }}
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
                                  <MenuItem
                                    component='div'
                                    onClick={() =>
                                      handleEditProperty(property?._id)
                                    }
                                  >
                                    {language['EDIT']}
                                  </MenuItem>
                                  <MenuItem
                                    component='div'
                                    onClick={() =>
                                      handleDeleteProperty(property?._id)
                                    }
                                  >
                                    {language['DELETE']}
                                  </MenuItem>
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
                                      <div
                                        key={index}
                                        className='option-container'
                                      >
                                        <div
                                          style={{
                                            position: 'absolute',
                                            bottom: 6,
                                            left: 10,
                                            color: theme.text.quaternary,
                                            zIndex: 10,
                                          }}
                                        >
                                          {option.isDefault ? (
                                            <RadioButtonCheckedRoundedIcon
                                              onClick={() => handleToggleDefault(option._id)}
                                              style={{ cursor: 'pointer' }}
                                              fontSize='small'
                                            />
                                          ) : (
                                            <RadioButtonUncheckedRoundedIcon
                                              onClick={() => handleToggleDefault(option._id)}
                                              style={{ cursor: 'pointer' }}
                                              fontSize='small'
                                            />
                                          )}
                                        </div>
                                        <div className='action'>
                                          <UpdateButton
                                            style={{ margin: 0 }}
                                            onClick={() =>
                                              handleEditOption(
                                                option._id,
                                                property._id
                                              )
                                            }
                                          />
                                          <DeleteButton
                                            onClick={() =>
                                              handleDeleteOption(option._id)
                                            }
                                          />
                                        </div>
                                        <div className='option-detail'>
                                          <TextEllipsis className='title'>
                                            {option.name?.[lang] ||
                                              option.name?.['English']}
                                          </TextEllipsis>
                                          <TextEllipsis className='description'>
                                            {option.description}
                                          </TextEllipsis>
                                        </div>
                                        <TextEllipsis className='option-price'>
                                          {option.price} {option.currency}
                                        </TextEllipsis>
                                      </div>
                                    )
                                  )
                                })}
                              </CustomOptionContainer>
                            </Section>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Container>
  )
}
