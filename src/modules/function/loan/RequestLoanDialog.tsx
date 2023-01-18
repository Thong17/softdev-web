import { useAppDispatch, useAppSelector } from 'app/hooks'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { getListRequestLoan, selectListRequestLoan } from './redux'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded'
import { Box, IconButton } from '@mui/material'
import { currencyFormat, dateFormat } from 'utils/index'
import { CustomButton } from 'styles/index'
import useLanguage from 'hooks/useLanguage'
import { AttachmentDialog } from './AttachmentDialog'

const requestColumnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'Invoice' },
  { id: 'customer', label: 'Customer' },
  { id: 'contact', label: 'Contact' },
  { id: 'actualPaid', label: 'Actual\u00a0Paid' },
  { id: 'totalPaid', label: 'Total\u00a0Paid' },
  { id: 'totalRemain', label: 'Total\u00a0Remain' },
  { id: 'dueDate', label: 'Due\u00a0Date' },
  { id: 'attachment', label: 'Attachment' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

export const RequestLoanDialog = ({
  dialog,
  setDialog,
}: any) => {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListRequestLoan)
  const [rowData, setRowData] = useState<any>([])
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [attachmentDialog, setAttachmentDialog] = useState({ open: false, attachments: [] })

  useEffect(() => {
    dispatch(getListRequestLoan({}))
  }, [dispatch])

  useEffect(() => {
    const handleReject = (id) => {
      console.log(id);
      
    }
    const handleApprove = (id) => {
      console.log('approve', id)
    }
    const handlePreview = (attachments) => {
      setAttachmentDialog({ open: true, attachments })
    }

    setRowData(data.map(item => mappedItem(item, user?.privilege, theme, handleReject, handleApprove, handlePreview)))
    // eslint-disable-next-line
  }, [data, user?.privilege])
  
  const handleCloseDialog = () => {
    setDialog({ open: false })
  }

  const handleApproveAll = () => {

  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <AttachmentDialog dialog={attachmentDialog} setDialog={setAttachmentDialog} />
      <Box sx={{ padding: '10px', minWidth: '90vw', minHeight: '75vh' }}>
        <StickyTable columns={requestColumnData} rows={rowData} pagination={false} />
      </Box>
      <div style={{ display: 'flex', gap: 10, padding: 10 }}>
        <CustomButton
          onClick={handleCloseDialog}
          styled={theme}
          style={{
            borderRadius: theme.radius.secondary,
            backgroundColor: `${theme.color.error}22`,
            color: theme.color.error,
            width: '100%',
          }}
        >
          {language['CLOSE']}
        </CustomButton>
        <CustomButton
          onClick={handleApproveAll}
          styled={theme}
          style={{
            borderRadius: theme.radius.secondary,
            backgroundColor: `${theme.color.success}22`,
            color: theme.color.success,
            width: '100%',
          }}
        >
          {language['APPROVE_ALL']}
        </CustomButton>
      </div>
    </AlertDialog>
  )
}

const mappedItem = (data, privilege, theme, onReject, onApprove, onPreview) => {
  const action = (
    <>
      {privilege?.loan?.approve && (
        <IconButton
          size='small'
          onClick={() => onReject(data._id)}
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
      {privilege?.loan?.approve && (
        <IconButton
          size='small'
          onClick={() => onApprove(data)}
          style={{
            backgroundColor: `${theme.color.info}22`,
            borderRadius: theme.radius.primary,
            marginLeft: 5,
            color: theme.color.info,
          }}
        >
          <CheckRoundedIcon fontSize='small' />
        </IconButton>
      )}
    </>
  )

  const attachment = <IconButton
    size='small'
    onClick={() => onPreview(data.attachments)}
    style={{
      backgroundColor: `${theme.color.info}22`,
      borderRadius: theme.radius.primary,
      marginLeft: 5,
      color: theme.color.info,
    }}
  >
    <InsertLinkRoundedIcon fontSize='small' />
  </IconButton>

  return {
    _id: data._id,
    invoice: data.payment?.invoice,
    customer: data.customer?.displayName || '...',
    contact: data.customer?.contact || '...',
    actualPaid: currencyFormat(data.actualPaid.value, data.actualPaid.currency),
    totalPaid: currencyFormat(data.totalPaid.total, 'USD'),
    totalRemain: currencyFormat(data.totalRemain.USD, 'USD'),
    dueDate: dateFormat(null),
    attachment,
    action,
  }
}