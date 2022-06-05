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
import { brandSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListBrand } from './redux'

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const BrandForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(brandSchema), defaultValues })
  const { device } = useWeb()
  const { notify, loadify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(defaultValues.status)
  const [iconPath, setIconPath] = useState(null)
  const statusValue = watch('status')

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  const handleChangeBrand = (brand) => {
    setValue('name', brand)
  }

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('image', image)
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
      const filename = data.data.data.filename
      const fileId = data.data.data._id
      setValue('icon', fileId)
      setIconPath(filename)
    })
  }

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/store/brand/update/${id}` : `/store/brand/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListBrand({}))
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
      .finally(() => setLoading(false))
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns:
          device === 'mobile' || device === 'tablet' ? '1fr' : '500px 1fr',
        gridGap: 20,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: `
                              'brand brand brand'
                              'status icon icon'
                              'description description description'
                              'action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'brand' }}>
          <LocaleField
            onChange={handleChangeBrand}
            err={errors?.name}
            describe='Brand'
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            value={status}
            options={statusOption}
            label='Status'
            err={errors?.status}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'icon' }}>
          <FileField
            path={iconPath}
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
          <Button variant='contained' color='error'>
            Cancel
          </Button>
          <Button
            loading={loading}
            type='submit'
            variant='contained'
            color='success'
            style={{ marginLeft: 20 }}
          >
            {id ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default BrandForm
