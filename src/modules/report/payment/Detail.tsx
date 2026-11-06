import { directPrinting } from 'api/receipt.api'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { PaymentInvoice } from 'components/shared/invoice/PaymentInvoice'
import { PaymentReceipt } from 'components/shared/invoice/PaymentReceipt'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { getStore, selectStore } from 'modules/organize/store/redux'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { CustomDetailContainer } from 'styles/container'
import { CustomButton } from 'styles/index'
import { currencyFormat, timeFormat } from 'utils/index'
import { printReceipt } from 'utils/printer'

export const Detail = ({
  theme,
  dialog,
  setDialog,
 }: any) => {
  const [payment, setPayment] = useState(null)
  const { language } = useLanguage()
  const { data: storeInfo, status } = useAppSelector(selectStore)
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const [isLoading, setIsLoading] = useState(false)
  const printType: string = 'web_printing'

  useEffect(() => {
      if (status !== 'INIT') return
        dispatch(
          getStore({
            id: 'store',
            fields: [
              'name',
              'logo',
              'contact',
              'address',
              'type',
              'other',
              'font',
              'tax',
            ],
          })
        )
        // eslint-disable-next-line
  }, [status])
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  const invoiceRef = useRef(document.createElement('div'))
  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef?.current,
    documentTitle: 'Invoice',
  })

  const handlePrint = () => {
    if (printType === 'network_printing') {
      setIsLoading(true)
      directPrinting({
          name: storeInfo?.name,
          invoice: dialog.payment?.invoice,
          cashier: dialog.payment?.createdBy?.username,
          createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
          transactions: dialog.payment?.transactions?.map(item => ({
              item: item.description,
              qty: item.quantity,
              disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
              price: currencyFormat(item.price, item.currency, 0, true),
          })),
          subtotal: currencyFormat(dialog.payment?.subtotal?.USD, 'USD', 0, true),
          discount: currencyFormat(dialog.payment?.discounts[0]?.value, dialog.payment?.discounts[0]?.type, 0, true) + (dialog.payment?.discounts[0]?.isFixed ? ' Fixed' : ''),
          tax: currencyFormat(dialog.payment?.services[0]?.value, dialog.payment?.services[0]?.type, 0, true),
          total: currencyFormat(dialog.payment?.total?.value, dialog.payment?.total?.currency, 0, true),
          address: storeInfo?.address,
          footer: storeInfo?.other
      }, 'USB', 'thermal')
          .then(console.log)
          .catch(handlePrintInvoice)
          .finally(() => setIsLoading(false))
    } else {
      printReceipt({
        name: storeInfo?.name as string,
        invoice: dialog.payment?.invoice,
        cashier: dialog.payment?.createdBy?.username,
        createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
        transactions: dialog.payment?.transactions?.map(item => ({
            item: item.product?.name?.English ?? item.description,
            qty: item.quantity,
            disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
            price: currencyFormat(item.price, item.currency, 0, true),
            total: currencyFormat(item.total?.value, item.total?.currency, 0, true),
            options: item.options?.map(option => ({
              name: option.property?.name?.English,
              value: option.name?.English
            }))
        })),
        subtotal: currencyFormat(dialog.payment?.subtotal?.USD, 'USD', 0, true),
        discount: currencyFormat(dialog.payment?.discounts[0]?.value, dialog.payment?.discounts[0]?.type, 0, true) + (dialog.payment?.discounts[0]?.isFixed ? ' Fixed' : ''),
        tax: currencyFormat(dialog.payment?.services[0]?.value, dialog.payment?.services[0]?.type, 0, true),
        total: currencyFormat(dialog.payment?.total?.value, dialog.payment?.total?.currency, 0, true),
        address: storeInfo?.address,
        footer: storeInfo?.other,
        paymentMethod: dialog.payment?.paymentMethod,
      }, 'receipt').catch(err => notify(err.message, 'error'))
      printReceipt({
        name: storeInfo?.name as string,
        invoice: dialog.payment?.invoice,
        cashier: dialog.payment?.createdBy?.username,
        createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
        transactions: dialog.payment?.transactions?.map(item => ({
            item: item.product?.name?.English ?? item.description,
            qty: item.quantity,
            total: currencyFormat(item.total?.value, item.total?.currency, 0, true)
        })),
        subtotal: currencyFormat(dialog.payment?.subtotal?.USD, 'USD', 0, true),
        discount: currencyFormat(dialog.payment?.discounts[0]?.value, dialog.payment?.discounts[0]?.type, 0, true) + (dialog.payment?.discounts[0]?.isFixed ? ' Fixed' : ''),
        tax: currencyFormat(dialog.payment?.services[0]?.value, dialog.payment?.services[0]?.type, 0, true),
        total: currencyFormat(dialog.payment?.total?.value, dialog.payment?.total?.currency, 0, true),
        address: storeInfo?.address,
        footer: storeInfo?.other,
        paymentMethod: dialog.payment?.paymentMethod,
      }, 'store').catch(err => notify(err.message, 'error'))
    }
}

  useEffect(() => {
    setPayment(dialog?.payment)
  }, [dialog?.payment])

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div style={{ position: 'fixed', top: '-200%' }}>
        <div ref={invoiceRef}>
          <PaymentReceipt payment={payment} />
        </div>
      </div>
      <CustomDetailContainer styled={theme} width="auto">
        <PaymentInvoice payment={payment} />
        <div style={{ display: 'flex', gap: 10 }}>
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
            isLoading={isLoading}
            onClick={() => handlePrint()}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              width: '100%',
            }}
          >
            {language['PRINT']}
          </CustomButton>
        </div>
      </CustomDetailContainer>
    </AlertDialog>
  )
}
