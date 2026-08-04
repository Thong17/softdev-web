import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { RoleForm } from './Form'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { selectUser, getUser } from './redux'
import { useEffect } from 'react'
import { inputDateFormat } from 'utils'

export const UpdateUser = () => {
  const dispatch = useAppDispatch()
  const { data, status } = useAppSelector(selectUser)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getUser({ id, query: {}, fields: ['username', 'email', 'role', 'expireAt'] }))
    }
  }, [dispatch, id])

  const defaultValues = { ...data, expireAt: inputDateFormat(data?.expireAt) }

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='userUpdate' title='Table' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <RoleForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
