import React, { useEffect, useState } from 'react'
import {
  LocaleField,
  FileField,
  SelectField,
  TextField,
} from 'components/shared/form'
import { LocaleDetail } from 'components/shared/form/LocaleField'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { announcementSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListAnnouncement } from './redux'
import { IImage } from 'components/shared/form/UploadField'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const AnnouncementForm = ({ defaultValues, id }: any) => {
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
  } = useForm({ resolver: yupResolver(announcementSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(defaultValues?.status)
  const [bannerPath, setBannerPath] = useState<IImage>(defaultValues?.banner)
  const statusValue = watch('status')

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  const handleChangeTitle = (title) => {
    setValue('title', title)
  }

  const handleChangeDescription = (description) => {
    setValue('description', description)
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
      setValue('banner', fileId)
      setBannerPath(filename)
    })
  }

  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/function/banner/update/${id}` : `/function/banner/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListAnnouncement({}))
        notify(data?.data?.msg, 'success')
        if (!id) {
          reset(defaultValues)
          setBannerPath(defaultValues?.banner)
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
                              'title title title'
                              'status banner banner'
                              'startAt startAt expireAt'
                              'order order order'
                              'description description description'
                              'action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'title', marginTop: 20, marginBottom: 20 }}>
          <LocaleField
            onChange={handleChangeTitle}
            err={errors?.title}
            describe='Title'
            name='title'
            defaultValue={getValues('title')}
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
        <div style={{ gridArea: 'banner' }}>
          <FileField
            images={bannerPath && [bannerPath]}
            selected={getValues('banner')?._id}
            name='banner'
            label='Banner'
            accept='image/png, image/jpeg'
            onChange={handleChangeFile}
          />
          {errors?.banner?.message && (
            <div style={{ color: theme.color.error, fontSize: 12, marginTop: 4 }}>{errors.banner.message}</div>
          )}
        </div>
        <div style={{ gridArea: 'startAt' }}>
          <TextField
            type='datetime-local'
            label='Display From'
            err={errors?.startAt?.message}
            {...register('startAt')}
          />
        </div>
        <div style={{ gridArea: 'expireAt' }}>
          <TextField
            type='datetime-local'
            label='Display To'
            err={errors?.expireAt?.message}
            {...register('expireAt')}
          />
        </div>
        <div style={{ gridArea: 'order' }}>
          <TextField
            type='number'
            step='any'
            label='Order'
            err={errors?.order?.message}
            {...register('order')}
          />
        </div>
        <div style={{ gridArea: 'description', marginTop: 10, marginBottom: 20 }}>
          <LocaleDetail
            onChange={handleChangeDescription}
            err={errors?.description}
            describe='Description'
            name='description'
            defaultValue={getValues('description')}
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
    </form>
  )
}

export default AnnouncementForm
