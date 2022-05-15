import useNotify from 'hooks/useNotify'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import TextInput from 'components/shared/form/InputField'
import FileInput from 'components/shared/form/UploadField'
import SelectInput from 'components/shared/form/SelectField'
import useWeb from 'hooks/useWeb'

export const Role = () => {
  const { notify } = useNotify()
  const { device } = useWeb()

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
      <button onClick={() => notify('Wawrn', 'warning')}>Warn</button>
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas:
            device !== 'mobile'
              ? ` 
                                'text text number' 
                                'email password password'
                                'file file file'

                              `
              : ` 
                                'text text text' 
                                'number number number'
                                'email email email'
                                'password password password'
                                'file file file'
                              `,
        }}
      >
        <div style={{ gridArea: 'select' }}>
          <SelectInput onChange={() => console.log('hello')} options={[{ label: 'Test', value: 4 }]} />
        </div>
        <div style={{ gridArea: 'text' }}>
          <TextInput
            onChange={(event) => console.log(event)}
            type='text'
            label='Test'
          />
        </div>
        <div style={{ gridArea: 'number' }}>
          <TextInput type='number' label='Number' />
        </div>
        <div style={{ gridArea: 'email' }}>
          <TextInput type='email' label='Email' />
        </div>
        <div style={{ gridArea: 'password' }}>
          <TextInput type='password' label='Password' />
        </div>
        <div style={{ gridArea: 'file' }}>
          <FileInput label='File' name='file1' height={100} />
        </div>
      </div>
    </Container>
  )
}
