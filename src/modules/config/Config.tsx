import useTheme from 'hooks/useTheme'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { Typography } from '@mui/material'

const Config = () => {
  const { changeTheme, mode } = useTheme()

  return (
    <Layout>
      <Container>
        <Typography>This is a {mode} mode theme with custom palette</Typography>
      </Container>
      <button onClick={() => changeTheme(mode === 'light' ? 'dark' : 'light')}>
        Change Theme
      </button>
    </Layout>
  )
}

export default Config
