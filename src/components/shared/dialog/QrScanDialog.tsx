import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

const READER_ID = 'qr-scan-reader'

// Scans a QR code with the camera, or from an image (e.g. a screenshot of a
// customer's Telegram QR). Calls `onScan` with the text and closes.
export const QrScanDialog = ({ open, title = 'Scan QR Code', onScan, onClose }: {
  open: boolean
  title?: string
  onScan: (text: string) => void
  onClose: () => void
}) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  // The camera keeps reporting the same code; only the first one counts
  const doneRef = useRef(false)

  const stopCamera = async () => {
    const scanner = scannerRef.current
    scannerRef.current = null
    setCameraOn(false)
    if (!scanner) return
    try {
      if (scanner.isScanning) await scanner.stop()
      scanner.clear()
    } catch {}
  }

  const finish = async (text: string) => {
    if (doneRef.current) return
    doneRef.current = true
    await stopCamera()
    onScan(text)
  }

  useEffect(() => {
    if (!open) return
    setMessage('')
    doneRef.current = false
    let cancelled = false
    // The reader element exists once the dialog has rendered
    const timer = setTimeout(() => {
      if (cancelled || !document.getElementById(READER_ID)) return
      const scanner = new Html5Qrcode(READER_ID, { verbose: false })
      scannerRef.current = scanner
      scanner
        .start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 220 } }, (text) => finish(text), () => {})
        .then(() => !cancelled && setCameraOn(true))
        .catch(() => !cancelled && setMessage('Camera not available. Allow camera access, or scan an image of the QR code instead.'))
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(timer)
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setMessage('')
    // Scanning a file needs the camera stopped first
    await stopCamera()
    try {
      const scanner = new Html5Qrcode(READER_ID, { verbose: false })
      const text = await scanner.scanFile(file, false)
      scanner.clear()
      onScan(text)
    } catch {
      setMessage('No QR code found in that image.')
    }
  }

  const handleClose = async () => {
    await stopCamera()
    onClose()
  }

  return (
    <AlertDialog isOpen={open} handleClose={handleClose}>
      <DialogTitle title={title} onClose={handleClose} />
      <div style={{ width: width < 1024 ? '86vw' : 420, padding: '0 20px 20px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          id={READER_ID}
          style={{
            width: '100%',
            minHeight: cameraOn ? 0 : 120,
            borderRadius: theme.radius.secondary,
            overflow: 'hidden',
            backgroundColor: `${theme.text.secondary}11`,
          }}
        />
        <span style={{ fontSize: 13, color: message ? theme.color.error : theme.text.tertiary }}>
          {message || 'Point the camera at the QR code.'}
        </span>
        <input ref={fileRef} type='file' accept='image/*' onChange={handleFile} style={{ display: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            onClick={() => fileRef.current?.click()}
          >
            Scan from image
          </Button>
        </div>
      </div>
    </AlertDialog>
  )
}

export { parseTelegram } from 'utils/contactQr'
