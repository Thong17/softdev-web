import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import ReportNavbar from './components/ReportNavbar'
import ReportBreadcrumbs from './components/Breadcrumbs'

export const Report = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <ReportBreadcrumbs page='report' title='Dashboard' />
      </>
    )
  }

  return (
    <Layout navbar={<ReportNavbar />}>
      {outlet || <Container header={<Header />}>Store Updated</Container>}
    </Layout>
  )
}