import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { CircularProgress } from '@mui/material'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useNotify from 'hooks/useNotify'
import { CustomButton } from 'styles'
import { exportElementPdf, PaperSize, paperHeightPx, paperWidthPx, waitForImages } from 'utils/pdf'
import { IInvoiceData, InvoiceDocument } from './InvoiceDocument'

const papers: { value: PaperSize, label: string, size: string }[] = [
  { value: 'A4', label: 'A4', size: '210 × 297 mm' },
  { value: 'A5', label: 'A5', size: '148 × 210 mm' },
]

// "Export Invoice" for one sale (paymentId) or a group payment (groupId): a
// dialog to pick A4 / A5, preview, then Print or Save PDF. Shows nothing
// unless Store Config › Soft Invoice is turned on.
export const SoftInvoiceActions = ({ paymentId, groupId, style }: { paymentId?: string | null, groupId?: string | null, style?: CSSProperties }) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const { notify } = useNotify()
  const [data, setData] = useState<IInvoiceData | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paper, setPaper] = useState<PaperSize>('A4')
  const [defaultPaper, setDefaultPaper] = useState<PaperSize>('A4')
  const [busy, setBusy] = useState<'print' | 'pdf' | null>(null)
  const documentRef = useRef<HTMLDivElement>(null)
  const url = groupId ? `/sale/payment/invoice/group/${groupId}` : paymentId ? `/sale/payment/invoice/${paymentId}` : null

  const load = () => url
    ? Axios({ method: 'GET', url }).then((response) => {
      const result = response?.data?.data
      setData(result)
      return result
    })
    : Promise.resolve(null)

  // Learn whether soft invoices are on, and the default paper size
  useEffect(() => {
    setData(null)
    setEnabled(false)
    load()
      .then((result) => {
        setEnabled(!!result?.setting?.enabled)
        if (result?.setting?.paperSize) setDefaultPaper(result.setting.paperSize)
      })
      .catch(() => setEnabled(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // Opening reloads the sale so the invoice shows it as it is now
  const handleOpen = () => {
    setPaper(defaultPaper)
    setOpen(true)
    setLoading(true)
    load()
      .catch((err) => notify(err?.response?.data?.msg || 'Could not load the invoice', 'error'))
      .finally(() => setLoading(false))
  }

  const invoiceNo = data?.group?.invoice || data?.payment?.invoice || 'invoice'

  const print = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: invoiceNo,
    pageStyle: `@page { size: ${paper}; margin: 0 } html, body { margin: 0 }`,
    onBeforeGetContent: () => (documentRef.current ? waitForImages(documentRef.current).then(() => undefined) : Promise.resolve()),
    onAfterPrint: () => setBusy(null),
    onPrintError: () => {
      setBusy(null)
      notify('Could not open the print window', 'error')
    },
  })

  const handlePrint = () => {
    if (busy || !documentRef.current) return
    setBusy('print')
    print()
  }

  const handlePdf = () => {
    if (busy || !documentRef.current) return
    setBusy('pdf')
    const element = documentRef.current
    waitForImages(element)
      .then(() => exportElementPdf(element, `${invoiceNo}.pdf`, paper))
      .catch((err) => notify(err?.message || 'Could not create the PDF', 'error'))
      .finally(() => setBusy(null))
  }

  if (!enabled || !url) return null

  // The preview is the real document, scaled down to fit the dialog
  const previewWidth = width < 1024 ? Math.min(width - 80, 360) : 360
  const scale = previewWidth / paperWidthPx[paper]

  return (
    <>
      <CustomButton
        styled={theme}
        onClick={handleOpen}
        style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, width: '100%', ...style }}
      >
        <DescriptionRoundedIcon style={{ fontSize: 19, marginRight: 5 }} />
        Export&nbsp;Invoice
      </CustomButton>

      {/* AlertDialog leaves an empty <div> where it's placed, which would take
          a slot (and a gap) in the button row; the dialog itself opens over
          the page, so the placeholder can be hidden */}
      <span style={{ display: 'none' }}>
      <AlertDialog isOpen={open} handleClose={() => !busy && setOpen(false)}>
        <DialogTitle title={`Export Invoice${data ? ` · ${invoiceNo}` : ''}`} onClose={() => !busy && setOpen(false)} />
        <div style={{ display: 'flex', flexDirection: width < 1024 ? 'column' : 'row', gap: 20, padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
          {/* Preview */}
          <div
            style={{
              width: previewWidth,
              height: paperHeightPx[paper] * scale,
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: theme.radius.secondary,
              border: theme.border.quaternary,
              backgroundColor: '#ffffff',
              position: 'relative',
            }}
          >
            {loading || !data ? (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><CircularProgress size={24} /></div>
            ) : (
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: paperWidthPx[paper] }}>
                <InvoiceDocument data={data} paperSize={paper} />
              </div>
            )}
          </div>

          {/* Paper size and actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
            <span style={{ color: theme.text.secondary, fontSize: 14 }}>Paper size</span>
            {papers.map((option) => {
              const active = paper === option.value
              return (
                <div
                  key={option.value}
                  role='button'
                  onClick={() => !busy && setPaper(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: theme.radius.secondary,
                    border: active ? `1px solid ${theme.color.info}` : theme.border.quaternary,
                    backgroundColor: active ? `${theme.color.info}14` : 'transparent',
                    color: active ? theme.color.info : theme.text.secondary,
                    cursor: busy ? 'default' : 'pointer',
                  }}
                >
                  <b>{option.label}</b>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>{option.size}</span>
                </div>
              )
            })}
            <div style={{ flex: 1 }} />
            <CustomButton
              styled={theme}
              onClick={handlePrint}
              disabled={!data || loading || !!busy}
              style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, width: '100%' }}
            >
              {busy === 'print' ? <CircularProgress size={14} style={{ color: theme.color.info, marginRight: 6 }} /> : <PrintRoundedIcon style={{ fontSize: 19, marginRight: 6 }} />}
              Print
            </CustomButton>
            <CustomButton
              styled={theme}
              onClick={handlePdf}
              disabled={!data || loading || !!busy}
              style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error, width: '100%' }}
            >
              {busy === 'pdf' ? <CircularProgress size={14} style={{ color: theme.color.error, marginRight: 6 }} /> : <PictureAsPdfRoundedIcon style={{ fontSize: 19, marginRight: 6 }} />}
              Save&nbsp;PDF
            </CustomButton>
          </div>
        </div>
      </AlertDialog>
      </span>

      {/* Full size, off screen: what is printed and captured into the PDF */}
      {open && data && (
        <div style={{ position: 'fixed', left: -10000, top: 0 }} aria-hidden>
          <InvoiceDocument ref={documentRef} data={data} paperSize={paper} />
        </div>
      )}
    </>
  )
}
