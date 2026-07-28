import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import StoreForm from './Form'
import { initState } from './redux/constant'

const Header = () => {
  return <><StoreBreadcrumbs page='storeCreate' /></>
}

export const CreateStore = () => {
  return (
    <Container header={<Header />}>
      <StoreForm defaultValues={initState} />
    </Container>
  )
}
