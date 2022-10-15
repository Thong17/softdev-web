import { Container } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { Link } from 'react-router-dom'

const Restrict = ({ redirect }) => {
  const { device } = useWeb()
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '50px',
        }}
      >
        <h1
          style={{
            fontSize: theme.responsive[device]?.text.h1,
            color: theme.text.primary,
          }}
        >
          403
        </h1>
        <h3
          style={{
            fontSize: theme.responsive[device]?.text.h3,
            color: theme.text.secondary,
            margin: '10px 0',
          }}
        >
          {language['NO_PERMISSION']}
        </h3>
        <p
          style={{
            fontSize: theme.responsive[device]?.text.secondary,
            color: theme.text.tertiary,
          }}
        >
          {language['NO_PERMISSION_DESCRIPTION']}{' '}
          <Link to='/login' state={redirect}>
            {language['LOGIN']}
          </Link>
        </p>
      </div>
    </Container>
  )
}

export default Restrict
