import { CustomButton } from 'styles'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { colorSchema } from './schema'
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
import { updateColor, createColor } from './redux'
import { useAppDispatch } from 'app/hooks'
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded'
import { SketchPicker } from 'react-color'
import { DialogTitle } from 'components/shared/DialogTitle'

export const ColorForm = ({ dialog, setDialog, defaultValues, theme }: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(colorSchema), defaultValues })
  const dispatch = useAppDispatch()
  const { notify, loadify } = useNotify()
  const { width, device } = useWeb()
  const [imagesPath, setImagesPath] = useState<IImage[]>(
    defaultValues?.images || []
  )
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const [picker, setPicker] = useState(false)
  const [color, setColor] = useState(getValues('code'))
  const currencyValue = watch('currency')
  const colorCode = watch('code')

  useEffect(() => {
    setColor(colorCode)
  }, [colorCode])

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

  useEffect(() => {
    reset(defaultValues)
    setImagesPath(defaultValues?.images || [])
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleChangeColor = (color) => {
    setValue('code', color.hex)
    setColor(color.hex)
  }

  const handleChangeCode = (event) => {
    setValue('code', event.target.value)
    setColor(event.target.value)
  }

  const handleChangeImages = (event) => {
    const images = event.target.files

    const formData = new FormData()
    for (let image = 0; image < images.length; image++) {
      formData.append('images', images[image])
    }

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
      const fileIds = data.data.data.map((file) => {
        return file._id
      })
      const files: IImage[] = data.data.data.map((file) => {
        return { filename: file.filename, _id: file._id }
      })

      !getValues('profile') && setValue('profile', fileIds[0])
      if (imagesPath.length) {
        setValue('images', [...getValues('images'), ...fileIds])
        setImagesPath([...imagesPath, ...files])
      } else {
        setValue('images', fileIds)
        setImagesPath(files)
      }
    })
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, colorId: null, open: false })
  }

  const handleDeleteImage = (id) => {
    const newImages = imagesPath.filter((image) => image._id !== id)
    let hasProfile = false
    newImages.forEach((image) => {
      if (image._id === getValues('profile')) {
        hasProfile = true
      }
    })

    !hasProfile && setValue('profile', newImages?.[0]?._id)
    setImagesPath(newImages)
    setValue('images', newImages)
  }

  const handleChangeActive = (active) => {
    setValue('profile', active)
  }

  const submit = (data) => {
    delete data.imagesPath
    Axios({
      method: dialog.colorId ? 'PUT' : 'POST',
      url: dialog.colorId
        ? `/organize/product/color/update/${dialog.colorId}`
        : `/organize/product/color/create`,
      body: {
        ...data,
        product: dialog.productId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.colorId
          ? dispatch(updateColor(data?.data?.data))
          : dispatch(createColor(data?.data?.data))

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
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle title='Color Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas:
            device === 'mobile'
              ? `
                              'color color color'
                              'price price price'
                              'currency currency currency'
                              'code code code'
                              'profile profile profile'
                              'description description description'
                              'action action action'
                            `
              : `
                              'color color color'
                              'price currency code'
                              'profile profile profile'
                              'description description description'
                              'action action action'
                            `,
        }}
      >
        <div style={{ gridArea: 'color' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Color'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'price' }}>
          <TextField
            type='number'
            step='any'
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
        <div style={{ gridArea: 'code' }}>
          <TextField
            type='text'
            label='Code'
            icon={
              <ColorLensRoundedIcon
                style={{ color: color }}
                onClick={() => setPicker(!picker)}
              />
            }
            err={errors?.code?.message}
            onChange={handleChangeCode}
            value={getValues('code')}
          />
          {picker && (
            <div style={{ position: 'absolute', zIndex: 100, right: 20 }}>
              <div
                onClick={() => setPicker(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              ></div>
              <SketchPicker color={color} onChange={handleChangeColor} />
            </div>
          )}
        </div>
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={130}
            images={imagesPath}
            name='profile'
            label='Profile'
            accept='image/png, image/jpeg'
            multiple
            err={errors?.profile?.message}
            selected={getValues('profile')}
            onChange={handleChangeImages}
            handleDelete={handleDeleteImage}
            handleChangeActive={handleChangeActive}
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
        <div
          style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}
        >
          <CustomButton
            styled={theme}
            onClick={handleCloseDialog}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
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
            {dialog.colorId ? 'Update' : 'Create'}
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
