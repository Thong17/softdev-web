import React, { useEffect, useState } from 'react'
import {
  LocaleField,
  FileField,
  TextField,
  DetailField,
  SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { companySchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListCompany } from './redux'
import { IImage } from 'components/shared/form/UploadField'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const CompanyForm = ({ defaultValues, id }: any) => {
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
  } = useForm({ resolver: yupResolver(companySchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(defaultValues?.status)
  const [logoPath, setLogoPath] = useState<IImage>(defaultValues?.logo)
  const statusValue = watch('status')

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  const handleChangeCompany = (company) => {
    setValue('name', company)
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
      setValue('logo', fileId)
      setLogoPath(filename)
    })
  }

  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/company/update/${id}` : `/organize/company/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListCompany({}))
        notify(data?.data?.msg, 'success')
        if (!id) {
          reset(defaultValues)
          setLogoPath(defaultValues?.logo)
        }
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
                              'company company company'
                              'legalName status logo'
                              'contact email email'
                              'address address address'
                              'action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'company', marginTop: 20, marginBottom: 20 }}>
          <LocaleField
            onChange={handleChangeCompany}
            err={errors?.name}
            describe='Company'
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'legalName' }}>
          <TextField
            type='text'
            label='Legal Name'
            err={errors?.legalName?.message}
            {...register('legalName')}
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            value={status}
            options={statusOption}
            label='Status'
            err={errors?.status?.message}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'logo' }}>
          <FileField
            images={logoPath && [logoPath]}
            selected={getValues('logo')?._id}
            name='logo'
            label='Logo'
            accept='image/png, image/jpeg'
            onChange={handleChangeFile}
          />
        </div>
        <div style={{ gridArea: 'contact' }}>
          <TextField
            type='text'
            label='Contact'
            err={errors?.contact?.message}
            {...register('contact')}
          />
        </div>
        <div style={{ gridArea: 'email' }}>
          <TextField
            type='email'
            label='Email'
            err={errors?.email?.message}
            {...register('email')}
          />
        </div>
        <div style={{ gridArea: 'address' }}>
          <DetailField
            type='text'
            label='Address'
            style={{ height: 70 }}
            {...register('address')}
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

export default CompanyForm
