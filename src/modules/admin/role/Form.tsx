import { DetailField, LocaleField, PrivilegeField } from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { roleSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getPreRole, selectPreRole } from 'modules/admin/role/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Loading from 'components/shared/Loading'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect } from 'react'

export const RoleForm = ({ defaultValues, id }: any) => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(roleSchema), defaultValues })
  const { device } = useWeb()
  const { loadify } = useNotify()

  const dispatch = useAppDispatch()
  const { data: preRole, status: statusPreRole } = useAppSelector(selectPreRole)

  const handleSetPrivilege = (privilege) => {
    setValue('privilege', privilege)
  }

  const handleChangeRole = (role) => {
    setValue('name', role)
  }

  useEffect(() => {
    if (statusPreRole === 'INIT') {
      dispatch(getPreRole())
    }
  }, [dispatch, statusPreRole])

  const submit = async (data) => {
    const response = Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/role/update/${id}` : `/admin/role/create`,
      body: data,
    })
    loadify(response)
  }

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
                                'input input input' 
                                'input input input'
                                'privilege privilege privilege'
                                'action action action'
                              `
            : ` 
                                'input privilege privilege' 
                                'input privilege privilege'
                                'action action action'
                              `,
      }}
    >
      <div style={{ gridArea: 'input' }}>
        <LocaleField
          onChange={handleChangeRole}
          err={errors?.name}
          describe='Role'
          name='name'
          defaultValue={getValues('name')}
        />
        <DetailField
          type='text'
          label='Description'
          style={{ height: 70 }}
          {...register('description')}
        />
      </div>
      <div style={{ gridArea: 'privilege', position: 'relative', minHeight: 42 }}>
        {statusPreRole === 'SUCCESS' ? <PrivilegeField preValue={preRole} value={getValues('privilege')} returnValue={handleSetPrivilege} /> : <Loading />}
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
          type='submit'
          variant='contained'
          color='success'
          style={{ marginLeft: 20 }}
        >
          { id ? 'Save' : 'Create' }
        </Button>
      </div>
    </form>
  )
}
