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

export const OptionForm = ({
  optionDialog,
  setOptionDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(optionSchema), defaultValues: { price: 0, ...defaultValues } })
  const { notify, loadify } = useNotify()
  const { width } = useWeb()
  const [imagesPath, setImagesPath] = useState<IImage>(defaultValues?.profile)
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

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
      const fileIds = data?.data?.data?._id
      const file: IImage = {
        filename: data?.data?.data?.filename,
        _id: data?.data?.data?._id,
      }
      setValue('profile', fileIds)
      setImagesPath(file)
    })
  }

  const handleDeleteImage = () => {
    setValue('profile', null)
  }

  const submit = (data) => {
    Axios({
      method: 'POST',
      url: `/store/product/option/create`,
      body: {
        ...data,
        product: optionDialog.productId,
        property: optionDialog.propertyId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
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
      handleClose={() =>
        setOptionDialog({ ...optionDialog, propertyId: null, open: false })
      }
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
            images={imagesPath && [imagesPath]}
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
        <div style={{ gridArea: 'action' }}>
          <Button
            onClick={() =>
              setOptionDialog({
                ...optionDialog,
                propertyId: null,
                open: false,
              })
            }
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
            Create
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
