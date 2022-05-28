import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, SelectField } from 'components/shared/form'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from './schema'

export const Register = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) })
  const { register: registerUser } = useAuth()
  const { notify } = useNotify()

  const form = async (data) => {
    const response: any = await registerUser(data)
    if (response?.code !== 'SUCCESS') return notify(response?.msg, 'error')
    navigate('/login')
  }

  return (
    <div style={{ padding: 50 }}>
      <form onSubmit={handleSubmit(form)}>
        <TextField
          label='Username'
          type='text'
          err={errors.username?.message}
          {...register('username')}
        />
        <TextField
          label='Email'
          type='email'
          err={errors.email?.message}
          {...register('email')}
        />
        <SelectField
          label='Role'
          defaultValue=''
          options={[{ label: 'Test', value: 1 }]}
          err={errors.role?.message}
          {...register('role')}
        />

        <TextField
          label='Password'
          type='password'
          err={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label='Confirm Password'
          type='password'
          err={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
        <button onClick={() => navigate('/register')}>Register</button>
        <input type='submit' value='Login' />
      </form>
    </div>
  )
}