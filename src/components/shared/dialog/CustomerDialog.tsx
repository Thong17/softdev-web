import { AlertContainer } from 'components/shared/container/AlertContainer'
import useTheme from 'hooks/useTheme'
import { useForm } from 'react-hook-form'
import { MiniDetailField, MiniTextField } from '../form/InputField'
import Button from '../Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from 'shared/schema'
import { useState } from 'react'
import { CustomerContainer } from '../container/CustomerContainer'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { FileField, IImage } from '../form/UploadField'

const CustomerForm = ({ onClose, defaultValues, theme }) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues,
  })
  const { notify } = useNotify()
  const [profilePath, setProfilePath] = useState<IImage>(defaultValues?.picture)

  const submit = (data) => {
    Axios({
      method: 'POST',
      url: '/organize/customer/create',
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('picture', image)
    Axios({
      method: 'POST',
      url: `/shared/upload/picture`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then((data) => {
      const filename: IImage = data.data.data as IImage
      const fileId = data.data.data._id
      setValue('picture', fileId)
      setProfilePath(filename)
    })
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateAreas: `'lastName firstName firstName''phone phone dateOfBirth''profile profile profile''address address address''action action action'`,
        gridColumnGap: 20,
      }}
    >
      <div style={{ gridArea: 'lastName' }}>
        <MiniTextField
          type='text'
          label='Last Name'
          err={errors?.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <div style={{ gridArea: 'firstName' }}>
        <MiniTextField
          type='text'
          label='First Name'
          err={errors?.firstName?.message}
          {...register('firstName')}
        />
      </div>
      <div style={{ gridArea: 'phone' }}>
        <MiniTextField
          type='text'
          label='Phone'
          err={errors?.phone?.message}
          {...register('phone')}
        />
      </div>
      <div style={{ gridArea: 'dateOfBirth' }}>
        <MiniTextField
          type='date'
          label='Date Of Birth'
          err={errors?.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
      </div>
      <div style={{ gridArea: 'profile' }}>
        <FileField
          images={profilePath && [profilePath]}
          selected={getValues('profile')?._id}
          name='profile'
          label='Profile'
          accept='image/png, image/jpeg'
          onChange={handleChangeFile}
          height={130}
        />
      </div>
      <div style={{ gridArea: 'address' }}>
        <MiniDetailField
          label='Address'
          style={{ height: 70 }}
          {...register('address')}
        />
      </div>
      <div
        style={{
          gridArea: 'action',
          marginTop: 10,
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          style={{
            color: theme.color.error,
            backgroundColor: `${theme.color.error}22`,
          }}
          fullWidth
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          style={{
            marginLeft: 20,
            color: theme.color.info,
            backgroundColor: `${theme.color.info}22`,
          }}
          fullWidth
        >
          Add
        </Button>
      </div>
    </form>
  )
}

export const CustomerDialog = ({ dialog, setDialog }: any) => {
  const { theme } = useTheme()
  const [showForm, setShowForm] = useState(false)

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const handleClickCustomer = (data) => {
    console.log(data)
  }

  return (
    <AlertContainer
      justify='end'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          height: '100vh',
          width: '50vw',
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        {showForm ? (
          <CustomerForm
            onClose={() => setShowForm(false)}
            theme={theme}
            defaultValues={{}}
          />
        ) : (
          <Button
            style={{
              color: theme.color.info,
              backgroundColor: `${theme.color.info}22`,
            }}
            fullWidth
            onClick={() => setShowForm(true)}
          >
            Add Customer
          </Button>
        )}
        <div style={{ marginTop: 20 }}>
          <CustomerContainer onClickCustomer={handleClickCustomer} />
        </div>
      </div>
    </AlertContainer>
  )
}
