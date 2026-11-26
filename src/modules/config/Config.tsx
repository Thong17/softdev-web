import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { themeMode } from 'contexts/theme/constant'
import { languages } from 'contexts/language/constant'
import { CheckboxField, SelectField, TextField } from 'components/shared/form'
import { Section } from 'components/shared/Section'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import Button from 'components/shared/Button'
import { DataSection } from './DataSection'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { telegramConfigSchema } from './schema'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect } from 'react'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { FormControlLabel, Switch } from '@mui/material'

declare type TelegramPrivilegeOptions = "telegramPrivilege.SENT_AFTER_PAYMENT" | "telegramPrivilege.SENT_AFTER_OPEN_DRAWER" | "telegramPrivilege.SENT_AFTER_CLOSE_DRAWER"
interface ICheckboxTarget { name: TelegramPrivilegeOptions, checked: boolean }

const Config = () => {
  const { notify } = useNotify()
  const { width } = useWeb()
  const { changeTheme, mode, theme } = useTheme()
  const { user } = useAuth()
  const { changeLanguage, language, lang } = useLanguage()
  const {
    reset,
    watch,
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(telegramConfigSchema),
    defaultValues: {
      telegramAPIKey: '',
      telegramChatID: '',
      telegramPrivilege: { 
        SENT_AFTER_PAYMENT: false,
        SENT_AFTER_OPEN_DRAWER: false,
        SENT_AFTER_CLOSE_DRAWER: false,
        SENT_PAY_LATER_OVERDUE: false,
      },
      payLaterOverdueTime: '08:00',
    }
  })
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })
  // Controlled (follows the loaded setting), unlike the checkboxes above
  const payLaterOn = watch('telegramPrivilege.SENT_PAY_LATER_OVERDUE')

  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/organize/store/getTelegramSetting'
    })
      .then((res) => {
        const data = res.data.data || {}
        reset({
          telegramAPIKey: data.telegramAPIKey || '',
          telegramChatID: data.telegramChatID || '',
          telegramPrivilege: { ...data.telegramPrivilege },
          payLaterOverdueTime: data.payLaterOverdueTime || '08:00',
        })
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
    //eslint-disable-next-line
  }, [])
  

  const submit = (data) => {
    Axios({
      method: 'PUT',
      url: '/organize/store/updateTelegramSetting',
      body: data
    })
      .then(res => {
        markSaved()
        notify(res?.data?.msg, 'success')
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
  }

  const handleChangeCheckbox = (event) => {
    const { name, checked }: ICheckboxTarget = event.target
    setValue(name, checked)
  }

  return (
    <Layout>
      <Container>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <div style={{ width: '100%' }}>
            <SelectField
              name='select-theme'
              label={language['THEME']}
              value={mode}
              defaultValue=''
              onChange={(event) => changeTheme(event.target.value)}
              options={Object.keys(themeMode).map((key) => {
                return { label: key, value: key }
              })}
            />
          </div>
          <div style={{ width: '100%' }}>
            <SelectField
              name='select-language'
              label={language['LANGUAGE']}
              value={lang}
              defaultValue=''
              onChange={(event) => changeLanguage(event.target.value)}
              options={Object.keys(languages).map((key) => {
                return { label: key, value: key }
              })}
            />
          </div>
        </div>
        {
          user?.isDefault && <form {...trackChanges} onSubmit={handleSubmit(submit)}>
            <Section describe={language['TELEGRAM_CONFIGURATION']}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridColumnGap: 20,
                  gridTemplateAreas:
                    width < 1024
                      ? ` 
                      'apiKey apiKey apiKey'
                      'chatId chatId chatId'
                    `
                      : ` 
                      'apiKey apiKey chatId'
                    `,
                }}
              >
                <div style={{ gridArea: 'apiKey' }}>
                  <TextField
                    type='text'
                    label={language['API_KEY']}
                    err={errors.telegramAPIKey?.message}
                    {...register('telegramAPIKey')}
                  />
                </div>
                <div style={{ gridArea: 'chatId' }}>
                  <TextField
                    type='text'
                    label={language['CHAT_ID']}
                    err={errors.telegramChatID?.message}
                    {...register('telegramChatID')}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
                  gridColumnGap: 20,
                }}
              >
                <CheckboxField name='telegramPrivilege.SENT_AFTER_PAYMENT' defaultChecked={getValues('telegramPrivilege.SENT_AFTER_PAYMENT')} label={language['SENT_AFTER_PAYMENT']} onChange={handleChangeCheckbox} />
                <CheckboxField name='telegramPrivilege.SENT_AFTER_OPEN_DRAWER' defaultChecked={getValues('telegramPrivilege.SENT_AFTER_OPEN_DRAWER')} label={language['SENT_AFTER_OPEN_DRAWER']} onChange={handleChangeCheckbox} />
                <CheckboxField name='telegramPrivilege.SENT_AFTER_CLOSE_DRAWER' defaultChecked={getValues('telegramPrivilege.SENT_AFTER_CLOSE_DRAWER')} label={language['SENT_AFTER_CLOSE_DRAWER']} onChange={handleChangeCheckbox} />
              </div>
              {/* Pay Later overdue: a daily Telegram summary (helpers/payLaterAlerts on the API) */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 20px', marginTop: 10, paddingTop: 10, borderTop: theme.border.quaternary }}>
                <FormControlLabel
                  style={{ margin: 0, color: theme.text.secondary }}
                  label={language['PAY_LATER_OVERDUE_SUMMARY']}
                  control={
                    <Switch
                      checked={!!payLaterOn}
                      onChange={(event) => setValue('telegramPrivilege.SENT_PAY_LATER_OVERDUE', event.target.checked, { shouldDirty: true })}
                    />
                  }
                />
                <div style={{ width: 160 }}>
                  <TextField
                    type='time'
                    label={language['SEND_AT']}
                    disabled={!payLaterOn}
                    err={errors.payLaterOverdueTime?.message}
                    {...register('payLaterOverdueTime')}
                  />
                </div>
                <span style={{ flexBasis: '100%', fontSize: 12, color: theme.text.tertiary }}>{language['PAY_LATER_OVERDUE_HINT']}</span>
              </div>

            </Section>
            <div
              style={{
                gridArea: 'action',
                marginTop: 20,
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button
                type='submit'
                style={{
                  marginLeft: 10,
                  backgroundColor: `${theme.color.info}22`,
                  color: theme.color.info,
                }}
              >
                {language['SAVE']}
              </Button>
            </div>
          </form>
        }
        {user?.isSuperAdmin && <DataSection />}
      </Container>
    </Layout>
  )
}

export default Config
