import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/shared/Button'
import { DialogTitle } from 'components/shared/DialogTitle'
import { MiniSelectField, SelectField, TextField } from 'components/shared/form'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useFieldArray, useForm } from 'react-hook-form'
import { writeOffSchema } from './schema'
import { conditionOptions, writeOffTypeOptions } from './constants'
import { currencySymbolOptions } from 'constants/variables'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

export const WriteOffDialog = ({ dialog, setDialog, defaultValues, data }: any) => {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { width } = useWeb()
  const { notify } = useNotify()
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(writeOffSchema), defaultValues })

  const { fields } = useFieldArray({
    control,
    name: 'transactions'
  })

  const handleCloseDialog = () => {
    setDialog({ open: false })
  }

  const submit = (payload: any) => {
    // Implement write-off logic here 
    let body = {
      transactions: payload?.transactions?.map((item: any) => {
        if (item.writeOffType === 'REPOSSESS') {
          return {
            id: item.id,
            writeOffType: item.writeOffType,
            remainingCostCurrency: item.remainingCostCurrency,
            remainingCost: item.remainingCost,
            newPrice: item.newPrice,
            newPriceCurrency: item.newPriceCurrency,
            condition: item.condition,
            reason: item.reason,
            note: item.note,
          }
        } else {
          return {
            id: item.id,
            writeOffType: item.writeOffType,
            amount: item.amount,
            currency: item.currency,
            condition: item.condition,
            reason: item.reason,
            note: item.note,
          }
        }
      })
    }
    Axios({
      method: 'PUT',
      url: `/sale/loan/writeOff/${data?._id}`,
      body,
    })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle
        title={language['WRITE_OFF_LOAN']}
        onClose={handleCloseDialog}
      />
      <form onSubmit={handleSubmit(submit)}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {
            fields?.map((item: any, key) => (
              <div key={key} style={{
                fontFamily: theme.font.family,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                width: width < 1024 ? '80vw' : '60vw',
                padding: 20,
                gridColumnGap: 20,
                gridTemplateAreas: watch(`transactions.${key}.writeOffType`) === 'REPOSSESS' ? `
                                  'writeOffType remainingCost newPrice'
                                  'condition note note'
                                  'reason reason reason'
                                  'action action action'
                              ` : `
                                  'writeOffType amount condition'
                                  'note note note'
                                  'reason reason reason'
                                  'action action action'
                              `,
                borderRadius: theme.radius.ternary, 
                backgroundColor: theme.background.secondary,
                boxSizing: 'border-box'

              }}>
                <div style={{ gridArea: 'writeOffType' }}>
                  <SelectField
                    defaultValue={(fields[key] as any)?.writeOffType}
                    label='Write Off Type'
                    options={writeOffTypeOptions}
                    err={errors?.writeOffType?.message}
                    {...register(`transactions.${key}.writeOffType`)}
                  />
                </div>
                {watch(`transactions.${key}.writeOffType`) === 'REPOSSESS' ? <>
                  <div style={{ gridArea: 'remainingCost' }}>
                    <TextField
                      type='number'
                      step='any'
                      label='Remaining Cost'
                      err={errors?.remainingCost?.message}
                      {...register(`transactions.${key}.remainingCost`)}
                      icon={
                        <div
                          style={{ position: 'absolute', right: 0, display: 'flex' }}
                        >
                          <MiniSelectField
                            defaultValue={(fields[key] as any)?.remainingCostCurrency}
                            options={currencySymbolOptions}
                            width={33}
                            {...register(`transactions.${key}.remainingCostCurrency`)}
                            sx={{
                              position: 'absolute',
                              top: -1,
                              right: -5,
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
                  <div style={{ gridArea: 'newPrice' }}>
                    <TextField
                      type='number'
                      step='any'
                      label='New Price'
                      err={errors?.newPrice?.message}
                      {...register(`transactions.${key}.newPrice`)}
                      icon={
                        <div
                          style={{ position: 'absolute', right: 0, display: 'flex' }}
                        >
                          <MiniSelectField
                            defaultValue={(fields[key] as any)?.newPriceCurrency}
                            options={currencySymbolOptions}
                            width={33}
                            {...register(`transactions.${key}.newPriceCurrency`)}
                            sx={{
                              position: 'absolute',
                              top: -1,
                              right: -5,
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
                </> : <div style={{ gridArea: 'amount' }}>
                    <TextField
                      type='number'
                      step='any'
                      label='Amount'
                      err={errors?.amount?.message}
                      {...register(`transactions.${key}.amount`)}
                      icon={
                        <div
                          style={{ position: 'absolute', right: 0, display: 'flex' }}
                        >
                          <MiniSelectField
                            defaultValue={(fields[key] as any)?.currency}
                            options={currencySymbolOptions}
                            width={33}
                            {...register(`transactions.${key}.currency`)}
                            sx={{
                              position: 'absolute',
                              top: -1,
                              right: -5,
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
                }
                <div style={{ gridArea: 'condition' }}>
                  <SelectField
                    defaultValue={(fields[key] as any)?.condition}
                    options={conditionOptions}
                    label='Condition'
                    err={errors?.condition?.message}
                    {...register(`transactions.${key}.condition`)}
                  />
                </div>
                <div style={{ gridArea: 'note' }}>
                  <TextField
                    label='Note'
                    err={errors?.note?.message}
                    {...register(`transactions.${key}.note`)}
                  />
                </div>
                <div style={{ gridArea: 'reason' }}>
                  <TextField
                    label='Reason'
                    err={errors?.reason?.message}
                    {...register(`transactions.${key}.reason`)}
                  />
                </div>
              </div>
            ))
          }
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end', padding: '0 20px 20px' }}>
          <Button
            onClick={handleCloseDialog}
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            { dialog.stockId ? 'Update' : 'Create' }
          </Button>
        </div>
      </form>
    </AlertDialog>
  )
}