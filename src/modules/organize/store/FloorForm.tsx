import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { DetailField, TextField } from 'components/shared/form'
import { yupResolver } from '@hookform/resolvers/yup'
import { floorSchema } from './schema'
import { useForm } from 'react-hook-form'
import { DeleteButton, UpdateButton } from 'components/shared/table/ActionButton'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded'
import { useState } from 'react'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListFloor } from './redux'
import useAlert from 'hooks/useAlert'

export const FloorForm = ({
  dialog,
  setDialog,
  theme,
}: any) => {
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(floorSchema) })
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const confirm = useAlert()
  const [floorId, setFloorId] = useState<null | string>(null)

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const submit = (data) => {
    Axios({
      method: floorId ? 'PUT' : 'POST',
      url: floorId ? `/organize/store/floor/update/${floorId}` : '/organize/store/floor/create',
      body: data
    })
      .then((data) => {
        dispatch(getListFloor())
        reset()
        setFloorId(null)
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }

  const handleUpdate = (id) => {
    setFloorId(id)
    const { floor, description, order } = dialog.floors?.find(floor => floor._id === id)
    setValue('floor', floor)
    setValue('description', description)
    setValue('order', order)
  }

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this floor?',
      description: 'Delete floor will remove all the layout in that floor.',
      variant: 'error'
    }).then(() => {
      Axios({
        method: 'DELETE',
        url: `/organize/store/floor/disable/${id}`,
      })
        .then((data) => {
          dispatch(getListFloor())
          notify(data?.data?.msg, 'success')
        })
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }).catch(() => {})
  }

  const handleCancelForm = () => {
    setFloorId(null)
    reset()
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle title='Floor Form' onClose={handleCloseDialog} />
      <div style={{ padding: 20, boxSizing: 'border-box' }}>
        <div
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: theme.radius.primary,
            color: theme.text.secondary,
            border: theme.border.dashed,
            fontFamily: theme.font.family,
            height: '33vh',
            overflow: 'auto',
            borderWidth: 2,
          }}
        >
          {dialog.floors?.map((item) => {
            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: theme.background.secondary,
                  padding: '7px 13px',
                  borderRadius: theme.radius.primary,
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <DragHandleRoundedIcon style={{ marginRight: 10, cursor: 'grab' }} />
                <TextEllipsis style={{ flex: '0 30%', display: 'flex', alignItems: 'center' }}>{item.floor}</TextEllipsis>
                <TextEllipsis style={{ flex: '0 50%', display: 'flex', alignItems: 'center'  }}>{item.description}</TextEllipsis>
                <span style={{ flex: '0 20%', display: 'flex', justifyContent: 'end' }}><UpdateButton onClick={() => handleUpdate(item._id)} /><DeleteButton onClick={() => handleDelete(item._id)} /></span>
              </div>
            )
          })}
        </div>
        <form
          style={{
            fontFamily: theme.font.family,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gridColumnGap: 20,
            minWidth: 500,
            gridTemplateAreas: `
                            'floor floor floor order'
                            'description description description description'
                            'action action action action'
                          `,
          }}
        >
          <div style={{ gridArea: 'floor' }}>
            <TextField
              type='text'
              label='Floor'
              err={errors?.floor?.message}
              {...register('floor')}
            />
          </div>
          <div style={{ gridArea: 'order' }}>
            <TextField
              type='number'
              step='any'
              label='Order'
              err={errors?.order?.message}
              {...register('order')}
            />
          </div>
          <div style={{ gridArea: 'description' }}>
            <DetailField
              type='text'
              label='Description'
              style={{ height: 70 }}
              {...register('description')}
            />
          </div>
          <div
            style={{
              gridArea: 'action',
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            {
              floorId ? <Button onClick={handleCancelForm}>Cancel</Button> : <Button onClick={handleCloseDialog}>Close</Button>
            }
            <CustomButton
              type='submit'
              style={{
                marginLeft: 10,
                backgroundColor: theme.background.secondary,
                color: theme.text.secondary,
              }}
              onClick={handleSubmit(submit)}
              styled={theme}
              autoFocus
            >
              { floorId ? 'Update' : 'Create' }
            </CustomButton>
          </div>
        </form>
      </div>
    </AlertDialog>
  )
}
