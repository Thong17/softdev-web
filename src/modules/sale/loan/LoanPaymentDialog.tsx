import { useAppDispatch } from 'app/hooks'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IPaymentInfo, PaymentForm } from 'components/shared/form/PaymentForm'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import Axios from 'constants/functions/Axios'
import useAlert from 'hooks/useAlert'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { getDetailLoan } from './redux'
import { Box } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { InvoiceDetail } from 'components/shared/invoice/LoanInvoice'
import { renderDirection } from 'components/shared/container/LoanDetail'
import { currencyFormat } from 'utils/index'

const columnData: ITableColumn<any>[] = [
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'prepaymentInterest', label: 'INTEREST' },
  { id: 'totalInterest', label: 'TOTAL', align: 'right' },
]

export const LoanPaymentDialog = ({ dialog, setDialog }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null)
  const { language } = useLanguage()
  const {theme} = useTheme()
  const confirm = useAlert()
  const { notify } = useNotify()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!dialog?.payment) return
    setPaymentInfo(dialog?.payment)
  }, [dialog?.payment])

  const handleCloseDialog = () => {
    setDialog({ open: false, payment: null })
  }

  const handleCheckoutPayment = (data) => {
    const id = data?._id
    if (!id) return
    if (data.remainTotal.USD > 0) {
      notify('Not enough cash', 'error')
    } else {
      confirm({
        title: 'Are you sure you want to check out?',
        description: 'Checkout the payment will update the status to complete.',
        variant: 'info',
      })
        .then(() => {
          const body = {
            total: data.total,
            receiveCashes: data.receiveCashes,
            receiveTotal: data.receiveTotal,
            remainTotal: data.remainTotal,
            paymentMethod: data.paymentMethod,
          }
          Axios({
            method: 'PUT',
            url: `/sale/loan/payment/${id}`,
            body,
          })
            .then((data) => {
              const respData: any = data?.data?.data
              if (!respData) return
              setPaymentInfo({ ...paymentInfo, returnCashes: respData.returnCashes, status: true } as any)
              dispatch(getDetailLoan(dialog?.detail?.loan))
            })
            .catch((err) => {
              notify(err?.response?.data?.msg, 'error')
            })
        })
        .catch(() => null)
    }
  }

  const handlePrintPayment = (data) => {
    console.log(data)
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle
        title={language['LOAN_PAYMENT']}
        onClose={handleCloseDialog}
      />
      <PaymentForm
        paymentInfo={paymentInfo}
        paymentType={['cash', 'transfer']}
        onClear={handleCloseDialog}
        onClose={handleCloseDialog}
        onCheckout={handleCheckoutPayment}
        onPrint={handlePrintPayment}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            paddingTop: '30px',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              backgroundColor: `${theme.background.secondary}cc`,
              gap: '10px',
              display: 'flex',
              flexDirection: 'column-reverse',
              width: '100%',
              height: '100%',
              borderRadius: theme.radius.ternary,
              padding: '10px',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <Box sx={{
              boxSizing: 'border-box',
              marginTop: '11px',
              padding: '0 10px 30px 10px',
              width: '100%',
              height: 'calc(100% - 150px)',
              position: 'absolute',
              top: 0,
              left: 0,
              overflowY: 'auto',
            }}>
              <StickyTable backgroundColor='secondary' columns={columnData} rows={[]} pagination={false} />
            </Box>
            <Box sx={{ width: '100%', height: '180px' }}>
              <Box
                sx={{
                  position: 'relative',
                  backgroundColor: `${theme.background.primary}99`,
                  borderRadius: theme.radius.ternary,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px 20px',
                  boxSizing: 'border-box',
                  '&::before': {
                    content: `''`,
                    ...renderDirection('column', theme),
                    display: 'block',
                  },
                }}
              >
                <div>
                  <InvoiceDetail
                    color={theme.text.secondary}
                    label={language['PRINCIPLE_AMOUNT']}
                    value={currencyFormat(dialog.detail?.principalAmount?.value, dialog.detail?.principalAmount?.currency)}
                  />
                  <InvoiceDetail
                    color={theme.text.secondary}
                    label={language['INTEREST_AMOUNT']}
                    value={currencyFormat(dialog.detail?.interestAmount?.value, dialog.detail?.interestAmount?.currency)}
                  />
                  <InvoiceDetail
                    color={theme.color.error}
                    label={language['TOTAL_PENALTY']}
                    value={currencyFormat(dialog.payment?.penalty?.USD, 'USD')}
                  />
                </div>
              </Box>
              <Box
                sx={{
                  backgroundColor: `${theme.background.primary}99`,
                  height: '50px',
                  borderRadius: theme.radius.ternary,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 20px',
                }}
              >
                <Box component='span'>{language['GRAND_TOTAL']}</Box>
                <Box component='span'>
                  {currencyFormat(Math.max(0, dialog.payment?.total.value), dialog.payment?.total.currency)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </PaymentForm>
    </AlertDialog>
  )
}
