import { Box } from '@mui/material'
import { IImage } from 'components/shared/form/UploadField'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import Carousel from 'react-spring-3d-carousel'

export const AttachmentDialog = ({ dialog, setDialog }: any) => {
  const [toSlide, setToSlide] = useState(0)
  const { theme } = useTheme()

  const handleCloseDialog = () => {
    setToSlide(0)
    setDialog({ open: false, attachments: [] })
  }

  let slides = dialog.attachments.map((image: IImage, key) => {
    return {
      key: key,
      content: (
        <div className='img-container' key={key}>
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
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <Box
        sx={{
          background: 'transparent',
          width: '80vw',
          height: '80vh',
          '.img-container': {
            'img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }
          },
          '& .navigationButton': {
            position: 'absolute',
            bottom: 20,
            zIndex: 10,
            width: '100%',
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& div': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 1,
              margin: '0 3px',
              borderRadius: theme.radius.circle,
              '& span': {
                display: 'inline-block',
                width: 15,
                height: 15,
                backgroundColor: theme.background.secondary,
                boxShadow: theme.shadow.inset,
                borderRadius: theme.radius.circle,
                cursor: 'pointer',
              },
            },
            '& div.active': {
              border: theme.border.quaternary,
              '& span': {
                backgroundColor: theme.active.primary,
              },
            },
          },
        }}
      >
        <Carousel
          slides={slides}
          goToSlide={toSlide}
          offsetRadius={Math.floor(slides?.length / 2)}
          showNavigation={false}
        />
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
      </Box>
    </AlertDialog>
  )
}
