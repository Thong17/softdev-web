import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomButton } from 'styles/index'
import { CustomerDialog } from '../dialog/CustomerDialog'
import { RankStatus } from '../RankStatus'
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

export const ReservationContainer = () => {
  const { theme } = useTheme()
  const [customerDialog, setCustomerDialog] = useState({ open: false })
  const [customer, setCustomer] = useState({
    displayName: null,
    id: null,
    point: 0,
  })
  const [toggleForm, setToggleForm] = useState(false)
  const [structure, setStructure] = useState(null)

  const handleClickCustomer = () => {
    setCustomerDialog({ ...customerDialog, open: true })
  }

  const handleChangeCustomer = (data) => {
    console.log(data)
  }

  const handleClickStructure = (data) => {
    setStructure(data)
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
          handleChangeCustomer(data)
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
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'fit-content',
          }}
        >
          <SelectStructure onClick={handleClickStructure} />
          <RankStatus
            text={<p style={{ padding: '5px 0', marginLeft: 5 }}>17</p>}
            label='Available'
            color={theme.color.success}
          />
        </div>
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
              '& .item': {
                display: 'flex',
                padding: '7px 10px 7px 7px',
                borderRadius: theme.radius.primary,
                border: theme.border.dashed,
              },
            }}
          >
            <ReservationItem />
          </Box>
        </div>
        {toggleForm ? (
          <ReservationForm
            onClose={() => setToggleForm(false)}
            onClickCustomer={handleClickCustomer}
            customer={customer}
            structure={structure}
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
            Add Reservation
          </CustomButton>
        )}
      </Box>
    </div>
  )
}

const ReservationItem = () => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div className='item'>
      <div style={{ marginRight: 10, display: 'flex', gap: 5 }}>
        <span
          style={{
            backgroundColor: theme.color.error,
            height: '100%',
            width: 5,
            display: 'block',
            borderRadius: 2,
            boxShadow: theme.shadow.inset,
          }}
        ></span>
        <CircleIcon icon={null} />
      </div>
      <div style={{ flex: '40%', display: 'flex', flexDirection: 'column' }}>
        <TextEllipsis
          style={{ fontSize: theme.responsive[device]?.text.secondary }}
        >
          CHHAN Bunthong
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
            017 467 617
          </TextEllipsis>
        </div>
      </div>
      <div style={{ flex: '40%', display: 'flex', flexDirection: 'column' }}>
        <TextEllipsis
          style={{ fontSize: theme.responsive[device]?.text.secondary }}
        >
          6:30pm - 7:30pm
        </TextEllipsis>
        <TextEllipsis
          style={{
            color: theme.text.quaternary,
            fontSize: theme.responsive[device]?.text.quaternary,
          }}
        >
          17 Dec 2022
        </TextEllipsis>
      </div>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <IconButton
          sx={{
            width: 30,
            height: 30,
            color: `${theme.color.info}cc`,
            '&:hover': { color: theme.color.info },
          }}
        >
          <Edit style={{ fontSize: 17 }} />
        </IconButton>
      </div>
    </div>
  )
}

const initReservation: any = {
  price: { value: 0, currency: 'USD' },
  startAt: null,
  endAt: null,
  customer: null,
  note: '',
  structures: []
}

const ReservationForm = ({ onClose, onClickCustomer, customer, structure }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reservationSchema),
    defaultValues: initReservation,
  })
  const { theme } = useTheme()
  const [priceCurrency, setPriceCurrency] = useState('')
  const priceCurrencyValue = watch('price.currency')
  const { notify } = useNotify()

  useEffect(() => {
    setPriceCurrency(priceCurrencyValue || 'USD')
  }, [priceCurrencyValue])

  const handleChangeSelect = (event) => {
    setValue(event.target.name, event.target.value)
  }

  useEffect(() => {
    setValue('customer', customer.id)
  }, [customer, setValue])

  useEffect(() => {
    setValue('structures', [structure?._id])
    setValue('price', { value: structure?.price.value, currency: structure?.price.currency })
  }, [structure, setValue])

  const submit = (data) => {
    Axios({
        method: 'POST',
        url: '/sale/reservation/create',
        body: data
    })
        .then((data) => console.log(data))
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
        padding: '10px 0',
        borderTop: theme.border.dashed,
        margin: '10px 10px 0 10px',
      }}
    >
      <div style={{ gridArea: 'from' }}>
        <MiniTextField
          type='datetime-local'
          label='From'
          err={errors?.startAt?.message}
          {...register('startAt')}
        />
      </div>
      <div style={{ gridArea: 'to' }}>
        <MiniTextField
          type='datetime-local'
          label='To'
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
              height: 35,
              width: '100%',
              border: theme.border.quaternary,
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
            }}
          >
            <span
              style={{ color: customer.displayName ? theme.text.primary : theme.text.quaternary, transition: '0.2s ease' }}
            >
              {customer.displayName || 'Customer'}
            </span>
          </Box>
        </div>
      </div>
      <div style={{ gridArea: 'price' }}>
        <MiniTextField
          type='number'
          label='Price'
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
          label='Note'
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
          Cancel
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
          Save
        </Button>
      </div>
    </form>
  )
}
