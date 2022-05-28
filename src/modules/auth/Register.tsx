import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, SelectField } from 'components/shared/form'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from './schema'
import { getListRole, selectListRole } from 'shared/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { IOptions } from 'components/shared/form/SelectField'
import useLanguage from 'hooks/useLanguage'

export const Register = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: listRole, status } = useAppSelector(selectListRole)
  const [roleOption, setRoleOption] = useState<IOptions[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) })
  const { register: registerUser } = useAuth()
  const { lang } = useLanguage()
  const { notify } = useNotify()

  const form = async (data) => {
    const response: any = await registerUser(data)
    if (response?.code !== 'SUCCESS') return notify(response?.msg, 'error')
    navigate('/login')
  }

  useEffect(() => {
    dispatch(getListRole())
  }, [dispatch])

  useEffect(() => {
    let options: IOptions[] = []
    listRole.forEach((role) => {
      options = [ ...options, { label: role.name?.[lang] || role.name?.['English'], value: role._id } ]
    })
    setRoleOption(options)
  }, [listRole, lang])

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
          options={roleOption}
          err={errors.role?.message}
          loading={status === 'LOADING' ? true : false}
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
        <input type='submit' value='Register' />
      </form>
    </div>
  )
}