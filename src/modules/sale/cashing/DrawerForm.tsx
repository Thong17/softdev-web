import { AlertContainer } from 'components/shared/container/AlertContainer'
import useTheme from 'hooks/useTheme'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { drawerSchema } from 'shared/schema'
import Button from 'components/shared/Button'
import { MiniTextField, NanoInput } from 'components/shared/form/InputField'
import { DialogTitle } from 'components/shared/DialogTitle'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { MenuItem, IconButton } from '@mui/material'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import React, { useEffect, useState } from 'react'
import { currencyFormat, generateId } from 'utils'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { MiniSelectField } from 'components/shared/form'
import { currencyOptions } from 'components/shared/form/InvoiceForm'
import useAlert from 'hooks/useAlert'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { QuantityStatus } from 'components/shared/QuantityStatus'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { MenuDialog } from 'components/shared/MenuDialog'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListPresetCash, selectListPresetCash } from 'shared/redux'
import { IOptions } from 'components/shared/form/SelectField'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import useAuth from 'hooks/useAuth'
import { ValueLabel } from 'components/shared/ValueLabel'
import { QuantityField } from 'components/shared/form/QuantityField'
import useLanguage from 'hooks/useLanguage'

const initCash = {
  cash: 0,
  total: 0,
  currency: 'USD',
  quantity: 1,
}

const CashItem = ({ data, onRemove }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 7,
        borderRadius: theme.radius.ternary,
        border: theme.border.quaternary,
        backgroundColor: data.origin
          ? theme.background.primary
          : theme.background.secondary,
      }}
    >
      <span style={{ flex: '38%' }}>
        <div
          style={{
            width: 'fit-content',
            padding: '5px 10px 5px 5px',
            borderRadius: theme.radius.secondary,
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <ValueLabel
            icon={
              <PaymentsRoundedIcon
                style={{
                  margin: '0 10px 0 5px',
                  fontSize: 15,
                  color: theme.text.quaternary,
                }}
              />
            }
            value={currencyFormat(parseFloat(data.cash), data.currency)}
          />
        </div>
      </span>
      <div style={{ flex: '20%' }}>
        <QuantityStatus
          qty={data.quantity}
          min={10}
          label={language['QTY']}
          padding='6px 11px 6px 7px'
        />
      </div>
      <div
        style={{
          flex: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            backgroundColor: theme.background.secondary,
            width: 'fit-content',
            padding: '5px 10px',
            borderRadius: theme.radius.secondary,
          }}
        >
          <ValueLabel
            label={language['TOTAL']}
            value={currencyFormat(parseFloat(data.total), data.currency)}
          />
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

export const DrawerForm = ({ dialog, setDialog }: any) => {
  const confirm = useAlert()
  const { user, reload } = useAuth()
  const { theme } = useTheme()
  const { device, width } = useWeb()
  const { notify } = useNotify()
  const {
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(drawerSchema),
  })
  const { language } = useLanguage()
  const [cashObj, setCashObj] = useState(initCash)
  const [listCash, setListCash] = useState<any[]>(
    user?.drawer?.cashes.map((cash) => ({ ...cash, origin: true })) || []
  )
  const [cashForm, setCashForm] = useState(false)
  const [templateInput, setTemplateInput] = useState('')
  const { data: listPresetCash, status: statusListPresetCash } =
    useAppSelector(selectListPresetCash)
  const dispatch = useAppDispatch()
  const [presetCashOption, setPresetCashOption] = useState<IOptions[]>([])

  useEffect(() => {
    setValue('sellRate', user?.drawer?.sellRate)
    setValue('buyRate', user?.drawer?.buyRate)
  }, [user?.drawer?.sellRate, user?.drawer?.buyRate, setValue])

  useEffect(() => {
    dispatch(getListPresetCash())
  }, [dispatch])

  useEffect(() => {
    setListCash(user?.drawer?.cashes.map((cash) => ({ ...cash, origin: true })) || [])
  }, [user?.drawer?.cashes])
  
  useEffect(() => {
    if (statusListPresetCash !== 'SUCCESS') return
    setPresetCashOption(
      listPresetCash.map((presetCash: any) => ({
        label: presetCash.name,
        value: presetCash._id,
      }))
    )
  }, [statusListPresetCash, listPresetCash])

  const submit = (data) => {
    Axios({
      method: 'POST',
      url: '/sale/drawer/open',
      body: { ...data, cashes: listCash },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        setListCash(prev => prev.map((cash) => ({ ...cash, origin: true })))
        reload()
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
    setListCash([...listCash, { ...cashObj, id: generateId(), totalQuantity: cashObj.quantity }])
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

  const handleAddCashTemplate = (event) => {
    event.stopPropagation()
    if (templateInput === '') return
    Axios({
      url: '/organize/preset/create',
      method: 'POST',
      body: {
        name: templateInput,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(getListPresetCash())
        setTemplateInput('')
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleClickPresetCash = (event) => {
    const id = event.target.id
    const preset = listPresetCash.find((preset) => preset._id === id)
    setListCash(preset?.cashes || [])
  }

  const handleSavePresetCash = (event) => {
    const id = event.target.id
    confirm({
      title: 'Are you sure you want to save to this preset?',
      description:
        'This will override your existing selected preset. Click on confirm to proceed',
      variant: 'info',
    })
      .then(() => {
        Axios({
          url: `/organize/preset/save/${id}`,
          method: 'PUT',
          body: {
            cashes: listCash,
          },
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            dispatch(getListPresetCash())
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {})
  }

  const handleDeletePreset = (id) => {
    confirm({
      title: 'Are you sure you want to delete this preset?',
      description:
        'This will delete the selected preset. Click on confirm to proceed',
      variant: 'error',
    })
      .then(() => {
        Axios({
          url: `/organize/preset/delete/${id}`,
          method: 'DELETE',
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            dispatch(getListPresetCash())
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {})
  }

  const handleSaveDrawer = () => {
    confirm({
      title: 'Are you sure you want to save this drawer?',
      description: 'This will save the drawer. Click on confirm to proceed',
      variant: 'info',
    })
      .then(() => {
        Axios({
          url: `/sale/drawer/save/${user?.drawer?._id}`,
          method: 'PUT',
          body: { ...getValues(), cashes: listCash },
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            setListCash((prev) =>
              prev.map((cash) => ({ ...cash, origin: true }))
            )
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {})
  }

  const handleStopDrawer = () => {
    confirm({
      title: 'Are you sure you want to close this drawer?',
      description: 'This will close the drawer. Click on confirm to proceed',
      variant: 'error',
    })
      .then(() => {
        Axios({
          url: `/sale/drawer/close/${user?.drawer?._id}`,
          method: 'PUT',
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            setListCash([])
            reload()
            reset()
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
      })
      .catch(() => {})
  }

  return (
    <AlertContainer
      justify='center'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          height: '100vh',
          width: width > 1024 ? '50vw' : 'calc(100vw - 64px)',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle title={language['DRAWER']} onClose={handleCloseDialog} />
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas: `'buyRate sellRate'`,
            gridColumnGap: 20,
            padding: '5px 20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ gridArea: 'buyRate' }}>
            <MiniTextField
              type='number'
              step='any'
              label={language['BUY_RATE']}
              err={errors?.buyRate?.message}
              {...register('buyRate')}
            />
          </div>
          <div style={{ gridArea: 'sellRate' }}>
            <MiniTextField
              type='number'
              step='any'
              label={language['SELL_RATE']}
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
              zIndex: 100,
            }}
          >
            {user?.drawer ? (
              <Button
                onClick={handleStopDrawer}
                style={{
                  color: theme.color.error,
                  backgroundColor: `${theme.color.error}22`,
                  borderRadius: theme.radius.secondary,
                }}
                fullWidth
              >
                {language['STOP']}
              </Button>
            ) : (
              <Button
                onClick={handleCloseDialog}
                style={{
                  color: theme.color.error,
                  backgroundColor: `${theme.color.error}22`,
                  borderRadius: theme.radius.secondary,
                }}
                fullWidth
              >
                {language['CANCEL']}
              </Button>
            )}
            {user?.drawer ? (
              <Button
                onClick={handleSaveDrawer}
                style={{
                  marginLeft: 10,
                  color: theme.color.info,
                  backgroundColor: `${theme.color.info}22`,
                  borderRadius: theme.radius.secondary,
                }}
                fullWidth
              >
                {language['SAVE']}
              </Button>
            ) : (
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
                {language['START']}
              </Button>
            )}
          </div>
        </form>
        <div
          style={{
            margin: '0 20px 0 20px',
            boxSizing: 'border-box',
            height: '100%',
            paddingBottom: 65,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
                {language['CASH']}
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
              <MenuDialog
                style={{ color: theme.text.secondary, width: 30, height: 30 }}
                label={<AppRegistrationRoundedIcon style={{ fontSize: 19 }} />}
              >
                <MenuItem
                  style={{ width: 200, padding: '5px 5px 5px 10px' }}
                  onClick={handleAddCashTemplate}
                >
                  <NanoInput
                    onClick={(event) => event.stopPropagation()}
                    value={templateInput}
                    onChange={(event) => setTemplateInput(event.target.value)}
                    width='100%'
                    placeholder={language['NAME']}
                  />
                  <IconButton
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 5,
                      color: theme.color.info,
                    }}
                  >
                    <AddRoundedIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </MenuItem>
                {presetCashOption.map((preset, key) => (
                  <MenuItem
                    onClick={handleClickPresetCash}
                    key={key}
                    id={preset.value}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '5px 5px 5px 15px',
                    }}
                  >
                    {preset.label}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => handleDeletePreset(preset.value)}
                        style={{
                          width: 30,
                          height: 30,
                          color: theme.color.error,
                        }}
                      >
                        <CloseRoundedIcon style={{ fontSize: 18 }} />
                      </IconButton>
                    </div>
                  </MenuItem>
                ))}
              </MenuDialog>
              <MenuDialog
                style={{ color: theme.text.secondary, width: 30, height: 30 }}
                label={<SaveRoundedIcon style={{ fontSize: 18 }} />}
              >
                {presetCashOption.map((preset, key) => (
                  <MenuItem
                    onClick={handleSavePresetCash}
                    key={key}
                    id={preset.value}
                  >
                    {preset.label}
                  </MenuItem>
                ))}
              </MenuDialog>
              <IconButton
                onClick={() => setCashForm(!cashForm)}
                style={{
                  color: theme.text.secondary,
                  width: 30,
                  height: 30,
                  marginRight: 10,
                }}
              >
                {cashForm ? (
                  <CloseRoundedIcon style={{ fontSize: 21 }} />
                ) : (
                  <AddRoundedIcon style={{ fontSize: 23 }} />
                )}
              </IconButton>
            </div>
          </div>
          <div style={{ position: 'relative', height: '100%' }}>
            <div
              className='money-container'
              style={{
                border: theme.border.dashed,
                boxSizing: 'border-box',
                borderRadius: theme.radius.quaternary,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                gap: 10,
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: '100%',
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
                      step='any'
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
                    <QuantityField
                      value={cashObj.quantity}
                      onChange={(value) =>
                        setCashObj((prev) => {
                          return {
                            ...prev,
                            quantity: value,
                            total: prev.cash * value,
                          }
                        })
                      }
                    />
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
                        step='any'
                        name='total'
                        placeholder={language['TOTAL']}
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
      </div>
    </AlertContainer>
  )
}
