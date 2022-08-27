import { AlertContainer } from 'components/shared/container/AlertContainer'
import useTheme from 'hooks/useTheme'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from 'shared/schema'
import Button from 'components/shared/Button'
import { MiniTextField, NanoInput } from 'components/shared/form/InputField'
import { DialogTitle } from 'components/shared/DialogTitle'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { MenuItem, IconButton } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { MiniSearchField } from 'components/shared/table/SearchField'
import { MiniFilterButton } from 'components/shared/table/FilterButton'
import React, { useEffect, useState } from 'react'
import { currencyFormat, debounce, generateId } from 'utils'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { MiniSelectField } from 'components/shared/form'
import { currencyOptions } from 'components/shared/form/InvoiceForm'
import useAlert from 'hooks/useAlert'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { QuantityStatus } from 'components/shared/QuantityStatus'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const initCash = {
  cash: 0,
  total: 0,
  currency: 'USD',
  quantity: 1,
}

export const DrawerForm = ({ dialog, setDialog, defaultValues }: any) => {
  const confirm = useAlert()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { notify } = useNotify()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues,
  })
  const [search, setSearch] = useState('')
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
  })
  const [filterObj, setFilterObj] = useState<any>({
    filter: 'createdAt',
    asc: false,
  })
  const [cashObj, setCashObj] = useState(initCash)
  const [listCash, setListCash] = useState<any[]>([])
  const [cashForm, setCashForm] = useState(false)

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    setFilterObj({ filter, asc: sortObj[filter] })
  }

  const updateQuery = debounce((value) => {
    setSearch(value)
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  useEffect(() => {
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('filter', filterObj.filter)
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
  }, [filterObj.asc, filterObj.filter, search])

  const submit = (data) => {
    Axios({
      method: 'POST',
      url: '/organize/customer/create',
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        reset()
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const handleChangeCash = (event) => {
    const { name, value } = event.target

    switch (name) {
      case 'cash':
        setCashObj((prev) => {
          return {
            ...prev,
            cash: value,
            total: value * prev.quantity,
          }
        })
        break

      case 'total':
        setCashObj((prev) => {
          return {
            ...prev,
            cash: value / prev.quantity,
            total: value,
          }
        })
        break

      case 'currency':
        setCashObj((prev) => {
          return {
            ...prev,
            currency: value,
          }
        })
        break

      default:
        setCashObj((prev) => {
          return {
            ...prev,
            cash: prev.cash,
            quantity: value,
            total: prev.cash * value,
          }
        })
        break
    }
  }

  const handleAddCash = () => {
    if (cashObj.total <= 0) return notify('Please input cash to add', 'error')
    setListCash([...listCash, { ...cashObj, id: generateId() }])
    setCashObj(initCash)
  }

  const handleRemoveCash = (id) => {
    confirm({
      title: 'Are you sure you want to remove this cash?',
      description:
        'The selected cash will be remove from the list. Click the confirm button to proceed.',
      variant: 'error',
    })
      .then(() => setListCash((prev) => prev.filter((cash) => cash.id !== id)))
      .catch(() => {})
  }

  const handleOnFocus = (event) => event.target.select()

  return (
    <AlertContainer
      justify='center'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          height: '100vh',
          width: '50vw',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <DialogTitle title='Drawer' onClose={handleCloseDialog} />
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas: `'buyRate sellRate'`,
            gridColumnGap: 20,
            padding: '5px 20px',
          }}
        >
          <div style={{ gridArea: 'buyRate' }}>
            <MiniTextField
              type='number'
              label='Buy Rate'
              err={errors?.buyRate?.message}
              {...register('buyRate')}
            />
          </div>
          <div style={{ gridArea: 'sellRate' }}>
            <MiniTextField
              type='number'
              label='Sell Rate'
              err={errors?.sellRate?.message}
              {...register('sellRate')}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 10,
              width: '100%',
              display: 'flex',
              boxSizing: 'border-box',
            }}
          >
            <Button
              style={{
                color: theme.color.info,
                backgroundColor: `${theme.color.info}22`,
                borderRadius: theme.radius.secondary,
              }}
              fullWidth
            >
              Save to
            </Button>
            <Button
              style={{
                marginLeft: 10,
                color: theme.color.error,
                backgroundColor: `${theme.color.error}22`,
                borderRadius: theme.radius.secondary,
              }}
              fullWidth
            >
              Stop
            </Button>
            <Button
              type='submit'
              style={{
                marginLeft: 10,
                color: theme.color.success,
                backgroundColor: `${theme.color.success}22`,
                borderRadius: theme.radius.secondary,
              }}
              fullWidth
            >
              Start
            </Button>
          </div>
        </form>
        <div style={{ margin: '0 20px 0 20px', boxSizing: 'border-box' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: theme.responsive[device]?.text.h4,
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowRightRoundedIcon fontSize='large' />
              <span
                style={{ fontSize: theme.responsive[device]?.text.primary }}
              >
                Cash
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                width: 'fit-content',
              }}
            >
              <MiniSearchField onChange={handleSearch} />
              <MiniFilterButton>
                <MenuItem
                  onClick={() => handleChangeFilter({ filter: 'name' })}
                >
                  <SortIcon asc={sortObj.name} /> By Name
                </MenuItem>
                <MenuItem
                  onClick={() => handleChangeFilter({ filter: 'createdAt' })}
                >
                  <SortIcon asc={sortObj.createdAt} /> By Date
                </MenuItem>
              </MiniFilterButton>
              <IconButton
                style={{
                  color: theme.text.secondary,
                  width: 30,
                  height: 30,
                }}
              >
                <AppRegistrationRoundedIcon style={{ fontSize: 19 }} />
              </IconButton>
              <IconButton
                onClick={() => setCashForm(!cashForm)}
                style={{
                  color: theme.text.secondary,
                  width: 30,
                  height: 30,
                  marginRight: 10,
                }}
              >
                {cashForm ? <CloseRoundedIcon style={{ fontSize: 21 }} /> : <AddRoundedIcon style={{ fontSize: 23 }} />}
              </IconButton>
            </div>
          </div>
          <div
            className='money-container'
            style={{
              height: '64vh',
              border: theme.border.dashed,
              boxSizing: 'border-box',
              borderRadius: theme.radius.quaternary,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {cashForm && (
              <div
                style={{
                  width: '100%',
                  backgroundColor: theme.background.secondary,
                  borderRadius: theme.radius.ternary,
                  padding: 8,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                }}
              >
                <div style={{ position: 'relative', width: '30%' }}>
                  <NanoInput
                    type='number'
                    name='cash'
                    placeholder='Cash'
                    width='100%'
                    value={cashObj.cash}
                    onChange={handleChangeCash}
                    onFocus={handleOnFocus}
                    icon={
                      <div style={{ position: 'absolute', right: 0 }}>
                        <MiniSelectField
                          value={cashObj.currency}
                          onChange={handleChangeCash}
                          options={currencyOptions}
                          name='currency'
                          width={33}
                          sx={{
                            position: 'absolute',
                            top: -27,
                            right: -2,
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
                      </div>
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '20%',
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setCashObj((prev) => {
                        const quantity =
                          prev.quantity > 1 ? prev.quantity - 1 : prev.quantity
                        return {
                          ...prev,
                          quantity,
                          total: prev.cash * quantity,
                        }
                      })
                    }
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  >
                    <RemoveRoundedIcon
                      style={{ fontSize: 16, color: theme.text.secondary }}
                    />
                  </IconButton>
                  <NanoInput
                    type='number'
                    name='quantity'
                    placeholder='Unit'
                    width='100%'
                    value={cashObj.quantity}
                    onChange={handleChangeCash}
                    onFocus={handleOnFocus}
                  />
                  <IconButton
                    onClick={() =>
                      setCashObj((prev) => {
                        const quantity =
                          typeof prev.quantity === 'string'
                            ? parseInt(prev.quantity || 1) + 1
                            : prev.quantity + 1
                        return {
                          ...prev,
                          quantity,
                          total: prev.cash * quantity,
                        }
                      })
                    }
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  >
                    <AddRoundedIcon
                      style={{ fontSize: 16, color: theme.text.secondary }}
                    />
                  </IconButton>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '50%',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <NanoInput
                      type='number'
                      name='total'
                      placeholder='Total'
                      width='100%'
                      value={cashObj.total}
                      onChange={handleChangeCash}
                      onFocus={handleOnFocus}
                      icon={
                        <div style={{ position: 'absolute', right: 0 }}>
                          <MiniSelectField
                            value={cashObj.currency}
                            onChange={handleChangeCash}
                            options={currencyOptions}
                            name='currency'
                            width={33}
                            sx={{
                              position: 'absolute',
                              top: -27,
                              right: -2,
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
                        </div>
                      }
                    />
                  </div>
                  <IconButton
                    onClick={() => setCashForm(false)}
                    style={{
                      color: theme.color.error,
                      width: 30,
                      height: 30,
                      marginLeft: 10,
                    }}
                  >
                    <CloseRoundedIcon style={{ fontSize: 19 }} />
                  </IconButton>
                  <IconButton
                    onClick={handleAddCash}
                    style={{
                      color: theme.color.info,
                      width: 30,
                      height: 30,
                    }}
                  >
                    <CheckRoundedIcon style={{ fontSize: 19 }} />
                  </IconButton>
                </div>
              </div>
            )}
            {listCash.map((item: any, key) => (
              <CashItem data={item} key={key} onRemove={handleRemoveCash} />
            ))}
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}

const CashItem = ({ data, onRemove }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 7,
        borderRadius: theme.radius.ternary,
        border: theme.border.quaternary
      }}
    >
      <span style={{ flex: '38%' }}>
        <div style={{ backgroundColor: theme.background.secondary, width: 'fit-content', padding: '5px 10px 5px 5px', borderRadius: theme.radius.secondary, display: 'flex', alignItems: 'end' }}>
          <PaymentsRoundedIcon style={{ margin: '0 10px 0 5px', fontSize: 15, color: theme.text.quaternary }} />
          {currencyFormat(parseFloat(data.cash), data.currency)}
        </div>
      </span>
      <div style={{ flex: '20%' }}>
        <QuantityStatus qty={data.quantity} min={10} label='Unit' padding='6px 11px 6px 7px' />
      </div>
      <div
        style={{
          flex: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ backgroundColor: theme.background.secondary, width: 'fit-content', padding: '5px 10px', borderRadius: theme.radius.secondary }}>
          <span
            style={{
              color: theme.text.quaternary,
              fontSize: theme.responsive[device]?.text.quaternary,
            }}
          >
            Total
          </span>{' '}
          {currencyFormat(parseFloat(data.total), data.currency)}
        </div>
        <IconButton
          onClick={() => onRemove(data.id)}
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
