import React, { useEffect, useState } from 'react'
import { IImage } from './form/UploadField'
import Carousel from 'react-spring-3d-carousel'
import { CustomProductInfo } from 'styles'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { FlexBetween } from './container/FlexBetween'
import { TextEllipsis } from './TextEllipsis'
import { Skeleton } from '@mui/material'
import useWeb from 'hooks/useWeb'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { currencyFormat } from 'utils'

export const ProductInfo = ({ info, previewColor, loading, ...props }: any) => {
  const [toSlide, setToSlide] = useState(0)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang, language } = useLanguage()
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
              loading='lazy'
            />
          </div>
        ),
        onClick: () => setToSlide(key),
      }
    })

  return (
    <CustomProductInfo styled={theme} {...props}>
      <div className='info-container'>
        {isLoading ? (
          <Skeleton
            variant='rectangular'
            height={180}
            style={{ borderRadius: theme.radius.secondary }}
          />
        ) : (
          <div className={`container`} style={{ height: 180 }}>
            {info?.images && (
              <Carousel
                slides={slides}
                goToSlide={toSlide}
                offsetRadius={Math.floor(slides?.length / 2)}
                showNavigation={false}
              />
            )}
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
        )}
        {isLoading ? (
          <div>
            <Skeleton
              variant='rectangular'
              height={20}
              style={{ marginTop: 20 }}
            />
            <Skeleton
              variant='rectangular'
              height={20}
              style={{ marginTop: 10 }}
            />
            <div style={{ display: 'flex', margin: '10px 0' }}>
              <Skeleton
                variant='rectangular'
                height={29}
                width='30%'
                style={{ marginRight: 10 }}
              />
              <Skeleton variant='rectangular' height={29} width='70%' />
            </div>
          </div>
        ) : (
          <div className='content'>
            <FlexBetween>
              <div>
                <TextEllipsis>
                  {info?.name?.[lang] || info?.name?.['English']}
                </TextEllipsis>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.text.quaternary,
                    fontSize: theme.responsive[device]?.text.quaternary,
                  }}
                >
                  <span>
                    {info?.category?.name?.[lang] ||
                      info?.category?.name?.['English']}
                  </span>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      margin: '0 5px',
                      backgroundColor: theme.text.quaternary,
                      borderRadius: theme.radius.circle,
                    }}
                  ></span>
                  <span>
                    {info?.brand?.name?.[lang] ||
                      info?.brand?.name?.['English']}
                  </span>
                </div>
              </div>
              <span
                style={{
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <SellRoundedIcon />
                {currencyFormat(info?.price, info?.currency)}
              </span>
            </FlexBetween>

            <p
              style={{
                marginTop: 10,
                fontSize: theme.responsive[device]?.text.tertiary,
                color: theme.text.tertiary,
                backgroundColor: theme.background.secondary,
                padding: 10,
                borderRadius: theme.radius.primary,
              }}
            >
              <InfoRoundedIcon
                style={{
                  marginRight: 5,
                  fontSize: theme.responsive[device]?.text.primary,
                  verticalAlign: 'text-bottom',
                }}
              />
              {info?.description}
            </p>
          </div>
        )}
      </div>
      {previewColor &&
        (isLoading ? (
          <div>
            <Skeleton
              variant='rectangular'
              height={30}
              style={{ marginTop: 20 }}
            />
            <Skeleton
              variant='rectangular'
              height={30}
              style={{ marginTop: 10 }}
            />
            <Skeleton
              variant='rectangular'
              height={30}
              style={{ marginTop: 10 }}
            />
            <Skeleton
              variant='rectangular'
              height={30}
              style={{ marginTop: 10 }}
            />
          </div>
        ) : (
          <div className='color-container'>
            <div
              style={{
                fontSize: theme.responsive[device]?.text.h4,
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowRightRoundedIcon fontSize='large' /> {language['COLOR']}
            </div>
            {info?.colors?.map((color, index) => {
              return (
                <div className='color' key={index}>
                  <div
                    style={{
                      position: 'relative',
                      boxSizing: 'border-box',
                      height: 40,
                      width: '70%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      className='code'
                      style={{
                        backgroundColor: color.code,
                        marginRight: 10,
                        minWidth: 7,
                      }}
                    ></div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <TextEllipsis>
                        {color?.name?.[lang] || color?.name?.['English']}
                      </TextEllipsis>
                      <TextEllipsis
                        style={{
                          color: theme.text.tertiary,
                          fontSize: theme.responsive[device]?.text.quaternary,
                        }}
                      >
                        {color?.description}
                      </TextEllipsis>
                    </div>
                  </div>
                  <span>+{currencyFormat(color.price, color.currency)}</span>
                </div>
              )
            })}
          </div>
        ))}
    </CustomProductInfo>
  )
}
