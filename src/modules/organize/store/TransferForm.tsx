import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { useEffect, useState } from 'react'
import { FileField, TextField } from 'components/shared/form'
import { yupResolver } from '@hookform/resolvers/yup'
import { transferSchema } from './schema'
import { useForm } from 'react-hook-form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { IImage } from 'components/shared/form/UploadField'
import { useAppDispatch } from 'app/hooks'
import { getListTransfer } from './redux'

export const TransferForm = ({
  dialog,
  setDialog,
  theme,
  defaultValues,
}: any) => {
  const {
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(transferSchema), defaultValues })
  const { notify } = useNotify()
  const [imagePath, setImagePath] = useState<IImage>(defaultValues?.image)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setImagePath(defaultValues?.image)
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleCloseDialog = () => {
    setDialog({ transferId: null, open: false })
  }

  const submit = (data) => {
    Axios({
      method: dialog.transferId ? 'PUT' : 'POST',
      url: dialog.transferId ? `/organize/store/transfer/update/${dialog.transferId}` : `/organize/store/transfer/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListTransfer())
        notify(data?.data?.msg, 'success')
        handleCloseDialog()
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('images', image)
    const response = Axios({
      method: 'POST',
      url: `/shared/upload/image`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    response.then((data) => {
      const fileIds = data.data.data.map(file => {
        return file._id
      })
      const files: IImage[] = data.data.data.map(file => {
        return { filename: file.filename, _id: file._id }
      })      
      
      setValue('image', fileIds[0])
      setImagePath(files[0])
    })
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title='Transfer' onClose={handleCloseDialog} />
      <form
        style={{
          minWidth: 500,
          display: 'grid',
          gridTemplateColumns: '1fr',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'title'
                            'image'
                            'action'
                          `,
        }}
      >
        <div style={{ gridArea: 'title' }}>
          <TextField
            type='text'
            label='Title'
            err={errors?.title?.message}
            {...register('title')}
          />
        </div>
        <div style={{ gridArea: 'image' }}>
          <FileField
            height={200}
            images={imagePath && [imagePath]}
            name='image'
            label='Image'
            accept='image/png, image/jpeg'
            err={errors?.image?.message}
            selected={getValues('image')}
            onChange={handleChangeFile}
          />
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={handleCloseDialog}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </Button>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            onClick={handleSubmit(submit)}
            styled={theme}
            autoFocus
          >
            {dialog.transferId ? 'Save' : 'Create'}
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
