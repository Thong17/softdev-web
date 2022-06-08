import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { SelectField, TextField, FileField } from 'components/shared/form'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { Button } from '@mui/material'
import CropFreeIcon from '@mui/icons-material/CropFree';

export const Test = () => {
  const { notify } = useNotify()
  const { device } = useWeb()
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='user' title='Table' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <h1>Role</h1>
      <button onClick={() => notify('Success', 'success')}>Notify</button>
      <button onClick={() => notify('Fucked', 'error')}>Fuck</button>
      <button onClick={() => notify('Warn', 'warning')}>Warn</button>
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
          <SelectField
            onChange={(event) => console.log(event.target.value)}
            options={[{ label: 'Nine', value: 'test', selected: true }, { label: 'Test', value: 4 }]}
            label='Gender'
            value=''
            hint='This is hint'
          />
        </div>
        <div style={{ gridArea: 'text' }}>
          <TextField
            onChange={(event) => console.log(event.target.value)}
            type='text'
            label='Test'
            err='You are not allowed'
          />
        </div>
        <div style={{ gridArea: 'date' }}>
          <TextField type='date' label='Date' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'number' }}>
          <TextField type='number' label='Number' hint='This is info' icon={<CropFreeIcon />} onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'email' }}>
          <TextField type='email' label='Email' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'password' }}>
          <TextField type='password' label='Password' onChange={(event) => console.log(event.target.value)} />
        </div>
        <div style={{ gridArea: 'file' }}>
          <FileField label='Upload' hint='this is hint' name='file1' height={100} onChange={(event) => console.log(event.target.files)} />
        </div>
        
      </div>
      <div><Button variant='contained'>Button</Button></div>

    </Container>
  )
}
