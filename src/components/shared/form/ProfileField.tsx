import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import { CustomProfileUpload } from 'styles'
import Carousel from 'react-spring-3d-carousel'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'

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
    images,
    selected,
    handleChangeActive,
    handleDelete,
    height = 130,
    width = 130,
    ...props
  },
  ref
) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
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
    <CustomProfileUpload styled={theme} device={device}>
      {slides?.length ? (
        <div
          className={`container ${err && 'input-error'}`}
          style={{ height: height, width: width }}
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
          style={{ height: height, width: width }}
        >
          <span>{language['UPLOAD']}</span>
        </label>
      )}
      <input ref={ref} type='file' name={name} id={name} {...props} />
      <span className='label'>{label}</span>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomProfileUpload>
  )
}

const ProfileField = forwardRef(Input)

export { ProfileField }
