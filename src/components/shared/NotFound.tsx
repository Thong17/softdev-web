import { Layout } from 'components/layouts/Layout'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import Container from './Container'

const NotFound = () => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <Layout>
      <Container>
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '50px'
          }}
        >
          <h1 style={{ fontSize: theme.responsive[device]?.text.h1, color: theme.text.primary }}>404</h1>
          <h3 style={{ fontSize: theme.responsive[device]?.text.h3, color: theme.text.secondary, margin: '10px 0' }}>Page Not Found</h3>
          <p  style={{ fontSize: theme.responsive[device]?.text.quaternary, color: theme.text.tertiary }}>The request destination could not be found on the server</p>
        </div>
      </Container>
    </Layout>
  )
}

export default NotFound
