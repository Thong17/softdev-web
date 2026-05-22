import { TextField } from 'components/shared/form'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import Axios from 'constants/functions/Axios'
import useLanguage from 'hooks/useLanguage'
import { useState } from 'react'
import { CustomDetailContainer } from 'styles/container'
import { CustomButton } from 'styles/index'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Card, Stack, Typography } from '@mui/material'
import { getListPayment } from './redux'
import { useAppDispatch } from 'app/hooks'

export const ClearPaymentDialog = ({
  theme,
  dialog,
  setDialog,
  queryParams
 }: any) => {
  const {language} = useLanguage()
  const dispatch = useAppDispatch()

  const [clearPaymentDate, setClearPaymentDate] = useState({
    fromDate: '',
    toDate: ''
  });

  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  const proceedClearPayment = () => {
    Axios({
      method: 'DELETE',
      url: '/utility/clear-payment',
      body: {
        fromDate: clearPaymentDate.fromDate,
        toDate: clearPaymentDate.toDate
      }
    }).then(() => {
      dispatch(getListPayment({ query: queryParams }))
      handleCloseDialog()
    }).catch(console.error)
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <CustomDetailContainer styled={theme} width="auto" style={{ maxWidth: '700px', minWidth: '500px' }}>
        <h3 style={{ color: theme.text.primary }}>{language['CLEAR_PAYMENT']}</h3>
        <Card
          sx={{
            mt: 2,
            p: 1,
            borderRadius: 2,
            bgcolor: theme.color.warning + '22',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <WarningAmberRoundedIcon
              sx={{
                color: theme.color.warning,
                fontSize: 20,
                mt: '2px',
              }}
            />

            <div>
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.color.warning,
                  fontWeight: 600,
                }}
              >
                {language['WARNING']}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.text.secondary,
                }}
              >
                {language['CLEAR_PAYMENT_WARNING']}
              </Typography>
            </div>
          </Stack>
        </Card>
        <div style={{ display: 'flex', gap: 20, marginTop: 20, marginBottom: 20 }}>
          <div style={{ width: '50%' }}>
            <TextField
              value={clearPaymentDate.fromDate}
              onChange={(e) => setClearPaymentDate({ ...clearPaymentDate, fromDate: e.target.value })}
              type='datetime-local'
              label='Clear From'
            />
          </div>
          <div style={{ width: '50%' }}>
            <TextField
              value={clearPaymentDate.toDate}
              onChange={(e) => setClearPaymentDate({ ...clearPaymentDate, toDate: e.target.value })}
              type='datetime-local'
              label='Clear Until'
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
          <CustomButton
            onClick={handleCloseDialog}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.text.secondary}22`,
              color: theme.text.secondary,
            }}
          >
            {language['CLOSE']}
          </CustomButton>
          <CustomButton
            onClick={proceedClearPayment}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            {language['PROCEED']}
          </CustomButton>
        </div>
      </CustomDetailContainer>
    </AlertDialog>
  )
}
