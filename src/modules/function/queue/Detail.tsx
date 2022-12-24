import { DialogTitle } from 'components/shared/DialogTitle'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import Axios from 'constants/functions/Axios'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { CustomDetailContainer } from 'styles/container'
import { CustomButton } from 'styles/index'

const TransactionItem = ({ info }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: theme.text.secondary }}>
    <CircleIcon icon={info.profile?.filename} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TextEllipsis>{info.description}</TextEllipsis>
      <TextEllipsis style={{ color: theme.text.quaternary, fontSize: theme.responsive[device]?.text.quaternary }}>Qty: {info.quantity}</TextEllipsis>
    </div>
  </div>
}

export const Detail = ({
  theme,
  dialog,
  setDialog,
}: any) => {
  const { notify } = useNotify()
  const [data, setData] = useState<any>(null)
  const { language } = useLanguage()

  const handleCloseDialog = () => {
    setData(null)
    setDialog({ queueId: null, open: false })
  }

  useEffect(() => {
    if (!dialog.queueId) return
    Axios({
      method: 'GET',
      url: `/function/queue/detail/${dialog.queueId}`
    })
      .then((data) => {
        setData(data?.data?.data)
      })
      .catch(err => notify(err?.response?.data?.msg))
    // eslint-disable-next-line
  }, [dialog.queueId])

  const handleComplete = () => {
    if (dialog.queueId) return
    Axios({
      method: 'PUT',
      url: `/function/queue/complete/${dialog.queueId}`
    })
      .then(() => {
        handleCloseDialog()
      })
      .catch(err => notify(err?.response?.data?.msg))
  }

  const handleCall = () => {
    Axios({
      method: 'POST',
      url: `/function/queue/call/${dialog.queueId}`
    })
      .then(() => {})
      .catch(err => notify(err?.response?.data?.msg))
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title={`#Ticket ${data?.ticket || ''}`} onClose={handleCloseDialog} />
      <CustomDetailContainer styled={theme}>
        {data?.payment?.transactions?.map((transaction, key) => <TransactionItem key={key} info={transaction} />)}
      </CustomDetailContainer>
      <div style={{ display: 'flex', gap: 10, padding: 10 }}>
        <CustomButton
          onClick={handleCall}
          styled={theme}
          style={{
            borderRadius: theme.radius.secondary,
            backgroundColor: `${theme.color.info}22`,
            color: theme.color.info,
            width: '100%',
          }}
        >
          {language['CALL']}
        </CustomButton>
        <CustomButton
          onClick={handleComplete}
          styled={theme}
          style={{
            borderRadius: theme.radius.secondary,
            backgroundColor: `${theme.color.success}22`,
            color: theme.color.success,
            width: '100%',
          }}
        >
          {language['COMPLETE']}
        </CustomButton>
      </div>
    </AlertDialog>
  )
}
