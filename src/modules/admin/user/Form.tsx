import { TextField, SelectField, PrivilegeField } from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { createUserSchema, updateUserSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { IOptions } from 'components/shared/form/SelectField'
import { getListRole, getPreRole, selectListRole, selectPreRole } from 'shared/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListUser } from './redux'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import Loading from 'components/shared/Loading'

export const RoleForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const { data: listRole, status: statusListRole } = useAppSelector(selectListRole)
  const { data: preRole, status: statusPreRole } = useAppSelector(selectPreRole)
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(id ? updateUserSchema : createUserSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [privilege, setPrivilege] = useState<any>({ label: '', data: {} })
  const [roleOption, setRoleOption] = useState<IOptions[]>([])
  const roleId = watch('role')

  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/user/update/${id}` : `/admin/user/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListUser({}))
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const role = listRole.find((value) => value._id === roleId)
    setRole(role?._id || '')
    setPrivilege({ data: role?.privilege || {}, label: role?.name?.[lang] || role?.name?.['English'] || '' })
  }, [roleId, listRole, lang])

  useEffect(() => {
    if (statusListRole !== 'INIT') return
    dispatch(getListRole())
  }, [dispatch, statusListRole])

  useEffect(() => {
    if (statusPreRole !== 'INIT') return
    dispatch(getPreRole())
  }, [dispatch, statusPreRole])

  useEffect(() => {
    let options: IOptions[] = []
    listRole.forEach((role) => {
      options = [...options, { label: role.name?.[lang] || role.name?.['English'], value: role._id }]
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
                              `,
      }}
    >
      <div style={{ gridArea: 'form', }}>
        <div
          style={{
            position: 'relative',
            gridArea: 'form',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
              device === 'mobile'
                ? ` 
                  'username username role' 
                  'email email email'
                  'password password password'
                  'action action action'
                `
                : ` 
                  'username username role' 
                  'password email email'
                  'action action action'
                `,
          }}
        >
          
          <div style={{ gridArea: 'username' }}>
            <TextField
              type='text'
              label='Username'
              err={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div style={{ gridArea: 'role' }}>
            <SelectField
              value={role}
              label='Role'
              options={roleOption}
              err={errors.role?.message}
              loading={statusListRole === 'LOADING' ? true : false}
              {...register('role')}
            />
          </div>
          <div style={{ gridArea: 'password' }}>
            <TextField
              type='password'
              label={id ? 'Update Password' : 'Password'}
              err={errors.password?.message}
              {...register('password')}
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
              {id ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
      <div style={{ gridArea: 'privilege' }}>
        {statusPreRole === 'SUCCESS' ? <PrivilegeField label={`${privilege.label} Privilege Preview`} preValue={preRole} value={privilege.data} isReadOnly={true} /> : <Loading />}
      </div>
    </form>
  )
}
