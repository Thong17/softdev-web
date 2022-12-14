import {
  DetailField,
  LocaleField,
  PrivilegeField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { roleSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getPreRole, selectPreRole, getListRole } from 'shared/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Loading from 'components/shared/Loading'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'

export const RoleForm = ({ defaultValues, id }: any) => {
  const {
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(roleSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { data: preRole, status: statusPreRole } = useAppSelector(selectPreRole)

  const handleSetPrivilege = (privilege) => {
    setValue('privilege', privilege)
  }

  const handleChangeRole = (role) => {
    setValue('name', role)
  }

  useEffect(() => {
    if (statusPreRole !== 'INIT') return
    dispatch(getPreRole())
  }, [dispatch, statusPreRole])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/role/update/${id}` : `/admin/role/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(getListRole())
        if (!id) {
          reset(defaultValues)
        }
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{
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
    }}>
      <div style={{ gridArea: 'form' }}>
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
            ` 
              'name name name' 
              'description description description'
              'action action action'
            `
          }}
        >
          <div style={{ gridArea: 'name', marginTop: 20 }}>
            <LocaleField
              onChange={handleChangeRole}
              err={errors?.name}
              describe='Role'
              name='name'
              defaultValue={getValues('name')}
            />
          </div>
          <div style={{ gridArea: 'description', marginTop: 20 }}>
            <DetailField
              type='text'
              label='Description'
              style={{ height: 70 }}
              {...register('description')}
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
            <Button
              variant='contained'
              style={{
                backgroundColor: `${theme.color.error}22`,
                color: theme.color.error,
              }}
              onClick={() => navigate(-1)}
            >
              {language['CANCEL']}
            </Button>
            <Button
              loading={loading}
              type='submit'
              variant='contained'
              style={{
                marginLeft: 10,
                backgroundColor: `${theme.color.info}22`,
                color: theme.color.info,
              }}
            >
              {id ? language['SAVE'] : language['CREATE']}
            </Button>
          </div>
        </form>
      </div>
      <div
        style={{ gridArea: 'privilege', minHeight: 42, position: 'relative' }}
      >
        {statusPreRole === 'SUCCESS' ? (
          <PrivilegeField
            preValue={preRole}
            value={getValues('privilege')}
            returnValue={handleSetPrivilege}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}
