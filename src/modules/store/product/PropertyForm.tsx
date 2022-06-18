import { CustomButton } from 'styles'
import { Button } from '@mui/material'
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
import { useEffect } from 'react'

export const PropertyForm = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
}: any) => {
  const {
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
      url: dialog.propertyId ? `/store/product/property/update/${dialog.propertyId}` : `/store/product/property/create`,
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
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
            {...register('description')}
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
