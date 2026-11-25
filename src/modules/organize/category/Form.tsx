import React, { useEffect, useState } from 'react'
import useStoreFeatures from 'hooks/useStoreFeatures'
import {
  LocaleField,
  FileField,
  DetailField,
  SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { categorySchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { getListCategory } from './redux'
import { useAppDispatch } from 'app/hooks'
import { IImage } from 'components/shared/form/UploadField'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { responsiveGrid } from 'utils'
import useLanguage from 'hooks/useLanguage'

const CategoryForm = ({ defaultValues, id }: any) => {
  // Store › Features: the label (thermal) option only matters with label printing
  const features = useStoreFeatures()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const statusOption = [
    { label: language['ENABLED'], value: true },
    { label: language['DISABLE'], value: false },
  ]
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(categorySchema), defaultValues })
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [status, setStatus] = useState(defaultValues?.status)
  const [hasThermalPrinting, setHasThermalPrinting] = useState(defaultValues?.hasThermalPrinting)
  const [loading, setLoading] = useState(false)
  const [iconPath, setIconPath] = useState<IImage>(defaultValues?.icon)
  const statusValue = watch('status')
  const hasThermalPrintingValue = watch('hasThermalPrinting')

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === hasThermalPrintingValue)
    setHasThermalPrinting(selectedStatus?.value)
  }, [hasThermalPrintingValue])

  const handleChangeCategory = (category) => {
    setValue('name', category)
  }

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('icon', image)
    const response = Axios({
      method: 'POST',
      url: `/shared/upload/icon`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    response.then((data) => {
      const filename: IImage = data.data.data as IImage
      const fileId = data.data.data._id
      setValue('icon', fileId)
      setIconPath(filename)
    })
  }

  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/category/update/${id}` : `/organize/category/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListCategory({}))
        markSaved()
        notify(data?.data?.msg, 'success')
        if (!id) {
          reset(defaultValues)
          setIconPath(defaultValues?.icon)
        }
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, { message: err?.response?.data[0]?.path })
        }
        
        notify(err?.response?.data?.msg, 'error')
      })
      .finally(() => setLoading(false))
  }

  return (
    <form
      {...trackChanges}
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns:
          device === 'mobile' || device === 'tablet' ? '1fr' : '1fr',
        gridGap: 20,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridColumnGap: 20,
          ...responsiveGrid(device === 'mobile', '1fr 1fr 1fr', `
                              'category category category'
                              'status hasThermalPrinting icon'
                              'description description description'
                              'action action action'
                              `),
        }}
      >
        <div style={{ gridArea: 'category', marginTop: 20, marginBottom: 20 }}>
          <LocaleField
            onChange={handleChangeCategory}
            err={errors?.name}
            describe={language['CATEGORY']}
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            options={statusOption}
            label={language['STATUS']}
            value={status}
            err={errors?.status?.message}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'hasThermalPrinting', display: features.labelPrinting ? undefined : 'none' }}>
          <SelectField
            options={statusOption}
            label={language['THERMAL_PRINTING']}
            value={hasThermalPrinting}
            err={errors?.hasThermalPrinting?.message}
            {...register('hasThermalPrinting')}
          />
        </div>
        <div style={{ gridArea: 'icon' }}>
          <FileField
            images={iconPath && [iconPath]}
            selected={getValues('icon')?._id}
            name='icon'
            label={language['ICON']}
            accept='image/png, image/jpeg'
            onChange={handleChangeFile}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label={language['DESCRIPTION']}
            style={{ height: 70 }}
            {...register('description')}
          />
        </div>
        <div
          style={{
            gridArea: 'action',
            marginTop: 10,
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button variant='contained' style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
            {language['CANCEL']}
          </Button>
          <Button
            loading={loading}
            type='submit'
            variant='contained'
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          >
            { id ? language['SAVE'] : language['CREATE'] }
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default CategoryForm
