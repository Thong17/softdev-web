import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from './schema'
import useAuth from 'hooks/useAuth'


export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })
  const { login } = useAuth()

  const form = async (data) => {
    try {
      await login(data)
    } catch (err) {
      
    }
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
