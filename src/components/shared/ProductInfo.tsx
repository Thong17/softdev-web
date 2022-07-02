import React, { useEffect, useState } from 'react'
import { IImage } from './form/UploadField'
import Carousel from 'react-spring-3d-carousel'
import { CustomProductInfo } from 'styles'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { FlexBetween } from './container/FlexBetween'
import { TextEllipsis } from './TextEllipsis'
import { Skeleton } from '@mui/material'

export const ProductInfo = ({ info, loading, ...props }: any) => {
  const [toSlide, setToSlide] = useState(0)
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [isLoading, setIsLoading] = useState(loading)

  useEffect(() => {
    if (loading) { 
      setIsLoading(true)
      return
    } 

    const timeout = () => {
      return setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
    const timeoutId = timeout()
    return () => {
      clearTimeout(timeoutId)
    }
  }, [loading])
  
  let slides =
  info?.images &&
  info.images?.map((image: IImage, key) => {
    return {
      key: key,
      content: (
        <div className='img-container' key={key}>
          <img
            src={`${process.env.REACT_APP_API_UPLOADS}${image?.filename}`}
            alt='file upload'
          />
        </div>
      ),
      onClick: () => setToSlide(key),
    }
  })
  
  return (
    <CustomProductInfo styled={theme} {...props}>
      {
        isLoading 
          ? <Skeleton variant='rectangular' height={140} style={{ borderRadius: theme.radius.secondary }} />
          : <div
            className={`container`}
            style={{ height: 140 }}
          >
            {
              info?.images && <Carousel
                slides={slides}
                goToSlide={toSlide}
                offsetRadius={Math.floor(slides?.length / 2)}
                showNavigation={false}
              />
            }
            {slides?.length > 1 && (
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
      }
        {
          isLoading
           ? <div>
              <Skeleton variant='rectangular' height={20} style={{ marginTop: 20 }} />
              <Skeleton variant='rectangular' height={20} style={{ marginTop: 10 }} />
              <div style={{ display: 'flex', marginTop: 10 }}>
                <Skeleton variant='rectangular' height={20} width='30%' style={{ marginRight: 10 }} />
                <Skeleton variant='rectangular' height={20} width='70%' />
              </div>
            </div>
           : <div className="content">
                <FlexBetween>
                  <span style={{ marginRight: 10, color: theme.text.secondary }}>Product:</span>
                  <TextEllipsis>{info?.name?.[lang] || info?.name?.['English']}</TextEllipsis>
                </FlexBetween>
                <FlexBetween>
                  <span style={{ marginRight: 10, color: theme.text.secondary }}>Price:</span>
                  <TextEllipsis>{info?.price}{info?.currency}</TextEllipsis>
                </FlexBetween>
                <FlexBetween>
                  <span style={{ marginRight: 10, color: theme.text.secondary }}>Brand:</span>
                  <TextEllipsis>{info?.brand?.name?.[lang] || info?.brand?.name?.['English']}</TextEllipsis>
                </FlexBetween>
                <FlexBetween>
                  <span style={{ marginRight: 10, color: theme.text.secondary }}>Category:</span>
                  <TextEllipsis>{info?.category?.name?.[lang] || info?.category?.name?.['English']}</TextEllipsis>
                </FlexBetween>
              <span>{info?.description}</span>
            </div>
        }
        {
          isLoading
            ? <div>
              <Skeleton variant='rectangular' height={30} style={{ marginTop: 20 }} />
              <Skeleton variant='rectangular' height={30} style={{ marginTop: 10 }} />
              <Skeleton variant='rectangular' height={30} style={{ marginTop: 10 }} />
              <Skeleton variant='rectangular' height={30} style={{ marginTop: 10 }} />
            </div>
            : <div className="color-container">
              {
                info?.colors?.map((color, index) => {
                  return <div className='color' key={index}>
                    <span className='code' style={{ backgroundColor: color.code }}></span>
                    <span>{color?.name?.[lang] || color?.name?.['English']}</span>
                  </div>
                })
              }
            </div>
        }
    </CustomProductInfo>
  )
}
