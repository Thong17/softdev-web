import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import {
  StructureDirectionType,
  StructureSizeType,
  StructureStatusType,
} from 'shared/interface'
import { capitalizeText, statusReservation } from 'utils'
import { StructureStatus } from '.'
import { TextEllipsis } from '../TextEllipsis'

const roomSize = {
  small: {
    width: 200,
    height: 90,
  },
  medium: {
    width: 230,
    height: 110,
  },
  large: {
    width: 260,
    height: 130,
  },
}

export const RoomStructure = ({
  size = 'medium',
  title,
  description,
  status = 'vacant',
  area,
  direction = 'row',
  justify = 'center',
  align = 'center',
}: {
  size?: StructureSizeType
  title: string
  description: string
  status?: StructureStatusType
  area?: string
  direction?: StructureDirectionType
  justify?: 'start' | 'center' | 'end'
  align?: 'start' | 'center' | 'end'
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()
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
          borderRadius: theme.radius.quaternary,
          padding: '10px 20px',
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
            style={{
              fontSize: theme.responsive[device]?.text.h5,
              color: theme.text.tertiary,
            }}
          >
            {title}
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
              {capitalizeText(status)}
            </TextEllipsis>
          </div>
        </div>
        <StructureStatus status={status} styled={theme} />
      </div>
    </div>
  )
}
