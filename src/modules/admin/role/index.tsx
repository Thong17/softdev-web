import useNotify from 'hooks/useNotify'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'

export const Role = () => {
  const { notify } = useNotify()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='role' title='Table' />
        <button>Hello</button>
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <h1>Role</h1>
      <button onClick={() => notify('Success', 'success')}>Notify</button>
      <button onClick={() => notify('Fucked', 'error')}>Fuck</button>
      <button onClick={() => notify('Wawrn', 'warning')}>Wawrn</button>
      <button
        onClick={() =>
          notify(
            'useForm, you will receive the following methods register, unregister, errors, watch, handleSubmit, reset, setError, clearError, setValue, getValues, triggerValidation, control and formState.',
            'info'
          )
        }
      >
        By invoking
      </button>
    </Container>
  )
}
