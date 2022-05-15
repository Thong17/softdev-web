import useNotify from 'hooks/useNotify'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { SelectInput, TextInput, FileInput } from 'components/shared/form'
import useWeb from 'hooks/useWeb'
import { Button } from '@mui/material'

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
                                'select text number' 
                                'email password date'
                                'file file file'

                              `
              : ` 
                                'select text text' 
                                'number number date'
                                'email email email'
                                'password password password'
                                'file file file'
                              `,
        }}
      >
        <div style={{ gridArea: 'select' }}>
          <SelectInput
            onChange={(event) => console.log(event.target.value)}
            options={[{ label: 'Nine', value: 9, selected: true }, { label: 'Test', value: 4 }]}
            label='Gender'
            defaultValue=''
          />
        </div>
        <div style={{ gridArea: 'text' }}>
          <TextInput
            onChange={(event) => console.log(event.target.value)}
            type='text'
            label='Test'
            err='You are not allowed'
          />
        </div>
        <div style={{ gridArea: 'date' }}>
          <TextInput type='date' label='Date' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'number' }}>
          <TextInput type='number' label='Number' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'email' }}>
          <TextInput type='email' label='Email' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'password' }}>
          <TextInput type='password' label='Password' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'file' }}>
          <FileInput label='Upload' name='file1' height={100} onChange={(event) => console.log(event.target.files)} />
        </div>
        
      </div>
      <div><Button variant='contained'>Button</Button></div>

    </Container>
  )
}
