import { Box } from '@mui/system'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import Carousel from 'react-spring-3d-carousel'
import { IImage } from '../form/UploadField'

export const CarouselContainer = ({ images = [] }: any) => {
  const [toSlide, setToSlide] = useState(0)
  const { theme } = useTheme()

  let slides = images?.map((image: IImage, key) => {
    return {
      key: key,
      content: (
        <div style={{ width: '100%', height: '100%' }} key={key}>
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
    <Box
      sx={{
        width: '100%',
        height: '100%',
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
  )
}
