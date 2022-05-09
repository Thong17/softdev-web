import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { themeMode } from 'contexts/theme/constant'
import { languages } from 'contexts/language/constant'
import { CustomSelect } from 'styles'
import MenuItem from '@mui/material/MenuItem'

const Config = () => {
  const { changeTheme, mode, theme } = useTheme()
  const { changeLanguage, language, lang } = useLanguage()

  return (
    <Layout>
      <Container>
        <p>
          This is a {mode} mode theme with {language.TEST} language custom
          palette
        </p>
      </Container>
      <CustomSelect
        size="small"
        styled={theme}
        onChange={(event) => {
          changeTheme(event.target.value)
        }}
        value={mode}
      >
        {Object.keys(themeMode).map((key, index) => {
          return (
            <MenuItem key={index} value={key}>
              {key}
            </MenuItem>
          )
        })}
      </CustomSelect>
      <CustomSelect
        size="small"
        styled={theme}
        onChange={(event) => {
          changeLanguage(event.target.value)
        }}
        value={lang}
      >
        {Object.keys(languages).map((key, index) => {
          return (
            <MenuItem key={index} value={key}>
              {key}
            </MenuItem>
          )
        })}
      </CustomSelect>
    </Layout>
  )
}

export default Config
