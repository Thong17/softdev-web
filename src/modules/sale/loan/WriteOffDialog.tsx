import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/shared/Button'
import { DialogTitle } from 'components/shared/DialogTitle'
import { SelectField, TextField } from 'components/shared/form'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { writeOffSchema } from './schema'
import { conditionOptions, writeOffTypeOptions } from './constants'
import { currencyOptions } from 'constants/variables'

export const WriteOffDialog = ({ dialog, setDialog, defaultValues, data }: any) => {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { width } = useWeb()
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(writeOffSchema), defaultValues })

  const [writeOffType, setWriteOffType] = useState(defaultValues?.writeOffType)
  const writeOffTypeValue = watch('writeOffType')

  useEffect(() => {
    const selectedWriteOffType = writeOffTypeOptions.find(
      (key) => key.value === writeOffTypeValue
    )

    setWriteOffType(selectedWriteOffType?.value || 'cash')
  }, [writeOffTypeValue])

  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')

  useEffect(() => {
      const selectedCurrency = currencyOptions.find(
        (key) => key.value === currencyValue
      )
  
      setCurrency(selectedCurrency?.value || 'USD')
    }, [currencyValue])

  const [condition, setCondition] = useState(defaultValues?.condition)
  const conditionValue = watch('condition')

  useEffect(() => {
      const selectedCondition = conditionOptions.find(
        (key) => key.value === conditionValue
      )
  
      setCondition(selectedCondition?.value || 'NEW')
    }, [conditionValue])

  const handleCloseDialog = () => {
    setDialog({ open: false })
  }

  const submit = (data: any) => {
    console.log('Write off data:', data);
    // Implement write-off logic here 
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle
        title={language['WRITE_OFF_LOAN']}
        onClose={handleCloseDialog}
      />
      <form>
        <div>
          {
            data?.payment?.transactions?.map((item, key) => (
              <div key={key} style={{
                fontFamily: theme.font.family,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                width: width < 1024 ? '80vw' : '60vw',
                padding: 20,
                gridColumnGap: 20,
                gridTemplateAreas: `
                                  'writeOffType cost currency'
                                  'condition condition condition'
                                  'action action action'
                              `,
              }}>
                <div style={{ gridArea: 'writeOffType' }}>
                  <SelectField
                    value={writeOffType}
                    options={writeOffTypeOptions}
                    label={item.description}
                    err={errors?.writeOffType?.message}
                    {...register('writeOffType')}
                  />
                </div>
                <div style={{ gridArea: 'cost' }}>
                  <TextField
                    type='number'
                    step='any'
                    label='Cost'
                    err={errors?.cost?.message}
                    {...register('cost')}
                  />
                </div>
                <div style={{ gridArea: 'currency' }}>
                  <SelectField
                    value={currency}
                    options={currencyOptions}
                    label='Currency'
                    err={errors?.currency?.message}
                    {...register('currency')}
                  />
                </div>
                <div style={{ gridArea: 'condition' }}>
                  <SelectField
                    value={condition}
                    options={conditionOptions}
                    label='Condition'
                    err={errors?.condition?.message}
                    {...register('condition')}
                  />
                </div>
              </div>
            ))
          }
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end', marginTop: 20 }}>
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