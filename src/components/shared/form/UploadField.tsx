import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { CustomUpload } from 'styles'

interface IUploadField extends InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: string
  height?: string | number
  err?: string
  value?: string
  hint?: string
}

const Input: ForwardRefRenderFunction<HTMLInputElement, IUploadField> = (
  { name, label, err, hint, height, value, ...props }, ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomUpload styled={theme} device={device}>
      <label htmlFor={name} className={ err && 'input-error' } style={{ height: height ? height : 35 }}>
        {value ? <img src={value} alt={value} /> : <span>Drag & Drop</span>}
      </label>
      <input ref={ref} type='file' name={name} id={name} {...props} />
      <span className='label'>{label}</span>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomUpload>
  )
}

const FileInput = forwardRef(Input)

export { FileInput }


