import { Button } from '@mui/material'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { TextField } from 'components/shared/form/InputField'
import { SelectField } from 'components/shared/form/SelectField'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { updateProfileSchema } from './schema'
import { FileField, IImage } from 'components/shared/form/UploadField'

const mappedProfile = (data) => {
  return {
    username: data?.username,
    email: data?.email,
    gender: data?.profile?.gender,
    photo: data?.profile?.photo,
    birthday: data?.profile?.birthday,
    contact: data?.profile?.contact,
    address: data?.profile?.address,
  }
}

const listGender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const UserProfile = () => {
  const { id } = useParams()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { device } = useWeb()
  const { theme } = useTheme()
  const {
    watch,
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(updateProfileSchema) })
  const [gender, setGender] = useState('')
  const genderId = watch('gender')
  const [photoPath, setPhotoPath] = useState<IImage | undefined>(undefined)

  useEffect(() => {
    const gender = listGender.find((gender) => gender.value === genderId)
    setGender(gender?.value || '')
  }, [genderId])

  useEffect(() => {
    if (!id) return
    Axios({
      method: 'GET',
      url: `/user/profile/${id}`,
    })
      .then((data) => {
        const user = data?.data?.data
        setPhotoPath(user?.profile?.photo)
        reset(mappedProfile(user))
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }, [id, notify, reset])

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('picture', image)
    Axios({
      method: 'POST',
      url: `/shared/upload/picture`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((data) => {
        const filename: IImage = data.data.data as IImage
        const fileId = data.data.data._id
        setValue('photo', fileId)
        setPhotoPath(filename)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }

  const submit = async (data) => {
    Axios({
      method: 'PUT',
      url: `/user/profile/${id}`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err.response?.data?.[0]?.path, 'error'))
  }

  return (
    <Layout>
      <Container>
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            position: 'relative',
            gridArea: 'form',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
              device === 'mobile'
                ? ` 
                    'photo photo photo'
                    'username username gender'
                    'birthday contact contact'
                    'email email email'
                    'address address address'
                    'action action action'
                `
                : ` 
                    'photo photo photo'
                    'username username gender'
                    'birthday contact contact'
                    'email email email'
                    'address address address'
                    'action action action'
                `,
          }}
        >
          <div style={{ gridArea: 'photo' }}>
            <FileField
              images={photoPath && [photoPath]}
              selected={getValues('photo')?._id}
              name='photo'
              label='Photo'
              accept='image/png, image/jpeg'
              onChange={handleChangeFile}
              height={130}
            />
          </div>
          <div style={{ gridArea: 'username' }}>
            <TextField
              type='text'
              label='Username'
              err={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div style={{ gridArea: 'gender' }}>
            <SelectField
              value={gender}
              label='Gender'
              options={listGender}
              err={errors.gender?.message}
              {...register('gender')}
            />
          </div>
          <div style={{ gridArea: 'email' }}>
            <TextField
              type='email'
              label='Email'
              err={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div style={{ gridArea: 'birthday' }}>
            <TextField
              type='date'
              label='Date Of Birth'
              err={errors.birthday?.message}
              {...register('birthday')}
            />
          </div>
          <div style={{ gridArea: 'contact' }}>
            <TextField
              type='text'
              label='Contact'
              err={errors.contact?.message}
              {...register('contact')}
            />
          </div>
          <div style={{ gridArea: 'address' }}>
            <TextField
              type='text'
              label='Address'
              err={errors.address?.message}
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
            <Button
              variant='contained'
              style={{
                backgroundColor: `${theme.color.error}22`,
                color: theme.color.error,
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              style={{
                marginLeft: 10,
                backgroundColor: `${theme.color.info}22`,
                color: theme.color.info,
              }}
            >
              Update
            </Button>
          </div>
        </form>
      </Container>
    </Layout>
  )
}
