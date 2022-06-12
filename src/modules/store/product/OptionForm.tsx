import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { optionSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  DetailField,
  FileField,
  LocaleField,
  SelectField,
  TextField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { currencyOptions } from 'constants/variables'
import { useEffect, useState } from 'react'
import { IImage } from 'components/shared/form/UploadField'
import useWeb from 'hooks/useWeb'
import { updateOption } from './redux'
import { useAppDispatch } from 'app/hooks'

export const OptionForm = ({
  optionDialog,
  setOptionDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(optionSchema), defaultValues })
  const dispatch = useAppDispatch()
  const { notify, loadify } = useNotify()
  const { width } = useWeb()
  const [imagePath, setImagePath] = useState<IImage | undefined>(defaultValues?.imagePath)
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

  useEffect(() => {
    reset(defaultValues)
    setImagePath(defaultValues?.imagePath)
  }, [defaultValues, reset])
  

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleChangeImages = (event) => {
    const profile = event.target.files[0]

    const formData = new FormData()
    formData.append('images', profile)

    const response = Axios({
      method: 'POST',
      url: `/shared/upload/image`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    loadify(response)
    response.then((data) => {
      const fileIds = data?.data?.data?.[0]?._id
      const file: IImage = {
        filename: data?.data?.data?.[0]?.filename,
        _id: data?.data?.data?.[0]?._id,
      }
      setValue('profile', fileIds)
      setImagePath(file)
    })
  }

  const handleCloseDialog = () => {
    setOptionDialog({ ...optionDialog, propertyId: null, optionId: null, open: false })
  }

  const handleDeleteImage = () => {
    setValue('profile', null)
    setImagePath(undefined)
  }

  const submit = (data) => {
    delete data.imagePath
    Axios({
      method: optionDialog.optionId ? 'PUT' : 'POST',
      url: optionDialog.optionId ? `/store/product/option/update/${optionDialog.optionId}` : `/store/product/option/create`,
      body: {
        ...data,
        product: optionDialog.productId,
        property: optionDialog.propertyId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(updateOption(data?.data?.data))
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
      isOpen={optionDialog.open}
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
                            'option option option'
                            'price price currency'
                            'profile profile profile'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'option' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Option'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'price' }}>
          <TextField
            type='number'
            label='Price'
            err={errors?.price?.message}
            {...register('price')}
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
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={200}
            images={imagePath && [imagePath]}
            name='profile'
            label='Profile'
            accept='image/png, image/jpeg'
            err={errors?.profile?.message}
            selected={getValues('profile')}
            onChange={handleChangeImages}
            handleDelete={handleDeleteImage}
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
            { optionDialog.optionId ? 'Update' : 'Create' }
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
