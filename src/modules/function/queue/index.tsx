
import Container from 'components/shared/Container'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'

export const Queue = () => {
  const { theme } = useTheme()

  return (
    <Container
      header={
        <Header
          styled={theme}
        />
      }
    >
      Hello Queue Page
    </Container>
  )
}
