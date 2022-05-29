import { TextField, SelectField } from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { userSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { IOptions } from 'components/shared/form/SelectField'
import { getListRole, selectListRole } from 'shared/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'

export const RoleForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const { data: listRole, status } = useAppSelector(selectListRole)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [roleOption, setRoleOption] = useState<IOptions[]>([])
  
  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/user/update/${id}` : `/admin/user/create`,
      body: data,
    })
      .then((data) => notify(data?.data?.msg, 'success'))
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
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
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 20,
        gridTemplateAreas:
          device === 'mobile'
            ? ` 
                                'form form form' 
                                'privilege privilege privilege'
                              `
            : ` 
                                'form privilege privilege' 
                                'form privilege privilege'
                              `,
      }}
    >
      <div
        style={{
          gridArea: 'form',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas:
            device === 'mobile'
              ? ` 
                  'role username username' 
                  'email email email'
                  'password password password'
                  'action action action'
                `
              : ` 
                  'role username username' 
                  'email email password'
                  'action action action'
                `,
        }}
      >
        <div style={{ gridArea: 'role' }}>
          <SelectField
            label='Role'
            defaultValue=''
            options={roleOption}
            err={errors.role?.message}
            loading={status === 'LOADING' ? true : false}
            {...register('role')}
          />
        </div>
        <div style={{ gridArea: 'username' }}>
          <TextField
            type='text'
            label='Username'
            err={errors.username?.message}
            { ...register('username') }
          />
        </div>
        <div style={{ gridArea: 'email' }}>
          <TextField
            type='email'
            label='Email'
            err={errors.email?.message}
            { ...register('email') }
          />
        </div>
        <div style={{ gridArea: 'password' }}>
          <TextField
            type='password'
            label='Password'
            err={errors.password?.message}
            { ...register('password') }
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
          <Button variant='contained' color='error'>
            Cancel
          </Button>
          <Button
            loading={loading}
            type='submit'
            variant='contained'
            color='success'
            style={{ marginLeft: 20 }}
          >
            { id ? 'Save' : 'Create' }
          </Button>
        </div>
      </div>
      <div style={{ gridArea: 'privilege' }}>

      </div>
    </form>
  )
}
