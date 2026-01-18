import { Box } from '@mui/material'
import { IImage } from 'components/shared/form/UploadField'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import Carousel from 'react-spring-3d-carousel'
import Axios from 'constants/functions/Axios'
import { useParams } from 'react-router-dom'
import { IconButton } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

export const AttachmentDialog = ({ dialog, setDialog }: any) => {
  const [toSlide, setToSlide] = useState(0)
  const [slides, setSlides] = useState<any[]>([]);
  const { theme } = useTheme()
  const { id } = useParams()

  const handleCloseDialog = () => {
    setToSlide(0)
    setDialog({ open: false, attachments: [] })
  }

  const mapSlides = (attachments: IImage[]) => {
    return attachments.map((image: IImage, key) => {
      const isPdf = image?.filename?.toLowerCase().endsWith('.pdf');
      return {
        key: key,
        content: (
          <div className='img-container' key={key} style={{ width: '50vw', height: '80vh', backgroundColor: `${theme.background.secondary}22`, backdropFilter: 'blur(5px)' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
              <IconButton
                onClick={() => handleRemoveAttachment(image.id as string)}
                sx={{
                  width: 30,
                  height: 30,
                  color: theme.color.error,
                  backgroundColor: `${theme.color.error}22`,
                  backdropFilter: 'blur(5px)',
                  '&:hover': { backgroundColor: `${theme.color.error}55` },
                }}
              >
                <DeleteRoundedIcon style={{ fontSize: 19 }} />
              </IconButton>
            </div>
            {isPdf ? (
              <iframe
                src={`${process.env.REACT_APP_API_UPLOADS}${image?.filename}`}
                title='PDF file'
                style={{ width: '50vw', height: '65vh', border: 'none' }}
              />
            ) : (
              <img
                src={`${process.env.REACT_APP_API_UPLOADS}${image?.filename}`}
                alt='file upload'
                loading='lazy'
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
        ),
        onClick: () => setToSlide(key),
      }
    })
  }

  useEffect(() => {
    setSlides(mapSlides(dialog.attachments));
  }, [dialog.attachments]);

  const handleAddUpload = (e) => {
    const files = e.target.files
    const formData = new FormData()
    if (!files) return
    for (const element of files) {
      const file = element;
      formData.append('attachment', file)
    }
    const response = Axios({
      method: 'POST',
      url: `/sale/loan/uploadAttachment/${id}`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    response.then((resp) => {
      setSlides(mapSlides(resp.data.data.attachments))
    }).catch(console.error)
    e.target.value = ''
  }

  const handleRemoveAttachment = (fileId: string) => {
    const response = Axios({
      method: 'DELETE',
      url: `/sale/loan/removeAttachment/${id}`,
      body: { fileId },
    })
    response.then((resp) => {
      setSlides(mapSlides(resp.data.data.attachments))
    }).catch(console.error)
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog} hasTransparent={true}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
          <label style={{ cursor: 'pointer', color: theme.color.info, backgroundColor: `${theme.color.info}22`, padding: '5px 10px', borderRadius: theme.radius.secondary, backdropFilter: 'blur(5px)' }}>
            Add Attachment
            <input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={(e) => handleAddUpload(e)} multiple />
          </label>
        </div>
        <Box
          sx={{
            background: theme.background.primary,
            width: '80vw',
            height: '80vh',
            overflow: 'hidden',
            marginTop: '40px',
            borderRadius: theme.radius.quaternary,
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
      </div>
    </AlertDialog>
  )
}
