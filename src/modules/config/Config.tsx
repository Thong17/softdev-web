import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { Typography } from '@mui/material'

const Config = () => {
  const { changeTheme, mode } = useTheme()
  const { changeLanguage, language, lang } = useLanguage()

  return (
    <Layout>
      <Container>
        <Typography>
          This is a {mode} mode theme with {language.TEST} language custom palette
        </Typography>
      </Container>
      <button onClick={() => changeTheme(mode === 'light' ? 'dark' : 'light')}>
        Change Theme
      </button>
      <select
        onChange={(event) => {
          changeLanguage(event.target.value)
        }}
        value={lang}
      >
        <option value='english'>English</option>
        <option value='khmer'>Khmer</option>
      </select>
    </Layout>
  )
}

export default Config
