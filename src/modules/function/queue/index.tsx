
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { getListQueue, selectListQueue } from './redux'
import { useEffect, useState } from 'react'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { dateFormat } from 'utils/index'
import useAuth from 'hooks/useAuth'
import { IconButton } from '@mui/material'
import CallRoundedIcon from '@mui/icons-material/CallRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { Detail } from './Detail'

const columnData: ITableColumn<any>[] = [
  { id: 'ticket', label: 'Ticket' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'createdAt', label: 'Created\u00a0At' },
  { id: 'createdBy', label: 'Created\u00a0By' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const mappedItem = (data, privilege, theme, onCancel, onCall) => {
  const action = <>
    {privilege?.queue?.update && (
      <IconButton
        size='small'
        onClick={() => onCall(data._id)}
        style={{
          backgroundColor: `${theme.color.info}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.info,
        }}
      >
        <CallRoundedIcon fontSize='small' />
      </IconButton>
    )}
    {privilege?.queue?.cancel && (
      <IconButton
        size='small'
        onClick={() => onCancel(data._id)}
        style={{
          backgroundColor: `${theme.color.error}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.error,
        }}
      >
        <ClearRoundedIcon fontSize='small' />
      </IconButton>
    )}
  </>
  return {
    _id: data._id,
    ticket: data.ticket?.toString().padStart(2, '0'),
    invoice: data.payment?.invoice,
    createdAt: dateFormat(data.createdAt),
    createdBy: data.createdBy?.username,
    action
  }
}

export const Queue = () => {
  const confirm = useAlert()
  const { notify } = useNotify()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListQueue)
  const [rowData, setRowData] = useState<any>([])
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    queueId: null
  })

  useEffect(() => {
    dispatch(getListQueue({}))
  }, [dispatch])

  useEffect(() => {
    const handleCancel = (id) => {
      confirm({
        title: 'Are you sure you want to cancel this queue?',
        description: 'By cancel this queue you will remove it from the list.',
        variant: 'error'
      })
       .then(() => {
        Axios({
          method: 'DELETE',
          url: `/function/queue/cancel/${id}`
        })
          .then(() => {
            setRowData(data => data.filter(item => item._id !== id))
          })
          .catch(err => notify(err?.response?.data?.msg))
       })
       .catch(() => {})
    }
    const handleCall = (id) => {
      setDetailDialog({ open: true, queueId: id })
    }

    setRowData(data.map(item => mappedItem(item, user?.privilege, theme, handleCancel, handleCall)))
    // eslint-disable-next-line
  }, [data])
  
  return (
    <Container
      header={
        <Header
          styled={theme}
        />
      }
    >
      <Detail
        dialog={detailDialog}
        setDialog={setDetailDialog}
        theme={theme}
      />
      <StickyTable columns={columnData} rows={rowData} pagination={false} />
    </Container>
  )
}
