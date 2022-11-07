import { useEffect, useState } from 'react'
import { MiniSelectField } from '.'
import { NanoInput, TextField } from './InputField'
import { currencyOptions, discountOptions } from './InvoiceForm'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { Box } from '@mui/system'
import { currencyFormat, generateId } from 'utils'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { ValueLabel } from '../ValueLabel'
import { QuantityField } from './QuantityField'
import useLanguage from 'hooks/useLanguage'
import { useForm } from 'react-hook-form'
import { CustomerField } from './CustomerField'
import { Section } from '../Section'
import { durationOptions } from 'modules/organize/store/StructureForm'
import { presetCashes } from './CashForm'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const initCash = { value: '0', currency: 'USD', quantity: 1 }

export const loanSchema = yup.object().shape({
  customer: yup.string().required(),
  attachments: yup.mixed().optional(),
  duration: yup.object({
    value: yup.number().required('Duration is required'),
    time: yup.string().required('Time is required'),
  }),
  interest: yup.object({
    value: yup.number().required('Price is required'),
    currency: yup.string().required('Currency is required'),
  }),
  overdue: yup.object({
    value: yup.number().required('Price is required'),
    currency: yup.string().required('Currency is required'),
  }),
  prepayment: yup.object({
    value: yup.number().required('Price is required'),
    currency: yup.string().required('Currency is required'),
  })
})

const defaultValues = {
  duration: { value: 1, time: '1d' },
  interest: { value: 1, currency: 'PCT' },
  overdue: { value: 1, currency: 'PCT' },
  prepayment: { value: 1, currency: 'PCT' },
  customer: '',
  attachment: null
}

const CastPreset = ({ theme, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        alignItems: 'center',
        gridColumnGap: 10,
        boxSizing: 'border-box',
        '& .money': {
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          padding: '0 10px',
          backgroundColor: theme.background.secondary,
          borderRadius: theme.radius.primary,
          cursor: 'pointer',
          lineHeight: 1,
        },
      }}
    >
      {presetCashes.map((cash, key) => (
        <div
          className='money'
          onClick={() => onClick(cash)}
          key={key}
          style={{ color: cash.color, backgroundColor: `${cash.color}22` }}
        >
          {currencyFormat(cash.value, cash.currency)}
        </div>
      ))}
    </Box>
  )
}

export const LoanForm = ({ onChange, customer, loanButtonRef }: any) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [cashForm, setCashForm] = useState(initCash)
  const [cashes, setCashes] = useState<any[]>([])
  const {
    handleSubmit,
  } = useForm({})
  const {
    handleSubmit: handleSubmitLoan,
    register,
    setValue,
    watch,
    formState: { errors: errorsLoan }
  } = useForm({
    resolver: yupResolver(loanSchema),
    defaultValues
  })
  const [durationTime, setDurationTime] = useState(defaultValues.duration.time)
  const [interestCurrency, setInterestCurrency] = useState(defaultValues.interest.currency)
  const [overdueCurrency, setOverdueCurrency] = useState(defaultValues.overdue.currency)
  const [prepaymentCurrency, setPrepaymentCurrency] = useState(defaultValues.prepayment.currency)

  const durationTimeValue = watch('duration.time')
  const interestCurrencyValue = watch('interest.currency')
  const overdueCurrencyValue = watch('overdue.currency')
  const prepaymentCurrencyValue = watch('prepayment.currency')

  useEffect(() => {
    setDurationTime(durationTimeValue)
  }, [durationTimeValue])

  useEffect(() => {
    setInterestCurrency(interestCurrencyValue)
  }, [interestCurrencyValue])

  useEffect(() => {
    setOverdueCurrency(overdueCurrencyValue)
  }, [overdueCurrencyValue])

  useEffect(() => {
    setPrepaymentCurrency(prepaymentCurrencyValue)
  }, [prepaymentCurrencyValue])

  const submit = (event) => {
    event.preventDefault()
    const newCashes = [...cashes, { ...cashForm, id: generateId() }]
    onChange(newCashes)
    setCashes(newCashes)
  }

  const handleRemoveCash = (id) => {
    const newCashes = cashes.filter((cash) => cash.id !== id)
    onChange(newCashes)
    setCashes(newCashes)
  }

  const handleChangeQuantity = (id, value) => {
    const newCashes = cashes.map((cash) =>
      cash.id === id ? { ...cash, quantity: value } : cash
    )
    onChange(newCashes)
    setCashes(newCashes)
  }

  const handleAddPreset = (cash) => {
    const newCashes = [...cashes, { ...cash, id: generateId() }]
    onChange(newCashes)
    setCashes(newCashes)
  }
  
  const handleChangeCustomer = (data) => {
    setValue('customer', data.id)
  }

  const submitLoan = (data) => {
    console.log(data)
  }

  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative' }}>
            <NanoInput
              onChange={(event) =>
                setCashForm({ ...cashForm, value: event.target.value })
              }
              onFocus={(event) => event.target.select()}
              type='number'
              label='Price'
              height={33}
              width={230}
              placeholder='Cash'
              value={cashForm.value}
              icon={
                <div
                  style={{ position: 'absolute', right: 0, display: 'flex' }}
                >
                  <MiniSelectField
                    onChange={(event) =>
                      setCashForm({
                        ...cashForm,
                        currency: event.target.value as string,
                      })
                    }
                    value={cashForm.currency}
                    options={currencyOptions}
                    name='currency'
                    width={33}
                    sx={{
                      position: 'absolute',
                      top: -30,
                      right: 23,
                      height: 23,
                      '& div': {
                        paddingRight: '0 !important',
                      },
                      '& .MuiSelect-select': {
                        position: 'absolute',
                        top: -2,
                      },
                      '& .MuiSvgIcon-root': {
                        top: -1,
                        right: 0,
                      },
                    }}
                  />
                  <IconButton
                    type='submit'
                    style={{
                      width: 30,
                      height: 30,
                      color: theme.text.secondary,
                      position: 'absolute',
                      top: -31,
                      right: 1,
                    }}
                  >
                    <AddRoundedIcon style={{ fontSize: 18 }} />
                  </IconButton>
                </div>
              }
            />
          </div>
        </form>
        <CastPreset theme={theme} onClick={handleAddPreset} />
      </div>
      <div
        style={{
          position: 'relative',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflowY: 'auto',
            boxSizing: 'border-box',
            maxHeight: '100%',
            width: '100%',
            position: 'absolute',
          }}
        >
          {cashes?.map((cash, key) => (
            <CashItem
              key={key}
              cash={cash}
              onRemove={handleRemoveCash}
              onChange={handleChangeQuantity}
            />
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmitLoan(submitLoan)}
        style={{
          backgroundColor: theme.background.primary,
          borderRadius: theme.radius.secondary,
          padding: 20,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'customer attachment attachment attachment'
                            'duration duration interest interest'
                            'penalty penalty penalty penalty'
                            'action action action action'
                            `,
        }}
      >
        <div style={{ gridArea: 'customer' }}>
          <CustomerField err={errorsLoan?.customer?.message} onChange={handleChangeCustomer} />
        </div>
        <div style={{ gridArea: 'attachment' }}>
          <TextField
            type='file'
            label={language['ATTACHMENT']}
            style={{ paddingTop: 7 }}
            {...register('attachment')}
          />
        </div>
        <div style={{ gridArea: 'duration' }}>
          <TextField
            type='text'
            err={errorsLoan?.duration?.value?.message || errorsLoan?.duration?.time?.message}
            label={language['DURATION']}
            {...register('duration.value')}
            icon={
              <>
                <MiniSelectField
                  options={durationOptions}
                  value={durationTime}
                  onChange={(event) => setValue('duration.time', event.target.value as string)}
                  sx={{
                    position: 'absolute',
                    top: -1,
                    right: -38,
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
              </>
            }
          />
        </div>
        <div style={{ gridArea: 'interest' }}>
          <TextField
            type='number'
            label={language['INTEREST']}
            err={errorsLoan?.interest?.value?.message || errorsLoan?.interest?.currency?.message}
            {...register('interest.value')}
            icon={
              <>
                <MiniSelectField
                  options={discountOptions}
                  value={interestCurrency}
                  onChange={(event) => setValue('interest.currency', event.target.value as string)}
                  sx={{
                    position: 'absolute',
                    top: -1,
                    right: -38,
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
              </>
            }
          />
        </div>
        <div style={{ gridArea: 'penalty', marginTop: 20 }}>
          <Section describe={language['PENALTY']}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
                gridColumnGap: 20,
              }}
            >
              <div>
                <TextField
                  type='number'
                  label={language['OVERDUE']}
                  err={errorsLoan?.overdue?.value?.message || errorsLoan?.overdue?.currency?.message}
                  {...register('overdue.value')}
                  icon={
                    <>
                      <MiniSelectField
                        options={discountOptions}
                        value={overdueCurrency}
                        onChange={(event) => setValue('overdue.currency', event.target.value as string)}
                        sx={{
                          position: 'absolute',
                          top: -1,
                          right: -38,
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
                    </>
                  }
                />
              </div>
              <div>
                <TextField
                  type='number'
                  label={language['PREPAYMENT']}
                  err={errorsLoan?.prepayment?.value?.message || errorsLoan?.prepayment?.currency?.message}
                  {...register('prepayment.value')}
                  icon={
                    <>
                      <MiniSelectField
                        options={discountOptions}
                        name='prepayment.currency'
                        value={prepaymentCurrency}
                        onChange={(event) => setValue('prepayment.currency', event.target.value as string)}
                        sx={{
                          position: 'absolute',
                          top: -1,
                          right: -38,
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
                    </>
                  }
                />
              </div>
            </div>
          </Section>
        </div>
        <button type="submit" ref={loanButtonRef} style={{ display: 'none' }}></button>
      </form>
    </div>
  )
}

const CashItem = ({ cash, onRemove, onChange }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        backgroundColor: theme.background.secondary,
        padding: '5px 10px',
        borderRadius: theme.radius.primary,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span style={{ flex: '30%' }}>
        <ValueLabel
          icon={
            <PaymentsRoundedIcon
              style={{
                margin: '0 5px',
                fontSize: 15,
                color: theme.text.quaternary,
              }}
            />
          }
          value={currencyFormat(parseFloat(cash.value), cash.currency)}
        />
      </span>
      <div style={{ flex: '20%' }}>
        <QuantityField
          value={cash.quantity}
          onChange={(value) => onChange(cash.id, value)}
        />
      </div>
      <div
        style={{
          flex: '50%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <ValueLabel
            label='Total'
            value={currencyFormat(
              parseFloat(cash.value) * cash.quantity,
              cash.currency
            )}
          />
        </div>
        <IconButton
          onClick={() => onRemove(cash.id)}
          style={{
            color: theme.color.error,
            width: 30,
            height: 30,
            marginLeft: 10,
          }}
        >
          <CloseRoundedIcon style={{ fontSize: 19 }} />
        </IconButton>
      </div>
    </div>
  )
}
