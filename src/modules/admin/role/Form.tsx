import { DetailField, LocaleField, CheckboxField } from 'components/shared/form'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { roleSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getPreRole, selectPreRole } from './redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { CustomPrivilege } from 'styles'
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import Button from 'components/shared/Button'
import Loading from 'components/shared/icons/Loading'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

export const RoleForm = ({ defaultValues }) => {
  const dispatch = useAppDispatch()
  const { data: preRole, status: statusPreRole } = useAppSelector(selectPreRole)
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(roleSchema), defaultValues })
  const { theme } = useTheme()
  const { device } = useWeb()
  const { loadify } = useNotify()
  const [checkAll, setCheckAll] = useState({})

  const PrivilegeBox = () => {
    return <CustomPrivilege styled={theme} device={device}>
      <span className='label'>Privilege</span>
      {Object.keys(preRole).map((role, i) => {
        return <div key={i} className='privilege-container'>
          <CheckboxField label={role} name={role} defaultChecked={checkAll[role] || false} onChange={handleChangeAllPrivilege} />
          <div>
            {
              Object.keys(preRole[role]).map((action, j) => {
                return <CheckboxField key={j} label={action} name={`${role}.${action}`} defaultChecked={getValues('privilege')?.[role]?.[action]} onChange={handleChangePrivilege} />
              })
            }
          </div>
        </div>
      })}
    </CustomPrivilege>
  }

  const handleChangeRole = (role) => {
    setValue('name', role)
  }

  const handleChangePrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    let privilege = getValues('privilege')
    const [route, action] = names
    privilege[route][action] = checked

    Object.keys(privilege[route]).find(action => !privilege[route][action]) 
      ? setCheckAll({ ...checkAll, [route]: false }) 
      : setCheckAll({ ...checkAll, [route]: true })
    
    setValue('privilege', privilege)
  }

  const handleChangeAllPrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    let privilege = getValues('privilege')
    const [route] = names
    Object.keys(preRole[route]).forEach((action) => {
      privilege[route][action] = checked
    })
    setValue('privilege', privilege)
    setCheckAll({ ...checkAll, [route]: checked })
  }

  const submit = async (data) => {
    const response = Axios({
      method: 'POST',
      url: '/admin/role/create',
      body: data,
    })
    loadify(response)
  }

  useEffect(() => {
    dispatch(getPreRole())
  }, [dispatch])

  useEffect(() => {
    if (statusPreRole === 'SUCCESS') {
      const privilege = { ...preRole, ...getValues('privilege') }
      setValue('privilege', privilege)
      let checkedAll = {}
      Object.keys(privilege).forEach((route) => {
        Object.keys(privilege[route]).find(action => !privilege[route][action]) 
          ? checkedAll = { ...checkedAll, [route]: false }
          : checkedAll = { ...checkedAll, [route]: true }
      })
      setCheckAll(checkedAll)
    }
  }, [preRole, statusPreRole, setValue, getValues])

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
        />
        <DetailField
          type='text'
          label='Description'
          style={{ height: 70 }}
          {...register('description')}
        />
      </div>
      <div style={{ gridArea: 'privilege', position: 'relative', minHeight: 42 }}>
        {statusPreRole !== 'LOADING'
          ? <PrivilegeBox />
          : <Loading />
        }
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
          Submit
        </Button>
      </div>
    </form>
  )
}
