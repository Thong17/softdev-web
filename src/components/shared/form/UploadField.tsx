import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from 'react'
import { CustomUpload } from 'styles'

export interface IImage {
  filename: string,
  _id: string
}

interface IUploadField extends InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: string
  height?: string | number
  err?: string
  images?: Array<IImage>
  hint?: string,
  selected?: string
}

const Input: ForwardRefRenderFunction<HTMLInputElement, IUploadField> = (
  { name, label, err, hint, height, images, selected, ...props },
  ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  let slides = images && images.map((image: IImage, key) => {
    return <img src={`${process.env.REACT_APP_API_UPLOADS}${image?.filename}`} alt='file upload' key={key} className={selected === image._id ? 'active' : ''} />
  })

  return (
    <CustomUpload styled={theme} device={device}>
      <label
        htmlFor={name}
        className={err && 'input-error'}
        style={{ height: height ? height : 35 }}
      >
        
        {images?.length ? 
          (
            <>{slides}</>
          ) : (
            <span>Drag & Drop</span>
          )
        }
        
      </label>
      <input ref={ref} type='file' name={name} id={name} {...props} />
      <span className='label'>{label}</span>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomUpload>
  )
}

const FileField = forwardRef(Input)

export { FileField }
