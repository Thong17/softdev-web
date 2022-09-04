import { MenuItem } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { getListStructure, selectListStructure } from 'shared/redux'
import { MenuDialog } from '../MenuDialog'
import GpsNotFixedRoundedIcon from '@mui/icons-material/GpsNotFixedRounded'
import { TextEllipsis } from '../TextEllipsis'
import useWeb from 'hooks/useWeb'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'

const SelectLabel = ({ structures }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 15,
        lineHeight: 1,
      }}
    >
      <GpsNotFixedRoundedIcon style={{ fontSize: 17 }} />
      {structures.length > 0 ? (
        <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'auto' }}>
          {structures.map((structure, key) => (
            <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                marginLeft: 5,
              }}
            >
              <span
                style={{ fontSize: theme.responsive[device]?.text.quaternary }}
              >
                {structure.title}
              </span>
              <div
                style={{
                  display: 'flex',
                  color: theme.text.quaternary,
                }}
              >
                <span style={{ fontSize: 11 }}>{structure.floor.floor}</span>
                <TextEllipsis
                  style={{
                    width: 'max-content',
                    textTransform: 'capitalize',
                    marginLeft: 3,
                    color: theme.text.quaternary,
                    fontSize: 11,
                  }}
                >
                  - {structure.type}
                </TextEllipsis>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span style={{ marginLeft: 5 }}>Type</span>
      )}
    </div>
  )
}

export const SelectStructure = ({ onContinue, structures }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectListStructure)
  const [listStructure, setListStructure] = useState<any[]>([])
  const [selectedStructures, setSelectedStructures] =
    useState<any[]>(structures)
  const [selected, setSelected] = useState<any[]>(structures)

  const menuRef = useRef<any>(document.createElement('div'))

  useEffect(() => {
    dispatch(getListStructure())
  }, [dispatch])

  useEffect(() => {
    setListStructure(data)
  }, [data])

  const handleAddStructure = (data) => {
    setSelectedStructures([...selectedStructures, data])
  }

  const handleContinue = () => {
    onContinue(selectedStructures)
    setSelected(selectedStructures)
    menuRef.current?.callCloseMenu()
  }

  const handleRemoveStructure = (id) => {
    setSelectedStructures((prev) => prev.filter((item) => item._id !== id))
  }

  return (
    <MenuDialog
      ref={menuRef}
      style={{
        height: 30,
        color: theme.text.secondary,
        borderRadius: theme.radius.primary,
      }}
      label={<SelectLabel structures={selected} />}
    >
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {listStructure?.map((structure, key) => {
          const isSelected = selectedStructures.some(
            (item) => item._id === structure._id
          )
          return (
            <MenuItem key={key}>
              <div
                onClick={() =>
                  isSelected
                    ? handleRemoveStructure(structure._id)
                    : handleAddStructure(structure)
                }
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
                {isSelected ? (
                  <DoneAllRoundedIcon
                    style={{
                      fontSize: 17,
                      marginLeft: 15,
                      color: theme.color.info,
                    }}
                  />
                ) : (
                  <DoneAllRoundedIcon
                    style={{
                      fontSize: 17,
                      marginLeft: 15,
                      color: theme.text.quaternary,
                    }}
                  />
                )}
              </div>
            </MenuItem>
          )
        })}
      </div>
      <MenuItem
        onClick={handleContinue}
      >
        <span style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
          Continue
        </span>
      </MenuItem>
    </MenuDialog>
  )
}
