import { AlertContainer } from 'components/shared/container/AlertContainer'
import useTheme from 'hooks/useTheme'
import { useForm } from 'react-hook-form'
import { MiniDetailField, MiniTextField } from '../form/InputField'
import Button from '../Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from 'shared/schema'
import { useEffect, useState } from 'react'
import { CustomerContainer } from '../container/CustomerContainer'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { FileField, IImage } from '../form/UploadField'
import { DialogTitle } from 'components/shared/DialogTitle'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'

const CustomerForm = ({ onClose, onChange, defaultValues, theme, id }) => {
  const {
    reset,
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues,
  })
  const { notify } = useNotify()
  const { language } = useLanguage()
  const [profilePath, setProfilePath] = useState<IImage>(defaultValues?.picture)

  useEffect(() => {
    setFocus('displayName')
  }, [setFocus])

  const submit = (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/customer/update/${id}` : '/organize/customer/create',
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        reset()
        onChange()
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
        gridTemplateAreas: `'displayName fullName fullName''contact contact dateOfBirth''profile profile profile''address address address''action action action'`,
        gridColumnGap: 20,
      }}
    >
      <div style={{ gridArea: 'displayName' }}>
        <MiniTextField
          type='text'
          label={language['DISPLAY_NAME']}
          err={errors?.displayName?.message}
          {...register('displayName')}
        />
      </div>
      <div style={{ gridArea: 'fullName' }}>
        <MiniTextField
          type='text'
          label={language['FULL_NAME']}
          err={errors?.fullName?.message}
          {...register('fullName')}
        />
      </div>
      <div style={{ gridArea: 'contact' }}>
        <MiniTextField
          type='text'
          label={language['CONTACT']}
          err={errors?.contact?.message}
          {...register('contact')}
        />
      </div>
      <div style={{ gridArea: 'dateOfBirth' }}>
        <MiniTextField
          type='date'
          label={language['DATE_OF_BIRTH']}
          err={errors?.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
      </div>
      <div style={{ gridArea: 'profile' }}>
        <FileField
          images={profilePath && [profilePath]}
          selected={getValues('picture')?._id}
          name='picture'
          label={language['PROFILE']}
          accept='image/png, image/jpeg'
          onChange={handleChangeFile}
          height={130}
        />
      </div>
      <div style={{ gridArea: 'address' }}>
        <MiniDetailField
          label={language['ADDRESS']}
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
          {language['CANCEL']}
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
          {id ? language['SAVE'] : language['CREATE']}
        </Button>
      </div>
    </form>
  )
}

export const CustomerDialog = ({ dialog, setDialog, onClickCustomer }: any) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { width } = useWeb()
  const [showForm, setShowForm] = useState(false)
  const [reload, setReload] = useState(false)
  const [customerForm, setCustomerForm] = useState({})
  const [customerId, setCustomerId] = useState(null)

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const handleClickCustomer = (data) => {
    onClickCustomer(data)
    handleCloseDialog()
  }

  const handleEditCustomer = (customer) => {
    setCustomerForm({
      displayName: customer?.displayName,
      fullName: customer?.fullName,
      dateOfBirth: customer?.dateOfBirth,
      contact: customer?.contact,
      address: customer?.address,
      picture: customer?.picture
    })
    setCustomerId(customer?._id)
    setShowForm(true)
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
          width: width > 1024 ? '50vw' : 'calc(100vw - 64px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle title={language['CUSTOMER']} onClose={handleCloseDialog} />
        <div
          style={{
            padding: '10px 20px 20px 20px',
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{ marginBottom: 20, height: '100%', position: 'relative' }}
          >
            <CustomerContainer
              onEditCustomer={handleEditCustomer}
              onClickCustomer={handleClickCustomer}
              toggleReload={reload}
              height={showForm ? '19.3vh' : '100%'}
            />
          </div>
          {showForm ? (
            <CustomerForm
              onClose={() => setShowForm(false)}
              theme={theme}
              defaultValues={customerForm}
              id={customerId}
              onChange={() => setReload(!reload)}
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
              {`${language['ADD']} ${language['CUSTOMER']}`}
            </Button>
          )}
        </div>
      </div>
    </AlertContainer>
  )
}
