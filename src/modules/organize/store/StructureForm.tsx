import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { MiniSelectField, SelectField } from 'components/shared/form/SelectField'
import { useEffect, useState } from 'react'
import { positionOptions, sizeOptions, directionOptions, typeOptions } from './constant'
import { DetailField, TextField } from 'components/shared/form'
import { yupResolver } from '@hookform/resolvers/yup'
import { structureSchema } from './schema'
import { useForm } from 'react-hook-form'
import { currencyOptions } from 'components/shared/form/InvoiceForm'

const durationOptions = [
  {
    label: 'H',
    value: '1h',
    detail: '1 Hour'
  },
  {
    label: 'D',
    value: '1d',
    detail: '1 Day'
  },
  {
    label: 'W',
    value: '1w',
    detail: '1 Week'
  },
  {
    label: 'M',
    value: '1m',
    detail: '1 Month'
  },
  {
    label: 'Y',
    value: '1y',
    detail: '1 Year'
  }
]

export const StructureForm = ({
  dialog,
  setDialog,
  theme,
  defaultValues,
  onSubmit
}: any) => {
  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(structureSchema), defaultValues })
  const [size, setSize] = useState('small')
  const [align, setAlign] = useState('center')
  const [justify, setJustify] = useState('center')
  const [direction, setDirection] = useState('row')
  const [type, setType] = useState('table')
  const [priceCurrency, setPriceCurrency] = useState('')
  const [priceDuration, setPriceDuration] = useState('')
  const sizeValue = watch('size')
  const typeValue = watch('type')
  const alignValue = watch('align')
  const justifyValue = watch('justify')
  const directionValue = watch('direction')
  const priceCurrencyValue = watch('price.currency')
  const priceDurationValue = watch('price.duration')

  useEffect(() => {
    setPriceCurrency(priceCurrencyValue || 'USD')
  }, [priceCurrencyValue])

  useEffect(() => {
    setPriceDuration(priceDurationValue || '1h')
  }, [priceDurationValue])

  useEffect(() => {
    const selectedType = typeOptions.find(
      (key) => key.value === typeValue
    )

    setType(selectedType?.value || 'table')
  }, [typeValue])

  useEffect(() => {
    const selectedSize = sizeOptions.find(
      (key) => key.value === sizeValue
    )

    setSize(selectedSize?.value || 'small')
  }, [sizeValue])

  useEffect(() => {
    const selectedAlign = positionOptions.find(
      (key) => key.value === alignValue
    )

    setAlign(selectedAlign?.value || 'center')
  }, [alignValue])

  useEffect(() => {
    const selectedJustify = positionOptions.find(
      (key) => key.value === justifyValue
    )

    setJustify(selectedJustify?.value || 'center')
  }, [justifyValue])

  useEffect(() => {
    const selectedDirection = directionOptions.find(
      (key) => key.value === directionValue
    )

    setDirection(selectedDirection?.value || 'row')
  }, [directionValue])

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleCloseDialog = () => {
    setDialog({ structureId: null, open: false })
  }

  const handleChangeSelect = (event) => {
    setValue(event.target.name, event.target.value)
  }

  const submit = (data) => {
    onSubmit({ id: dialog.structureId, ...data })
    handleCloseDialog()
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title='Structure Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'title title title price'
                            'length size type direction'
                            'align align justify justify'
                            'description description description description'
                            'action action action action'
                          `,
        }}
      >
        <div style={{ gridArea: 'title' }}>
          <TextField
            type='text'
            label='Title'
            err={errors?.title?.message}
            {...register('title')}
          />
        </div>
        <div style={{ gridArea: 'price' }}>
          <TextField
            type='number'
            step='any'
            label='Price'
            err={errors?.price?.value?.message}
            {...register('price.value')}
            icon={
              <div>
                <MiniSelectField
                  options={currencyOptions}
                  err={errors?.price?.currency?.message}
                  name='price.currency'
                  onChange={handleChangeSelect}
                  value={priceCurrency}
                  sx={{
                    position: 'absolute',
                    top: -1,
                    right: 0,
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
                <MiniSelectField
                  options={durationOptions}
                  err={errors?.price?.duration?.message}
                  name='price.duration'
                  onChange={handleChangeSelect}
                  value={priceDuration}
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
              </div>
            }
          />
        </div>
        <div style={{ gridArea: 'length' }}>
          <TextField
            type='number'
            step='any'
            label='Length'
            err={errors?.length?.message}
            {...register('length')}
          />
        </div>
        <div style={{ gridArea: 'type' }}>
          <SelectField
            value={type}
            options={typeOptions}
            label='Type'
            err={errors?.type?.message}
            {...register('type')}
          />
        </div>
        <div style={{ gridArea: 'size' }}>
          <SelectField
            value={size}
            options={sizeOptions}
            label='Size'
            err={errors?.size?.message}
            {...register('size')}
          />
        </div>
        <div style={{ gridArea: 'direction' }}>
          <SelectField
            value={direction}
            options={directionOptions}
            label='Direction'
            err={errors?.direction?.message}
            {...register('direction')}
          />
        </div>
        <div style={{ gridArea: 'align' }}>
          <SelectField
            value={align}
            options={positionOptions}
            label='Align'
            err={errors?.align?.message}
            {...register('align')}
          />
        </div>
        <div style={{ gridArea: 'justify' }}>
          <SelectField
            value={justify}
            options={positionOptions}
            label='Justify'
            err={errors?.justify?.message}
            {...register('justify')}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
          />
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={handleCloseDialog}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </Button>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            onClick={handleSubmit(submit)}
            styled={theme}
            autoFocus
          >
            Save
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
