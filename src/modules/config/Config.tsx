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
import { Button } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { telegramConfigSchema } from './schema'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect } from 'react'

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
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(telegramConfigSchema), 
    defaultValues: {
      telegramAPIKey: '',
      telegramChatID: '',
      telegramPrivilege: { 
        SENT_AFTER_PAYMENT: false,
        SENT_AFTER_OPEN_DRAWER: false,
        SENT_AFTER_CLOSE_DRAWER: false,
      },
      thermalPrinterName: '',
      thermalPrinterWidth: '',
      thermalPrinterHeight: '',
      thermalPrinterGap: '',
      receiptPrinterName: '',
      receiptPrinterCharPerLine: 0,
    } 
  })

  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/organize/store/getTelegramSetting'
    })
      .then((res) => {
        const data = res.data.data
        reset(data)
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
      .then(res => notify(res?.data?.msg, 'success'))
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
              label='Theme'
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
              label='Language'
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
          user?.isDefault && <form onSubmit={handleSubmit(submit)}>
            <Section describe='Telegram Configuration'>
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
                    label='API Key'
                    err={errors.telegramAPIKey?.message}
                    {...register('telegramAPIKey')}
                  />
                </div>
                <div style={{ gridArea: 'chatId' }}>
                  <TextField
                    type='text'
                    label='Chat ID'
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
              
            </Section>
            <Section describe='Printer Configuration' style={{ marginTop: 40 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px 200px 200px',
                  gridColumnGap: 20,
                  gridTemplateAreas:
                    ` 
                      'thermalPrinterName thermalPrinterWidth thermalPrinterHeight thermalPrinterGap'
                      'receiptPrinterName receiptPrinterName receiptPrinterName receiptPrinterCharPerLine'
                    `
                }}
              >
                <div style={{ gridArea: 'thermalPrinterName' }}>
                  <TextField
                    type='text'
                    label='Thermal Printer Name'
                    err={errors.thermalPrinterName?.message}
                    {...register('thermalPrinterName')}
                  />
                </div>
                <div style={{ gridArea: 'thermalPrinterWidth' }}>
                  <TextField
                    type='text'
                    label='Paper Width (mm)'
                    err={errors.thermalPrinterWidth?.message}
                    {...register('thermalPrinterWidth')}
                  />
                </div>
                <div style={{ gridArea: 'thermalPrinterHeight' }}>
                  <TextField
                    type='text'
                    label='Paper Height (mm)'
                    err={errors.thermalPrinterHeight?.message}
                    {...register('thermalPrinterHeight')}
                  />
                </div>
                <div style={{ gridArea: 'thermalPrinterGap' }}>
                  <TextField
                    type='text'
                    label='Paper Gap (mm)'
                    err={errors.thermalPrinterGap?.message}
                    {...register('thermalPrinterGap')}
                  />
                </div>
                <div style={{ gridArea: 'receiptPrinterName' }}>
                  <TextField
                    type='text'
                    label='Receipt Printer Name'
                    err={errors.receiptPrinterName?.message}
                    {...register('receiptPrinterName')}
                  />
                </div>
                <div style={{ gridArea: 'receiptPrinterCharPerLine' }}>
                  <TextField
                    type='text'
                    label='Characters Per Line'
                    err={errors.receiptPrinterCharPerLine?.message}
                    {...register('receiptPrinterCharPerLine')}
                  />
                </div>
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
                variant='contained'
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
      </Container>
    </Layout>
  )
}

export default Config
