import { forwardRef, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { currencyFormat, timeFormat } from 'utils'

const formatPromotion = (promotion) => {
  if (!promotion?.value) return '-'
  return currencyFormat(promotion.value, promotion.type)
}

const cell = { padding: '8px 10px', borderBottom: '1px solid #e5e5e5' }

// A4 layout of a saved quotation. It is rendered as HTML and captured into the
// PDF so Khmer text and the store font are shaped by the browser.
export const QuotationDocument = forwardRef(({ quotation, store }: any, ref: any) => {
  const customer = quotation?.customer
  const [discount] = quotation?.discounts || []
  const [tax] = quotation?.services || []
  const [voucher] = quotation?.vouchers || []

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        minHeight: 1123,
        padding: 48,
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#222222',
        fontFamily: store?.font || 'inherit',
        fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          {store?.logo?.filename && (
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${store.logo.filename}`}
              alt='logo'
              crossOrigin='anonymous'
              style={{ width: 70, height: 70, objectFit: 'contain' }}
            />
          )}
          <div>
            <div style={{ fontSize: 22, fontWeight: 'bold' }}>{store?.name}</div>
            {store?.address && <div style={{ color: '#666666' }}>{store.address}</div>}
            {store?.contact && <div style={{ color: '#666666' }}>{store.contact}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 'bold', letterSpacing: 2 }}>QUOTATION</div>
          <div style={{ marginTop: 5 }}>No. <b>{quotation?.invoice}</b></div>
          <div>Date: {timeFormat(quotation?.createdAt, 'YYYY-MM-DD')}</div>
          {quotation?.expireAt && <div>Valid until: {timeFormat(quotation.expireAt, 'YYYY-MM-DD')}</div>}
        </div>
      </div>

      <div style={{ marginTop: 30, padding: 15, backgroundColor: '#f6f6f6', borderRadius: 6 }}>
        <div style={{ color: '#666666', marginBottom: 3 }}>Quotation for</div>
        <div style={{ fontWeight: 'bold' }}>{customer?.displayName || customer?.fullName || '-'}</div>
        {customer?.fullName && customer?.displayName && <div>{customer.fullName}</div>}
        {customer?.contact && <div>{customer.contact}</div>}
        {customer?.address && <div>{customer.address}</div>}
      </div>

      <table style={{ width: '100%', marginTop: 25, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#222222', color: '#ffffff', textAlign: 'left' }}>
            <th style={{ ...cell, width: 40, textAlign: 'center' }}>No</th>
            <th style={cell}>Description</th>
            <th style={{ ...cell, width: 60, textAlign: 'center' }}>Qty</th>
            <th style={{ ...cell, width: 100, textAlign: 'right' }}>Price</th>
            <th style={{ ...cell, width: 80, textAlign: 'center' }}>Discount</th>
            <th style={{ ...cell, width: 110, textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {quotation?.items?.map((item, index) => (
            <tr key={index}>
              <td style={{ ...cell, textAlign: 'center' }}>{index + 1}</td>
              <td style={cell}>
                {item.description}
                {item.note && <div style={{ color: '#888888', fontSize: 11 }}>{item.note}</div>}
              </td>
              <td style={{ ...cell, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ ...cell, textAlign: 'right' }}>{currencyFormat(item.price, item.currency)}</td>
              <td style={{ ...cell, textAlign: 'center' }}>{formatPromotion(item.discount)}</td>
              <td style={{ ...cell, textAlign: 'right' }}>{currencyFormat(item.total?.value, item.total?.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <div style={{ width: 280 }}>
          <SummaryRow label='Subtotal' value={currencyFormat(quotation?.subtotal?.BOTH, 'USD')} />
          {!!discount?.value && <SummaryRow label='Discount' value={<>-{formatPromotion(discount)}</>} />}
          {!!tax?.value && <SummaryRow label='Tax' value={<>+{formatPromotion(tax)}</>} />}
          {!!voucher?.value && <SummaryRow label='Voucher' value={<>-{formatPromotion(voucher)}</>} />}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '10px 0', borderTop: '2px solid #222222', fontSize: 16, fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{currencyFormat(quotation?.total?.value, quotation?.total?.currency)}</span>
          </div>
        </div>
      </div>

      {quotation?.note && (
        <div style={{ marginTop: 25 }}>
          <div style={{ fontWeight: 'bold' }}>Note</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{quotation.note}</div>
        </div>
      )}
      {store?.other && <div style={{ marginTop: 40, color: '#666666', textAlign: 'center', whiteSpace: 'pre-wrap' }}>{store.other}</div>}
    </div>
  )
})

const SummaryRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
    <span style={{ color: '#666666' }}>{label}</span>
    <span>{value}</span>
  </div>
)

export const exportQuotationPdf = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imageHeight = (canvas.height * pageWidth) / canvas.width
  const image = canvas.toDataURL('image/jpeg', 0.95)

  // Long quotations continue on extra pages by shifting the same image up
  let position = 0
  pdf.addImage(image, 'JPEG', 0, position, pageWidth, imageHeight)
  while (imageHeight + position > pageHeight + 1) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(image, 'JPEG', 0, position, pageWidth, imageHeight)
  }
  pdf.save(filename)
}

// Renders the document off screen, downloads it as a PDF, then calls `onDone`
export const QuotationPdfExporter = ({ quotation, store, onDone }: any) => {
  const documentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!quotation || !documentRef.current) return
    let cancelled = false
    // Wait for the logo so it is part of the capture
    const images = Array.from(documentRef.current.querySelectorAll('img'))
    Promise.all(images.map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve })))
      .then(async () => {
        if (cancelled) return
        await exportQuotationPdf(documentRef.current as HTMLElement, `${quotation.invoice}.pdf`)
        if (!cancelled) onDone(null)
      })
      .catch((err) => {
        if (!cancelled) onDone(err)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation])

  if (!quotation) return null
  return (
    <div style={{ position: 'fixed', left: -10000, top: 0 }} aria-hidden>
      <QuotationDocument ref={documentRef} quotation={quotation} store={store} />
    </div>
  )
}
