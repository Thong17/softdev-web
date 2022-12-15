import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import {
  StructureDirectionType,
  StructureSizeType,
  StructureStatusType,
} from 'shared/interface'
import { durationPriceFormat, statusReservation } from 'utils'
import { StructureStatus } from '.'
import { TextEllipsis } from '../TextEllipsis'

const roomSize = {
  small: {
    width: '50%',
    height: '50%',
  },
  medium: {
    width: '70%',
    height: '70%',
  },
  large: {
    width: '90%',
    height: '90%',
  },
}

export const RoomStructure = ({
  size = 'medium',
  title,
  price,
  description,
  status = 'vacant',
  area,
  direction = 'row',
  justify = 'center',
  align = 'center',
}: {
  size?: StructureSizeType
  title: string
  price: any
  description?: string
  status?: StructureStatusType
  area?: string
  direction?: StructureDirectionType
  justify?: 'start' | 'center' | 'end'
  align?: 'start' | 'center' | 'end'
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: align,
        justifyContent: justify,
      }}
    >
      <div
        style={{
          backgroundColor: theme.background.secondary,
          width:
            direction === 'row'
              ? roomSize[size]?.width
              : roomSize[size]?.height,
          height:
            direction === 'row'
              ? roomSize[size]?.height
              : roomSize[size]?.width,
          borderRadius: theme.radius.primary,
          padding: '10px 20px 10px 10px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          gridArea: area,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <TextEllipsis
            title={price?.value > 0 ? `${price.value}${price.currency}/${price.duration}` : ''}
            style={{
              fontSize: theme.responsive[device]?.text.h5,
              color: theme.text.tertiary,
            }}
          >
            {price?.value > 0 ? <>{title}, {durationPriceFormat(price.value, price.currency, price.duration)}</> : title}
          </TextEllipsis>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <TextEllipsis
              style={{ fontSize: theme.responsive[device]?.text.quaternary }}
            >
              {description}
            </TextEllipsis>
            <TextEllipsis
              style={{
                fontSize: theme.responsive[device]?.text.tertiary,
                color: theme.color[statusReservation(status)],
              }}
            >
              {language[status.toUpperCase()]}
            </TextEllipsis>
          </div>
        </div>
        <StructureStatus status={status} styled={theme} />
      </div>
    </div>
  )
}
