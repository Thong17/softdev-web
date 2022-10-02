import { useEffect, useState } from 'react'
import {
  TextField,
  FileField,
  DetailField,
  SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { storeSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { IImage } from 'components/shared/form/UploadField'
import { InvoiceContainer } from 'components/shared/container/InvoiceContainer'
import useTheme from 'hooks/useTheme'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import { useNavigate } from 'react-router-dom'

const fontOption = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Sans Serif', value: 'sans-serif' },
  { label: 'Hanuman', value: 'Hanuman' },
  { label: 'PTSans', value: 'PTSans' },
]

const StoreForm = ({ defaultValues, id }: any) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(storeSchema), defaultValues })
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { width } = useWeb()
  const { notify, loadify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [iconPath, setIconPath] = useState<IImage>(defaultValues?.logo)
  const [preview, setPreview] = useState({
    ...defaultValues,
    logo: defaultValues?.logo?.filename,
  })
  const name = watch('name')
  const address = watch('address')
  const contact = watch('contact')
  const tax = watch('tax')
  const other = watch('other')

  const [font, setFont] = useState(defaultValues?.font)
  const fontValue = watch('font')

  useEffect(() => {
    const selectedStatus: any = fontOption.find(
      (key) => key.value === fontValue
    )
    setPreview((prev) => ({ ...prev, font: selectedStatus?.value }))
    setFont(selectedStatus?.value)
  }, [fontValue])

  useEffect(() => {
    setPreview((prev) => ({ ...prev, name, address, contact, tax, other }))
  }, [name, address, contact, tax, other])

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('icon', image)
    const response = Axios({
      method: 'POST',
      url: `/shared/upload/icon`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    loadify(response)
    response.then((data) => {
      const file: IImage = data.data.data as IImage
      const fileId = data.data.data._id
      setValue('logo', fileId)
      setIconPath(file)
      setPreview((prev) => ({ ...prev, logo: file?.filename }))
    })
  }

  const submit = async (data) => {
    Axios({
      method: 'PUT',
      url: `/organize/store/update/${id}`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: width > 1024 ? '500px 1fr' : '1fr',
        gridGap: 40,
      }}
    >
      <form
        onSubmit={handleSubmit(submit)}
        style={{
          height: 'fit-content',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas: `
                              'name name contact'
                              'type logo logo'
                              'font font tax'
                              'address address address'
                              'other other other'
                              'action action action'
                              `,
          }}
        >
          <div style={{ gridArea: 'name' }}>
            <TextField
              type='text'
              label='Name'
              err={errors?.name?.message}
              {...register('name')}
            />
          </div>
          <div style={{ gridArea: 'contact' }}>
            <TextField
              type='text'
              label='Contact'
              err={errors?.contact?.message}
              {...register('contact')}
            />
          </div>
          <div style={{ gridArea: 'type' }}>
            <TextField
              type='text'
              label='Type'
              err={errors?.type?.message}
              {...register('type')}
            />
          </div>
          <div style={{ gridArea: 'logo' }}>
            <FileField
              images={iconPath && [iconPath]}
              selected={getValues('logo')?._id}
              name='logo'
              label='Logo'
              accept='image/png, image/jpeg'
              onChange={handleChangeFile}
            />
          </div>
          <div style={{ gridArea: 'font' }}>
            <SelectField
              value={font}
              options={fontOption}
              label='Font'
              err={errors?.font?.message}
              {...register('font')}
            />
          </div>
          <div style={{ gridArea: 'tax' }}>
            <TextField
              icon={<PercentRoundedIcon fontSize='small' />}
              min={0}
              max={100}
              type='number'
              label='Tax'
              err={errors?.tax?.message}
              {...register('tax')}
            />
          </div>
          <div style={{ gridArea: 'address' }}>
            <DetailField
              type='text'
              label='Address'
              style={{ height: 70 }}
              {...register('address')}
            />
          </div>
          <div style={{ gridArea: 'other' }}>
            <DetailField
              type='text'
              label='Footer'
              style={{ height: 70 }}
              {...register('other')}
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
              variant='contained'
              style={{
                backgroundColor: `${theme.color.error}22`,
                color: theme.color.error,
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              type='submit'
              variant='contained'
              style={{
                marginLeft: 10,
                backgroundColor: `${theme.color.info}22`,
                color: theme.color.info,
              }}
            >
              {id ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0',
          width: '100%',
          border: theme.border.dashed,
          borderRadius: theme.radius.primary,
        }}
      >
        <InvoiceContainer
          name={preview?.name}
          address={preview?.address}
          contact={preview?.contact}
          logo={preview?.logo || 'default.png'}
          tax={preview?.tax}
          font={preview?.font}
          footer={preview?.other}
        />
      </div>
    </div>
  )
}

export default StoreForm
