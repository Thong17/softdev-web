import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from './schema'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })
  const { login } = useAuth()
  const { notify } = useNotify()

  const form = async (data) => {
    const response: any = await login(data)
    if (response?.code !== 'SUCCESS') return notify(response?.data?.msg, 'error')
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(form)} >
        <input type="text" { ...register("username") } />
        <p>{ errors.username?.message }</p>
        <input type="password" { ...register("password") } />
        <p>{ errors.password?.message }</p>
        <input type="submit" value="Login"  />
      </form>
    </div>
  );
}
