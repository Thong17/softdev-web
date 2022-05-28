import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from './schema'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { useLocation, useNavigate } from 'react-router'
import { TextField } from 'components/shared/form'

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) })
  const { login } = useAuth()
  const { notify } = useNotify()

  const form = async (data) => {
    const response: any = await login(data)
    if (response?.code !== 'SUCCESS') return notify(response?.msg, 'error')
    navigate(location.state ? (location.state as string) : '/admin')
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(form)}>
        <TextField
          label='Username'
          type='text'
          err={errors.username?.message}
          {...register('username')}
        />
        <TextField
          label='Password'
          type='password'
          err={errors.password?.message}
          {...register('password')}
        />
        <input type='submit' value='Login' />
        <button onClick={() => navigate('/register')}>Register</button>
      </form>
    </div>
  )
}
