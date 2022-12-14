import React, { useEffect, useState } from 'react'
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

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const CategoryForm = ({ defaultValues, id }: any) => {
  const { theme } = useTheme()
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
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [status, setStatus] = useState(defaultValues?.status)
  const [loading, setLoading] = useState(false)
  const [iconPath, setIconPath] = useState<IImage>(defaultValues?.icon)
  const statusValue = watch('status')

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

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
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/category/update/${id}` : `/organize/category/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListCategory({}))
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
          gridTemplateColumns: '1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: `
                              'category category category'
                              'status icon icon'
                              'description description description'
                              'action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'category', marginTop: 20, marginBottom: 20 }}>
          <LocaleField
            onChange={handleChangeCategory}
            err={errors?.name}
            describe='Category'
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            options={statusOption}
            label='Status'
            value={status}
            err={errors?.status?.message}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'icon' }}>
          <FileField
            images={iconPath && [iconPath]}
            selected={getValues('icon')?._id}
            name='icon'
            label='Icon'
            accept='image/png, image/jpeg'
            onChange={handleChangeFile}
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
          style={{
            gridArea: 'action',
            marginTop: 10,
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button variant='contained' style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            loading={loading}
            type='submit'
            variant='contained'
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          >
            { id ? 'Save' : 'Create' }
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default CategoryForm
