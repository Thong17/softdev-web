import { useEffect, useRef, useState } from 'react'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'

// The long side of a taken photo, in pixels: sharp enough for a product
// picture, and well under the server's 5 MB upload limit
const MAX_SIDE = 1600

// Takes a photo with the camera: a live preview, then Retake or Use photo.
// Where the browser can't use the camera (no camera, access refused, or a
// page without https), it offers the device's own camera or files instead.
export const CameraDialog = ({ open, title, onCapture, onClose }: {
  open: boolean
  title?: string
  onCapture: (file: File) => void
  onClose: () => void
}) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const { language } = useLanguage()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [facing, setFacing] = useState<'environment' | 'user'>('environment')
  const [cameras, setCameras] = useState(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [shot, setShot] = useState<{ file: File, url: string } | null>(null)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setReady(false)
  }

  const clearShot = () => {
    setShot((current) => {
      if (current) URL.revokeObjectURL(current.url)
      return null
    })
  }

  // Camera on while the dialog is open and no photo is being reviewed
  useEffect(() => {
    if (!open || shot) return
    let cancelled = false
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(language['CAMERA_NOT_AVAILABLE'] || 'Camera not available')
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then(async (stream) => {
        if (cancelled) return stream.getTracks().forEach((track) => track.stop())
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }
        setReady(true)
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => [])
        setCameras(devices.filter((device) => device.kind === 'videoinput').length)
      })
      .catch(() => !cancelled && setError(language['CAMERA_NOT_AVAILABLE'] || 'Camera not available'))
    return () => {
      cancelled = true
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facing, shot])

  // Nothing kept between openings (cleared on opening, so the last photo
  // stays on screen while the dialog fades out)
  useEffect(() => {
    if (open) clearShot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
      stopCamera()
      setShot({ file, url: URL.createObjectURL(blob) })
    }, 'image/jpeg', 0.9)
  }

  const handleClose = () => {
    stopCamera()
    clearShot()
    onClose()
  }

  // The photo stays on screen while the dialog closes (cleared on close)
  const acceptPhoto = (file: File) => {
    stopCamera()
    onCapture(file)
  }

  // The device's own camera app (on phones) or a file
  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) acceptPhoto(file)
  }

  const frame = {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: theme.radius.secondary,
    overflow: 'hidden',
    backgroundColor: '#000',
    display: 'grid',
    placeItems: 'center',
  } as const

  return (
    <AlertDialog isOpen={open} handleClose={handleClose}>
      <DialogTitle title={title || language['TAKE_PHOTO'] || 'Take photo'} onClose={handleClose} />
      <div style={{ width: width < 1024 ? '90vw' : 640, padding: '0 20px 20px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, color: theme.text.primary }}>
        <div style={frame}>
          {shot ? (
            <img src={shot.url} alt='' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : error ? (
            <span style={{ padding: 20, textAlign: 'center', fontSize: 14, color: '#fff' }}>{error}</span>
          ) : (
            <video
              ref={(element) => {
                // The stream may arrive before or after the video is on the page
                videoRef.current = element
                if (element && streamRef.current && element.srcObject !== streamRef.current) {
                  element.srcObject = streamRef.current
                  element.play().catch(() => {})
                }
              }}
              playsInline
              muted style={{ width: '100%', height: '100%', objectFit: 'contain', transform: facing === 'user' ? 'scaleX(-1)' : undefined }} />
          )}
        </div>
        {/* capture: phones open their camera app; computers choose a file */}
        <input ref={fileRef} type='file' accept='image/jpeg, image/png, image/webp' capture='environment' onChange={handleFile} style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {!shot && cameras > 1 && !error && (
            <Button
              onClick={() => setFacing((current) => (current === 'environment' ? 'user' : 'environment'))}
              style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}
            >
              <CameraswitchRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
              {language['SWITCH_CAMERA'] || 'Switch camera'}
            </Button>
          )}
          <span style={{ flex: 1 }} />
          {shot ? (
            <>
              <Button onClick={clearShot} style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}>
                {language['RETAKE'] || 'Retake'}
              </Button>
              <Button onClick={() => acceptPhoto(shot.file)} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
                {language['USE_PHOTO'] || 'Use photo'}
              </Button>
            </>
          ) : error ? (
            <Button onClick={() => fileRef.current?.click()} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
              <PhotoCameraRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
              {language['USE_DEVICE_CAMERA'] || 'Use the device camera or a file'}
            </Button>
          ) : (
            <Button disabled={!ready} onClick={capture} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
              <PhotoCameraRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
              {language['CAPTURE'] || 'Capture'}
            </Button>
          )}
        </div>
      </div>
    </AlertDialog>
  )
}
