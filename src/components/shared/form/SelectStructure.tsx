import { MenuItem } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { getListStructure, selectListStructure } from 'shared/redux'
import { MenuDialog } from '../MenuDialog'
import GpsNotFixedRoundedIcon from '@mui/icons-material/GpsNotFixedRounded'
import { TextEllipsis } from '../TextEllipsis'
import useWeb from 'hooks/useWeb'

const SelectLabel = ({ structure }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 15,
        lineHeight: 1
      }}
    >
      <GpsNotFixedRoundedIcon style={{ fontSize: 17, marginRight: 5 }} />
      {structure ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <span style={{ fontSize: theme.responsive[device]?.text.quaternary }}>{structure.title}</span>
          <div
            style={{
              display: 'flex',
              color: theme.text.quaternary
            }}
          >
            <span style={{ fontSize: 11 }}>{structure.floor.floor}</span>
            <TextEllipsis style={{ width: 'max-content', textTransform: 'capitalize', marginLeft: 3, color: theme.text.quaternary, fontSize: 11 }}>- {structure.type}</TextEllipsis>
          </div>
        </div>
      ) : (
        <span>Type</span>
      )}
    </div>
  )
}

export const SelectStructure = ({ onClick }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListStructure)
  const [listStructure, setListStructure] = useState<any[]>([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(getListStructure())
  }, [dispatch])

  useEffect(() => {
    setListStructure(data)
  }, [data])

  const handleClick = (data) => {
    onClick(data)
    setSelected(data)
  }

  return (
    <MenuDialog
      style={{
        height: 30,
        color: theme.text.secondary,
        borderRadius: theme.radius.primary,
      }}
      label={<SelectLabel structure={selected} />}
    >
      {listStructure?.map((structure, key) => {
        return (
          <MenuItem key={key}>
            <div
              onClick={() => handleClick(structure)}
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 300,
                fontSize: theme.responsive[device]?.text.secondary,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '50%',
                }}
              >
                <TextEllipsis>{structure.title}</TextEllipsis>
                <div
                  style={{
                    display: 'flex',
                    color: theme.text.quaternary,
                    fontSize: theme.responsive[device]?.text.quaternary,
                  }}
                >
                  <span>{structure.floor.floor}</span>
                  <TextEllipsis
                    style={{ textTransform: 'capitalize', marginLeft: 3 }}
                  >
                    - {structure.type}
                  </TextEllipsis>
                </div>
              </div>
              <div
                style={{
                  flex: '20%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextEllipsis
                  style={{
                    color: theme.text.quaternary,
                    fontSize: theme.responsive[device]?.text.quaternary,
                  }}
                >
                  Size
                </TextEllipsis>
                <TextEllipsis style={{ textTransform: 'capitalize' }}>
                  {structure.size}
                </TextEllipsis>
              </div>
              <div
                style={{
                  textTransform: 'capitalize',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextEllipsis
                  style={{
                    color: theme.text.quaternary,
                    fontSize: theme.responsive[device]?.text.quaternary,
                  }}
                >
                  Size
                </TextEllipsis>
                <TextEllipsis style={{ textTransform: 'capitalize' }}>
                  {structure.status}
                </TextEllipsis>
              </div>
            </div>
          </MenuItem>
        )
      })}
    </MenuDialog>
  )
}
