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
import { updateOption, createOption } from './redux'
import { useAppDispatch } from 'app/hooks'
import { TextTitle } from 'components/shared/TextTitle'
import { IOptions, MiniSelectField } from 'components/shared/form/SelectField'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'

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

export const OptionForm = ({
  dialog,
  setDialog,
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
  const [imagePath, setImagePath] = useState<IImage | undefined>(
    defaultValues?.imagePath
  )
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')
  const [choice, setChoice] = useState('SINGLE')
  const choiceValue = watch('choice')
  const [isRequire, setIsRequire] = useState(false)

  useEffect(() => {
    setIsRequire(defaultValues?.isRequire || false)
  }, [defaultValues?.isRequire])

  useEffect(() => {
    const selectedChoice = choiceOptions.find(
      (key) => key.value === choiceValue
    )

    setChoice(selectedChoice?.value || 'SINGLE')
  }, [choiceValue])

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
    setDialog({ ...dialog, propertyId: null, optionId: null, open: false })
  }

  const handleDeleteImage = () => {
    setValue('profile', null)
    setImagePath(undefined)
  }

  const submit = (data) => {
    delete data.imagePath
    Axios({
      method: dialog.optionId ? 'PUT' : 'POST',
      url: dialog.optionId
        ? `/organize/product/option/update/${dialog.optionId}`
        : `/organize/product/option/create`,
      body: {
        ...data,
        product: dialog.productId,
        property: dialog.propertyId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.optionId
          ? dispatch(updateOption(data?.data?.data))
          : dispatch(createOption(data?.data?.data))

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

  const onToggleRequire = () => {
    setIsRequire(!isRequire)
    setValue('isRequire', !isRequire)
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <TextTitle title='Option Form' />
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
                            'price price choice'
                            'profile profile profile'
                            'isRequire isRequire isRequire'
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
            icon={
              <MiniSelectField
                value={currency}
                options={currencyOptions}
                err={errors?.currency?.message}
                {...register('currency')}
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -18,
                  height: 23,
                  '& .MuiSelect-select': {
                    position: 'absolute',
                    top: -2,
                  },
                  '& .MuiSvgIcon-root': {
                    right: 13,
                  },
                }}
              />
            }
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
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={130}
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
        <div
          onClick={onToggleRequire}
          style={{
            gridArea: 'isRequire',
            display: 'flex',
            color: theme.text.secondary,
            alignItems: 'end',
            height: 30,
            width: 'fit-content',
            cursor: 'pointer',
          }}
        >
          {isRequire ? (
            <CheckBoxRoundedIcon style={{ color: theme.color.info }} fontSize='small' />
          ) : (
            <CheckBoxOutlineBlankRoundedIcon
              style={{ color: theme.text.quaternary }}
              fontSize='small'
            />
          )}
          <span style={{ marginLeft: 7 }}>
            Tick this box to require the option
          </span>
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
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
            {dialog.optionId ? 'Update' : 'Create'}
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
