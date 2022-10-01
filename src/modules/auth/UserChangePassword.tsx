import { Button } from '@mui/material'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { TextField } from 'components/shared/form/InputField'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { changePasswordSchema } from './schema'

export const UserChangePassword = () => {
  const { id } = useParams()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { device } = useWeb()
  const { theme } = useTheme()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(changePasswordSchema) })

  const submit = async (data) => {
    Axios({
      method: 'PUT',
      url: `/user/change-password/${id}`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err.response?.data?.msg, 'error'))
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
            gridTemplateColumns: '1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
              device === 'mobile'
                ? ` 
                    'currentPassword currentPassword'
                    'newPassword confirmPassword'
                    'action action'
                `
                : ` 
                    'currentPassword currentPassword'
                    'newPassword confirmPassword'
                    'action action'
                `,
          }}
        >
          <div style={{ gridArea: 'currentPassword' }}>
            <TextField
              type='password'
              label='Current Password'
              err={errors.current_password?.message}
              {...register('current_password')}
            />
          </div>
          <div style={{ gridArea: 'newPassword' }}>
            <TextField
              type='password'
              label='New Password'
              err={errors.new_password?.message}
              {...register('new_password')}
            />
          </div>
          <div style={{ gridArea: 'confirmPassword' }}>
            <TextField
              type='password'
              label='Confirm Password'
              err={errors.confirm_password?.message}
              {...register('confirm_password')}
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
