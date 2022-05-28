import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { RoleForm } from './Form'
import { useParams } from 'react-router-dom'
import { getRole, selectRole } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

export const UpdateRole = () => {
  const dispatch = useAppDispatch()
  const { data: role, status } = useAppSelector(selectRole)
  const { id } = useParams()

  console.log(role, status);
  

  useEffect(() => {
    if (id) {
      dispatch(getRole(id))
    }
  }, [dispatch, id])
  
  
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='roleUpdate' title='Table' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <RoleForm />
    </Container>
  )
}
