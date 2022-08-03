import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { TextTitle } from 'components/shared/TextTitle'
import { SelectField } from 'components/shared/form/SelectField'
import { useEffect, useState } from 'react'
import { positionOptions, sizeOptions, directionOptions, typeOptions } from './constant'
import { DetailField, TextField } from 'components/shared/form'
import { yupResolver } from '@hookform/resolvers/yup'
import { structureSchema } from './schema'
import { useForm } from 'react-hook-form'

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
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(structureSchema), defaultValues })
  const [size, setSize] = useState('small')
  const [align, setAlign] = useState('center')
  const [justify, setJustify] = useState('center')
  const [direction, setDirection] = useState('row')
  const [type, setType] = useState('table')
  const sizeValue = watch('size')
  const typeValue = watch('type')
  const alignValue = watch('align')
  const justifyValue = watch('justify')
  const directionValue = watch('direction')

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

  const submit = (data) => {
    onSubmit({ id: dialog.structureId, ...data })
    handleCloseDialog()
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <TextTitle title='Structure Form' />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'title title title length'
                            'size type type direction'
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
        <div style={{ gridArea: 'length' }}>
          <TextField
            type='number'
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
          >
            Cancel
          </Button>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: theme.background.secondary,
              color: theme.text.secondary,
            }}
            onClick={handleSubmit(submit)}
            styled={theme}
            autoFocus
          >
            Add
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
