import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomButton } from 'styles/index'
import { CustomerDialog } from '../dialog/CustomerDialog'
import useTheme from 'hooks/useTheme'
import { MiniDetailField, MiniTextField } from '../form/InputField'
import Button from '../Button'
import { MiniSelectField } from '../form/SelectField'
import { yupResolver } from '@hookform/resolvers/yup'
import { reservationSchema } from 'shared/schema'
import { currencyOptions } from '../form/InvoiceForm'
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded'
import { TextEllipsis } from '../TextEllipsis'
import useWeb from 'hooks/useWeb'
import { CircleIcon } from '../table/CustomIcon'
import Edit from '@mui/icons-material/Edit'
import { SelectStructure } from '../form/SelectStructure'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListReservation, selectListReservation } from 'modules/sale/reservation/redux'
import { calculateStructuresPrice, combineDate, inputDateTimeFormat, timeFormat } from 'utils/index'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { CapacityStructure } from '../structure/CapacityStructure'
import useAuth from 'hooks/useAuth'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import useAlert from 'hooks/useAlert'
import useLanguage from 'hooks/useLanguage'

const initReservation: any = {
  price: { value: 0, currency: 'USD', duration: '1h' },
  startAt: null,
  endAt: null,
  customer: null,
  note: '',
  structures: []
}

export const ReservationContainer = ({ selectedStructures, onSave }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const confirm = useAlert()
  const { notify } = useNotify()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data, status } = useAppSelector(selectListReservation)
  const [customerDialog, setCustomerDialog] = useState({ open: false })
  const [customer, setCustomer] = useState({
    displayName: null,
    id: null,
    point: 0,
  })
  const [toggleForm, setToggleForm] = useState(false)
  const [structures, setStructures] = useState<any[]>(selectedStructures)
  const [reservations, setReservations] = useState<any[]>([])
  const [reservationForm, setReservationForm] = useState(initReservation)
  const [reservationId, setReservationId] = useState(null)

  useEffect(() => {
    dispatch(getListReservation())
  }, [dispatch])
  
  useEffect(() => {
    if (status !== 'SUCCESS') return
    const selectedStructureIds = structures.map(structure => structure._id)
    if (selectedStructureIds.length < 1) return setReservations(data)
    setReservations(data.filter(reservation => {
      return reservation.structures.some(structure => selectedStructureIds.includes(structure._id))
    }))
  }, [data, structures, status])

  useEffect(() => {
    setStructures(selectedStructures)
  }, [selectedStructures])
  
  const handleClickCustomer = () => {
    setCustomerDialog({ ...customerDialog, open: true })
  }

  const handleClickStructure = (data) => {
    setStructures(data)
  }

  const handleClickReservation = (id) => {
    navigate(`/sale/reservation/${id}`)
  }

  const handleCloseForm = () => {
    setToggleForm(false)
    setReservationId(null)
    setCustomer({
      displayName: null,
      id: null,
      point: 0
    })
    setReservationForm(initReservation)
  }

  const handleEditReservation = (id) => {
    const reservation = reservations.find(item => item._id === id)
    setReservationId(id)
    setCustomer({
      displayName: reservation?.customer?.displayName,
      id: reservation?.customer?._id,
      point: 0
    })
    setReservationForm({
      price: reservation?.price,
      startAt: inputDateTimeFormat(reservation?.startAt),
      endAt: inputDateTimeFormat(reservation?.endAt),
      customer: reservation?.customer?._Id,
      note: reservation?.note,
      structures: reservation?.structures
    })
    setToggleForm(true)
  }

  const handleDeleteReservation = (id) => {
    confirm({
      title: 'Are you sure you want to delete this reservation?',
      description: 'Delete reservation will delete it from the list.',
      variant: 'error'
    }).then(() => {
      Axios({
        url: `/sale/reservation/delete/${id}`,
        method: 'DELETE',
      }).then(data => {
        notify(data?.data?.msg, 'success')
        setReservations(prev => prev.filter(item => item._id !== id))
      }).catch(err => notify(err?.response?.data?.msg, 'error'))
    }).catch(() => {})
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <CustomerDialog
        dialog={customerDialog}
        setDialog={setCustomerDialog}
        onClickCustomer={(data) => {
          setCustomer(data)
        }}
      />
      <Box
        style={{
          position: 'relative',
          backgroundColor: `${theme.background.secondary}99`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 10,
          boxSizing: 'border-box',
          borderRadius: theme.radius.ternary,
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'fit-content',
          }}
        >
          <SelectStructure onContinue={handleClickStructure} structures={structures} />
          <CapacityStructure />
        </div>
        {toggleForm ? (
          <ReservationForm
            onSave={() => onSave()}
            onClose={handleCloseForm}
            onClickCustomer={handleClickCustomer}
            customer={customer}
            structures={structures}
            defaultValues={reservationForm}
            id={reservationId}
          />
        ) : (
          <CustomButton
            onClick={() => setToggleForm(true)}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
          >
            {`${language['CREATE']} ${language['RESERVATION']}`}
          </CustomButton>
        )}
        <div
          style={{
            height: '100%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              overflowY: 'auto',
              height: '100%',
              width: '100%',
              border: theme.border.dashed,
              borderRadius: theme.radius.secondary,
              boxSizing: 'border-box',
              '& .item': {
                '&:hover': {
                  backgroundColor: theme.active.primary
                }
              },
            }}
          >
            {
              reservations.map((reservation, key) => {
                return <ReservationItem data={reservation} key={key} onClick={handleClickReservation} onEdit={handleEditReservation} onDelete={handleDeleteReservation} />
              })
            }
          </Box>
        </div>
      </Box>
    </div>
  )
}

export const ReservationItem = ({ data, onClick, onEdit, onDelete }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()

  const handleEdit = (event) => {
    event.stopPropagation()
    onEdit && onEdit(data._id)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    onDelete && onDelete(data._id)
  }

  return (
    <div className='item' onClick={() => onClick && onClick(data._id)} style={{
      display: 'flex',
      padding: '7px 10px 7px 7px',
      marginBottom: 1,
      cursor: 'pointer',
      minWidth: 270
     }}>
      <div style={{ marginRight: 10, display: 'flex', gap: 5 }}>
        <span
          style={{
            backgroundColor: data?.status === 'reserved' ? theme.color.warning : theme.color.error,
            height: '100%',
            width: 5,
            display: 'block',
            borderRadius: 2,
            boxShadow: theme.shadow.inset,
          }}
        ></span>
        <CircleIcon icon={data?.customer?.picture?.filename} />
      </div>
      <div style={{ flex: '30%', display: 'flex', flexDirection: 'column' }}>
        <TextEllipsis
          style={{ fontSize: theme.responsive[device]?.text.secondary }}
        >
          {data?.customer?.displayName || language['GENERAL']}
        </TextEllipsis>
        <div style={{ display: 'flex' }}>
          <PhoneEnabledRoundedIcon
            style={{
              fontSize: 14,
              color: theme.text.quaternary,
              marginRight: 5,
            }}
          />
          <TextEllipsis
            style={{
              color: theme.text.quaternary,
              fontSize: theme.responsive[device]?.text.quaternary,
            }}
          >
            {data?.customer?.contact}
          </TextEllipsis>
        </div>
      </div>
      <div style={{ flex: '40%', display: 'flex', flexDirection: 'column' }}>
        <TextEllipsis
          style={{ fontSize: theme.responsive[device]?.text.secondary }}
        >
          {timeFormat(data?.startAt, 'LT')} - {timeFormat(data?.endAt || data?.startAt, 'LT')}
        </TextEllipsis>
        <TextEllipsis
          style={{
            color: theme.text.quaternary,
            fontSize: theme.responsive[device]?.text.quaternary,
          }}
        >
          {combineDate(data?.startAt, data?.endAt || data?.startAt)}
        </TextEllipsis>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onEdit && <IconButton
          onClick={handleEdit}
          sx={{
            width: 30,
            height: 30,
            color: `${theme.color.info}cc`,
            '&:hover': { color: theme.color.info },
          }}
        >
          <Edit style={{ fontSize: 17 }} />
        </IconButton>}
        {onDelete && <IconButton
          onClick={handleDelete}
          sx={{
            width: 30,
            height: 30,
            color: `${theme.color.error}cc`,
            '&:hover': { color: theme.color.error },
          }}
        >
          <DeleteRoundedIcon style={{ fontSize: 19 }} />
        </IconButton>}
      </div>
    </div>
  )
}

const ReservationForm = ({ onClose, onClickCustomer, customer, structures, onSave, defaultValues, id }) => {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reservationSchema),
    defaultValues,
  })
  const { language } = useLanguage()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { device } = useWeb()
  const [priceValue, setPriceValue] = useState(0)
  const [priceCurrency, setPriceCurrency] = useState('')
  const priceCurrencyValue = watch('price.currency')
  const { notify } = useNotify()
  const startAt = watch('startAt')
  const endAt = watch('endAt')

  useEffect(() => {
    const start = moment(startAt)
    const end = moment(endAt)
    if (isNaN(end.diff(start))) return
    const duration = end.diff(start) / 3600000
    
    setValue('price.value', priceValue * duration)
  }, [startAt, endAt, priceValue, getValues, setValue])

  useEffect(() => {
    reset(defaultValues)
  }, [reset, defaultValues])

  useEffect(() => {
    setPriceCurrency(priceCurrencyValue || 'USD')
  }, [priceCurrencyValue])

  const handleChangeSelect = (event) => {
    setValue(event.target.name, event.target.value)
  }

  useEffect(() => {
    setValue('customer', customer?.id)
  }, [customer, setValue])

  useEffect(() => {
    setValue('structures', structures)
    const { price } = calculateStructuresPrice(structures, user?.drawer?.buyRate)
    
    setPriceValue(price)
    setValue('price', { value: price.toFixed(3), currency: 'USD', duration: '1h' })
  }, [structures, user?.drawer?.buyRate, setValue, getValues])

  const submit = (data) => {
    Axios({
        method: id ? 'PUT' : 'POST',
        url: id ? `/sale/reservation/update/${id}` : '/sale/reservation/create',
        body: data
    })
        .then((data) => {
            notify(data?.data?.msg, 'success')
            onSave()
        })
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateAreas: `'from from to to''customer customer customer price''note note note note''action action action action'`,
        gridColumnGap: 20,
        padding: 13,
        backgroundColor: `${theme.background.primary}cc`,
        borderRadius: theme.radius.secondary
      }}
    >
      <div style={{ gridArea: 'from' }}>
        <MiniTextField
          type='datetime-local'
          label={language['FROM']}
          err={errors?.startAt?.message}
          {...register('startAt')}
        />
      </div>
      <div style={{ gridArea: 'to' }}>
        <MiniTextField
          type='datetime-local'
          label={language['TO']}
          err={errors?.endAt?.message}
          {...register('endAt')}
        />
      </div>
      <div style={{ gridArea: 'customer' }}>
        <div
          style={{
            height: '100%',
            padding: '20px 0 10px 0',
            boxSizing: 'border-box',
          }}
        >
          <Box
            onClick={() => onClickCustomer()}
            sx={{
              position: 'relative',
              height: 35,
              width: '100%',
              border: errors?.customer ? `1px solid ${theme.color.error}` : theme.border.quaternary,
              borderRadius: theme.radius.primary,
              padding: '5px 15px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              transition: '0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                border: theme.border.tertiary,
              },
              '&:hover span': {
                color: `${theme.text.secondary} !important`,
              },
              '& .input-error': {
                color: theme.color.error,
                position: 'absolute',
                bottom: -16,
                left: 7,
                fontSize: theme.responsive[device]?.text.quaternary
              }
            }}
          >
            <span
              style={{ color: customer?.displayName ? theme.text.primary : theme.text.quaternary, transition: '0.2s ease' }}
            >
              {customer?.displayName || language['CUSTOMER']}
            </span>
            {errors?.customer && <TextEllipsis className='input-error'>{errors?.customer?.message}</TextEllipsis>}
          </Box>
        </div>
      </div>
      <div style={{ gridArea: 'price' }}>
        <MiniTextField
          type='number'
          label={language['PRICE']}
          step='any'
          err={errors?.price?.value?.message}
          {...register('price.value')}
          icon={
            <MiniSelectField
              options={currencyOptions}
              err={errors?.price?.currency?.message}
              name='price.currency'
              onChange={handleChangeSelect}
              value={priceCurrency}
              sx={{
                position: 'absolute',
                top: -12,
                right: -43,
                height: 23,
                '& .MuiSelect-select': {
                  position: 'absolute',
                  top: -2,
                },
                '& .MuiSvgIcon-root': {
                  right: 33,
                },
              }}
            />
          }
        />
      </div>
      <div style={{ gridArea: 'note' }}>
        <MiniDetailField
          label={language['NOTE']}
          style={{ height: 70 }}
          {...register('note')}
        />
      </div>
      <div
        style={{
          gridArea: 'action',
          marginTop: 10,
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          onClick={() => onClose()}
          style={{
            color: theme.color.error,
            backgroundColor: `${theme.color.error}22`,
          }}
          fullWidth
        >
          {language['CANCEL']}
        </Button>
        <Button
          type='submit'
          style={{
            marginLeft: 20,
            color: theme.color.info,
            backgroundColor: `${theme.color.info}22`,
          }}
          fullWidth
        >
          {id ? language['SAVE'] : language['CREATE']}
        </Button>
      </div>
    </form>
  )
}
