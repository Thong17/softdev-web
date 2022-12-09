import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import { CustomUpload } from 'styles'
import Carousel from 'react-spring-3d-carousel'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

export interface IImage {
  filename: string
  _id: string
}

interface IUploadField extends InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: string
  height?: string | number
  err?: string
  images?: Array<IImage>
  hint?: string
  selected?: string
  handleDelete?: Function
  handleChangeActive?: Function
}

const Input: ForwardRefRenderFunction<HTMLInputElement, IUploadField> = (
  {
    name,
    label,
    err,
    hint,
    height,
    images,
    selected,
    handleChangeActive,
    handleDelete,
    ...props
  },
  ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [toSlide, setToSlide] = useState(0)
  const [active, setActive] = useState(selected)

  useEffect(() => {
    setActive(selected)
  }, [selected])

  let slides =
    images &&
    images.map((image: IImage, key) => {
      return {
        key: key,
        content: (
          <div className='img-container' key={key}>
            {height ? (
              <>
                <div
                  className='action'
                  onClick={() => {
                    handleDelete && handleDelete(image?._id)
                  }}
                >
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <label
                  htmlFor='preview'
                  className={`image ${active === image?._id && 'active'}`}
                  onClick={() => {
                    setActive(image?._id)
                    handleChangeActive && handleChangeActive(image?._id)
                  }}
                />
              </>
            ) : null}
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${image?.filename}`}
              alt='file upload'
              loading='lazy'
            />
          </div>
        ),
        onClick: () => setToSlide(key),
      }
    })

  return (
    <CustomUpload styled={theme} device={device}>
      {slides?.length ? (
        <div
          className={`container ${err && 'input-error'}`}
          style={{ height: height ? height : 35 }}
        >
          <Carousel
            slides={slides}
            goToSlide={toSlide}
            offsetRadius={Math.floor(slides.length / 2)}
            showNavigation={false}
          />
          <label htmlFor={name}>
            <PhotoCameraRoundedIcon />
          </label>
          {slides.length > 1 && (
            <div className='navigationButton'>
              {slides.map((slide) => (
                <div
                  key={slide.key}
                  className={slide.key === toSlide ? 'active' : ''}
                >
                  <span onClick={slide.onClick}></span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={name}
          className={`input ${err && 'input-error'}`}
          style={{ height: height ? height : 35 }}
        >
          <span>Drag & Drop</span>
        </label>
      )}
      <input ref={ref} type='file' name={name} id={name} {...props} />
      <span className='label'>{label}</span>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomUpload>
  )
}

const FileField = forwardRef(Input)

export { FileField }
