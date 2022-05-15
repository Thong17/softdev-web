import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { CustomUpload } from 'styles'

interface IUploadField extends InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: string
  height?: string | number
}

const FileInput: ForwardRefRenderFunction<HTMLInputElement, IUploadField> = (
  { name, label, height, ...props }
) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomUpload styled={theme} device={device}>
      <span className='label'>{label}</span>
      <label htmlFor={name} style={{ height: height ? height : 35 }}>
        <span>Drag & Drop</span>
      </label>
      <input type='file' name={name} id={name} {...props} />
    </CustomUpload>
  )
}

export default FileInput
