import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { DetailField, TextField } from 'components/shared/form'
import { yupResolver } from '@hookform/resolvers/yup'
import { floorSchema } from './schema'
import { useForm } from 'react-hook-form'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { DeleteButton, UpdateButton } from 'components/shared/table/ActionButton'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded'
import { useState } from 'react'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListFloor } from './redux'
import useAlert from 'hooks/useAlert'
import useWeb from 'hooks/useWeb'
import { responsiveGrid } from 'utils'
import useLanguage from 'hooks/useLanguage'

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
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(floorSchema) })
  const { language } = useLanguage()
  const { guardClose, trackChanges } = useUnsavedChanges({ isDirty, enabled: !!dialog.open })
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { device } = useWeb()
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
      title: language['CONFIRM_DELETE_FLOOR'],
      description: language['DESC_DELETE_FLOOR'],
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

  // ✕, Cancel and the backdrop ask before discarding changes; closing after a save does not
  const handleCancelDialog = guardClose(handleCloseDialog)

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCancelDialog}>
      <DialogTitle title={language['FLOOR_FORM']} onClose={handleCancelDialog} />
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
          {...trackChanges}
          style={{
            fontFamily: theme.font.family,
            display: 'grid',
            gridColumnGap: 20,
            minWidth: device === 'mobile' ? undefined : 500,
            ...responsiveGrid(device === 'mobile', '1fr 1fr 1fr 1fr', `
                            'floor floor floor order'
                            'description description description description'
                            'action action action action'
                          `),
          }}
        >
          <div style={{ gridArea: 'floor' }}>
            <TextField
              type='text'
              label={language['FLOOR']}
              err={errors?.floor?.message}
              {...register('floor')}
            />
          </div>
          <div style={{ gridArea: 'order' }}>
            <TextField
              type='number'
              step='any'
              label={language['ORDER']}
              err={errors?.order?.message}
              {...register('order')}
            />
          </div>
          <div style={{ gridArea: 'description' }}>
            <DetailField
              type='text'
              label={language['DESCRIPTION']}
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
              floorId ? <Button onClick={handleCancelForm}>{language['CANCEL']}</Button> : <Button onClick={handleCancelDialog}>{language['CLOSE']}</Button>
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
              { floorId ? language['UPDATE'] : language['CREATE'] }
            </CustomButton>
          </div>
        </form>
      </div>
    </AlertDialog>
  )
}
