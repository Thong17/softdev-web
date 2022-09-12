import { CustomButton } from 'styles'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  DetailField,
  LocaleField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { propertySchema } from './schema'
import useWeb from 'hooks/useWeb'
import { updateProperty, createProperty } from './redux'
import { useAppDispatch } from 'app/hooks'
import { useEffect, useState } from 'react'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IOptions, SelectField } from 'components/shared/form/SelectField'

export const choiceOptions: IOptions[] = [
  {
    value: 'SINGLE',
    label: 'Single',
  },
  {
    value: 'MULTIPLE',
    label: 'Multiple',
  },
]

export const requireOptions: IOptions[] = [
  {
    value: false,
    label: 'Optional',
  },
  {
    value: true,
    label: 'Require',
  },
]

export const PropertyForm = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(propertySchema), defaultValues })

  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { width } = useWeb()
  const [choice, setChoice] = useState('SINGLE')
  const [isRequire, setIsRequire] = useState(false)
  const choiceValue = watch('choice')
  const isRequireValue = watch('isRequire')

  useEffect(() => {
    const selectedOption = requireOptions.find(
      (key) => key.value === isRequireValue
    )

    setIsRequire(selectedOption?.value || false)
  }, [isRequireValue])

  useEffect(() => {
    const selectedChoice = choiceOptions.find(
      (key) => key.value === choiceValue
    )

    setChoice(selectedChoice?.value || 'SINGLE')
  }, [choiceValue])

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, propertyId: null, open: false })
  }

  const submit = (data) => {
    delete data.imagePath
    Axios({
      method: dialog.propertyId ? 'PUT' : 'POST',
      url: dialog.propertyId ? `/organize/product/property/update/${dialog.propertyId}` : `/organize/product/property/create`,
      body: {
        ...data,
        product: dialog.productId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.propertyId 
          ? dispatch(updateProperty(data?.data?.data))
          : dispatch(createProperty(data?.data?.data))
        
        handleCloseDialog()
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title='Property Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'property property property'
                            'choice choice isRequire'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'property' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Property'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'choice' }}>
          <SelectField
            value={choice}
            options={choiceOptions}
            label='Choice'
            err={errors?.choice?.message}
            {...register('choice')}
          />
        </div>
        <div style={{ gridArea: 'isRequire' }}>
          <SelectField
            value={isRequire}
            options={requireOptions}
            label='Option'
            err={errors?.isRequire?.message}
            {...register('isRequire')}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
            {...register('description')}
          />
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}>
          <CustomButton
            styled={theme}
            onClick={handleCloseDialog}
            style={{ 
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error 
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            styled={theme}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            { dialog.propertyId ? 'Update' : 'Create' }
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
