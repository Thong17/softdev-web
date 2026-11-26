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
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { responsiveGrid } from 'utils'
import useAuth from 'hooks/useAuth'
import { Box, Tooltip } from '@mui/material'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { generatePassword } from 'utils/password'
import { secretInputProps } from 'utils/secretInput'
import { CredentialsDialog, ICredentials } from './CredentialsDialog'

export const RoleForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const { data: listRole, status: statusListRole } = useAppSelector(selectListRole)
  const { data: preRole, status: statusPreRole } = useAppSelector(selectPreRole)
  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(id ? updateUserSchema : createUserSchema), defaultValues })
  const { user } = useAuth()
  // Editing: the password field is Reset Password, only for roles allowed to
  // reset passwords (the API checks the same). Creating: always shown.
  const canResetPassword = !!user?.privilege?.user?.resetPassword
  const showPassword = !id || canResetPassword
  const [passwordVisible, setPasswordVisible] = useState(false)
  // After a create or a reset: the details to send to the person
  const [credentials, setCredentials] = useState<ICredentials | null>(null)

  const handleGeneratePassword = () => {
    setValue('password', generatePassword(), { shouldValidate: true, shouldDirty: true })
    setPasswordVisible(true)
  }
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })
  const { device } = useWeb()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { lang, language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [privilege, setPrivilege] = useState<any>({ label: '', data: {} })
  const [roleOption, setRoleOption] = useState<IOptions[]>([])
  const roleId = watch('role')

  const submit = async (data) => {
    const body = { ...data }
    if (!showPassword) delete body.password
    const newPassword = body.password || ''
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/user/update/${id}` : `/admin/user/create`,
      body,
    })
      .then((response) => {
        dispatch(getListUser({}))
        markSaved()
        notify(response?.data?.msg, 'success')
        if (!id || newPassword) {
          setCredentials({ kind: id ? 'reset' : 'created', username: body.username, password: newPassword, role: privilege.label })
        }
        if (!id) {
          reset(defaultValues)
        } else if (newPassword) {
          // Saved: the field empties so a later save doesn't reset it again
          setValue('password', '')
        }
        setPasswordVisible(false)
      })
      .catch((err) => notify(err.response?.data?.[0]?.path || err.response?.data?.msg, 'error'))
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
      {...trackChanges}
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
            gridColumnGap: 20,
            ...responsiveGrid(device === 'mobile', '1fr 1fr 1fr', `
                  'username username role'
                  ${showPassword ? `'password password password'` : ''}
                  'email email expireAt'
                  'action action action'
                `),
          }}
        >
          
          <div style={{ gridArea: 'username' }}>
            <TextField
              type='text'
              label={language['USERNAME']}
              err={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div style={{ gridArea: 'role' }}>
            <SelectField
              value={role}
              label={language['ROLE']}
              options={roleOption}
              err={errors.role?.message}
              loading={statusListRole === 'LOADING' ? true : false}
              {...register('role')}
            />
          </div>
          {showPassword && (
            // The input keeps room on the right for the Generate button
            <Box sx={{ gridArea: 'password', '& input': { paddingRight: '120px !important' } }}>
              <TextField
                {...secretInputProps(passwordVisible)}
                label={id ? language['RESET_PASSWORD'] : language['PASSWORD']}
                err={errors.password?.message}
                icon={(
                  <Tooltip title={language['GENERATE_PASSWORD']}>
                    <button
                      type='button'
                      onClick={handleGeneratePassword}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: -1,
                        padding: '3px 9px 3px 7px',
                        border: 'none',
                        borderRadius: theme.radius.primary,
                        backgroundColor: `${theme.color.info}22`,
                        color: theme.color.info,
                        font: 'inherit',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      <AutorenewRoundedIcon style={{ fontSize: 16 }} />
                      {language['GENERATE']}
                    </button>
                  </Tooltip>
                )}
                {...register('password')}
              />
            </Box>
          )}

          <div style={{ gridArea: 'email' }}>
            <TextField
              type='email'
              label={language['EMAIL_OPTIONAL']}
              err={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div style={{ gridArea: 'expireAt' }}>
            <TextField
              type='date'
              label={language['TRIAL_EXPIRES']}
              err={errors.expireAt?.message}
              {...register('expireAt')}
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
            <Button variant='contained' style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
              {language['CANCEL']}
            </Button>
            <Button
              loading={loading}
              type='submit'
              variant='contained'
              style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            >
              { id ? language['SAVE'] : language['CREATE'] }
            </Button>
          </div>
        </div>
      </div>
      <div style={{ gridArea: 'privilege' }}>
        {statusPreRole === 'SUCCESS' ? <PrivilegeField label={`${privilege.label} ${language['PRIVILEGE_PREVIEW']}`} preValue={preRole} value={privilege.data} isReadOnly={true} /> : <Loading />}
      </div>
      <CredentialsDialog credentials={credentials} onClose={() => setCredentials(null)} />
    </form>
  )
}
