import { Button } from '@mui/material'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { TextField } from 'components/shared/form/InputField'
import Axios from 'constants/functions/Axios'
import useAuth from 'hooks/useAuth'
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
  const { user, updateUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(changePasswordSchema) })

  const isForced = user?.mustChangePassword && user?.id === id

  const submit = async (data) => {
    Axios({
      method: 'PUT',
      url: `/user/change-password/${id}`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        if (isForced) {
          updateUser({ mustChangePassword: false })
          navigate('/home')
        }
      })
      .catch((err) => notify(err.response?.data?.msg, 'error'))
  }

  return (
    <Layout>
      <Container>
        {isForced && (
          <div
            style={{
              gridArea: 'form',
              marginBottom: 20,
              padding: '12px 16px',
              borderRadius: 6,
              backgroundColor: `${theme.color.warning}22`,
              color: theme.color.warning,
            }}
          >
            For security, you must set a new password before continuing.
          </div>
        )}
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
            {!isForced && (
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
            )}
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
