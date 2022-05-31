import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { RoleForm } from './Form'
import { useParams } from 'react-router-dom'
import { getRole, selectRole } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='roleUpdate' title='Table' />
    </>
  )
}

export const UpdateRole = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectRole)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getRole({ id, query: {}, fields: ['name', 'privilege', 'description'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <RoleForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
