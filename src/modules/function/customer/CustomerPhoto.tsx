import { useEffect, useMemo, useRef } from 'react'
import { Avatar, IconButton, Tooltip } from '@mui/material'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import useTheme from 'hooks/useTheme'

// Phone photos are often several MB, which is slow to sync on a weak
// connection: scale to at most 1024px and save as JPEG
export const resizeImage = (file: Blob, maxSize = 1024, quality = 0.85): Promise<Blob> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const context = canvas.getContext('2d')
      if (!context) return resolve(file)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    image.src = url
  })

export interface ICustomerPhoto {
  // A photo picked on this device, not uploaded yet
  file?: Blob | null
  // The saved photo's filename on the server
  filename?: string | null
  // false: the saved photo was removed
  keep?: boolean
}

export const CustomerPhoto = ({ value, onChange }: { value: ICustomerPhoto, onChange: (value: ICustomerPhoto) => void }) => {
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => (value.file ? URL.createObjectURL(value.file) : null), [value.file])
  useEffect(() => () => { preview && URL.revokeObjectURL(preview) }, [preview])
  const src = preview || (value.keep !== false && value.filename ? `${process.env.REACT_APP_API_UPLOADS}${value.filename}` : undefined)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    onChange({ ...value, file: await resizeImage(file) })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <Avatar src={src} sx={{ width: 64, height: 64, cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
        <AddAPhotoRoundedIcon />
      </Avatar>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, color: theme.text.secondary, cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
          {src ? 'Change photo' : 'Add photo'}
        </span>
        <span style={{ fontSize: 12, color: theme.text.quaternary }}>Saved with the customer, also offline</span>
      </div>
      {src && (
        <Tooltip title='Remove photo'>
          <IconButton size='small' style={{ color: theme.color.error }} onClick={() => onChange({ file: null, filename: value.filename, keep: false })}>
            <DeleteOutlineRoundedIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
      <input ref={inputRef} type='file' accept='image/*' hidden onChange={handleFile} />
    </div>
  )
}
