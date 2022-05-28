import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { themeMode } from 'contexts/theme/constant'
import { languages } from 'contexts/language/constant'
import { SelectField } from 'components/shared/form'

const Config = () => {
  const { changeTheme, mode } = useTheme()
  const { changeLanguage, language, lang } = useLanguage()

  return (
    <Layout>
      <Container>
        <p>
          This is a {mode} mode theme with {language.TEST} language custom
          palette
        </p>
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
      </Container>
    </Layout>
  )
}

export default Config
