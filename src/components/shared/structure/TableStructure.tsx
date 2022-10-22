import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React, { useEffect, useState } from 'react'
import {
  StructureDirectionType,
  StructureSizeType,
  StructureStatusType,
} from 'shared/interface'
import { durationPriceFormat, statusReservation } from 'utils'
import { StructureStatus } from '.'
import { TextEllipsis } from '../TextEllipsis'

const tableSize = {
  small: {
    width: 100,
    height: 90,
  },
  medium: {
    width: 190,
    height: 110,
  },
  large: {
    width: 210,
    height: 130,
  },
}

const ChairStructure = ({ column, row }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        gridColumn: column,
        gridRow: row,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: theme.background.secondary,
          borderRadius: theme.radius.quaternary,
          boxShadow: theme.shadow.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            backgroundColor: theme.background.primary,
            borderRadius: theme.radius.ternary,
          }}
        ></span>
      </div>
    </div>
  )
}

export const TableStructure = ({
  size = 'small',
  title,
  price,
  description = '',
  status = 'vacant',
  length = 1,
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
  length?: number
  direction?: StructureDirectionType
  justify?: 'start' | 'center' | 'end'
  align?: 'start' | 'center' | 'end'
}) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { device } = useWeb()
  const [chairs, setChairs] = useState<any[]>([])

  useEffect(() => {
    let totalChair: any[] = []
    for (let index = 1; index < length + 1; index++) {
      totalChair = [
        ...totalChair,
        <ChairStructure
          key={`1${index}`}
          column={direction === 'row' ? `${index}/${index + 1}` : '1/2'}
          row={direction === 'row' ? '1/2' : `${index}/${index + 1}`}
        />,
        <ChairStructure
          key={`2${index}`}
          column={direction === 'row' ? `${index}/${index + 1}` : '2/3'}
          row={direction === 'row' ? '2/3' : `${index}/${index + 1}`}
        />,
      ]
    }
    setChairs(totalChair)
  }, [length, direction, status])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: align,
        justifyContent: justify,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              direction === 'row'
                ? `repeat(${length}, ${tableSize[size]?.width}px)`
                : `repeat(2, ${tableSize[size]?.height / 1.15}px)`,
            gridTemplateRows:
              direction === 'row'
                ? `repeat(2, ${tableSize[size]?.height / 1.5}px)`
                : `repeat(${length}, ${tableSize[size]?.height / 1.1}px)`,
          }}
        >
          {chairs}
        </div>
        <div
          style={{
            backgroundColor: theme.background.secondary,
            width:
              direction === 'row'
                ? tableSize[size]?.width * length
                : tableSize[size]?.width + 10,
            height:
              direction === 'row'
                ? tableSize[size]?.height
                : tableSize[size]?.height * length,
            borderRadius: theme.radius.quaternary,
            padding: '10px 20px 10px 10px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: `3px solid ${theme.background.primary}`,
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
                fontSize: theme.responsive[device]?.text.primary,
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
                title='Title'
                style={{ fontSize: theme.responsive[device]?.text.quaternary }}
              >
                {description}
              </TextEllipsis>
              <TextEllipsis
                style={{
                  fontSize: theme.responsive[device]?.text.quaternary,
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
    </div>
  )
}
