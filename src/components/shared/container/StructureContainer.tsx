import React from 'react'
import Loading from '../Loading'
import { RoomStructure, TableStructure } from '../structure'
import { useEffect, useState } from 'react'
import { MiniSelectField } from 'components/shared/form'
import { IOptions } from 'components/shared/form/SelectField'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getLayoutStore,
  getListFloor,
  selectLayoutStore,
  selectListFloor,
} from 'modules/organize/store/redux'
import { mapStructures } from 'modules/organize/store/LayoutForm'
import useTheme from 'hooks/useTheme'
import { Box, MenuItem } from '@mui/material'
import { SelectTab } from '../form/SelectTab'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import { MenuDialog } from '../MenuDialog'
import { ReservationItem } from './ReservationContainer'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { calculateStructuresPrice } from 'utils/index'
import useAuth from 'hooks/useAuth'

export const StructureContainer = ({
  onClick,
  onRemove,
  selected,
  reload,
  selectFloor = false,
  actions,
}: any) => {
  const dispatch = useAppDispatch()
  const { data: storeLayout, status: statusLayout } =
    useAppSelector(selectLayoutStore)
  const { data: listFloor, status } = useAppSelector(selectListFloor)
  const [loading, setLoading] = useState(true)
  const [floor, setFloor] = useState('')
  const [column, setColumn] = useState<any>([])
  const [row, setRow] = useState<any>([])
  const [template, setTemplate] = useState('')
  const [structures, setStructures] = useState<any>([])
  const [mergedStructures, setMergedStructures] = useState<any>([])
  const [floorOption, setFloorOption] = useState<IOptions[]>([])
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedStructure, setSelectedStructure] = useState(selected || [])

  useEffect(() => {
    if (!floor) return
    setLoading(true)
    const params = new URLSearchParams()
    params.append('id', floor)
    dispatch(getLayoutStore({ query: params }))
    // eslint-disable-next-line
  }, [reload])

  useEffect(() => {
    setSelectedStructure(selected)
  }, [selected])

  useEffect(() => {
    dispatch(getListFloor())
  }, [dispatch])

  useEffect(() => {
    setFloorOption(
      listFloor?.map((item) => ({
        label: item.floor,
        value: item._id,
        tags: item.tags,
      }))
    )
  }, [listFloor])

  useEffect(() => {
    if (status !== 'SUCCESS' && !listFloor) return
    const floorId = listFloor[0]?._id
    if (floorId) {
      const params = new URLSearchParams()
      params.append('id', floorId)
      setFloor(floorId)
      dispatch(getLayoutStore({ query: params }))
    }
  }, [dispatch, status, listFloor])

  useEffect(() => {
    if (statusLayout !== 'SUCCESS') return

    setColumn(storeLayout?.column)
    setRow(storeLayout?.row)
    setStructures(storeLayout?.structures)
    setMergedStructures(storeLayout?.mergedStructures)
  }, [storeLayout, statusLayout])

  useEffect(() => {
    let template = ''
    let newStructures: any[] = []
    row.forEach((r) => {
      let rowTemplate = ''
      column.forEach((c) => {
        const id = ` B${r}S${c}`

        rowTemplate += id
        newStructures = [
          ...newStructures,
          { id, type: 'blank', direction: 'row', row: r, column: c },
        ]
      })
      template += `"${rowTemplate}"`
    })
    setStructures((currentStructures) =>
      mapStructures(currentStructures, newStructures)
    )

    mergedStructures?.forEach((item) => {
      template = template.replace(item.originId, item.id)
    })

    setTemplate(template)
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [column, row, mergedStructures])

  const handleChangeFloor = (event) => {
    setLoading(true)
    const id = event.target.value
    setFloor(id)
    const params = new URLSearchParams()
    params.append('id', id)
    dispatch(getLayoutStore({ query: params }))
  }

  const handleChangeTab = (floor) => {
    setLoading(true)
    setFloor(floor)
    const params = new URLSearchParams()
    params.append('id', floor)
    dispatch(getLayoutStore({ query: params }))
  }

  const handleAddStructure = (data) => {
    onClick && onClick(data)
  }

  const handleRemoveStructure = (id) => {
    onRemove && onRemove(id)
  }

  const handleCreateReservation = (structure) => {
    const { price, structuresIds } = calculateStructuresPrice([structure], user?.drawer?.buyRate)
    Axios({
      method: 'POST',
      url: '/sale/reservation/create',
      body: {
        price: { value: price.toFixed(3), currency: 'USD', duration: '1h' },
        structures: structuresIds
      }
    })
      .then((data: any) => {
        navigate(`/sale/reservation/${data?.data?.data?._id}`)
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 5,
        }}
      >
        {floorOption?.length > 0 && (
          <SelectTab
            options={floorOption}
            onChange={handleChangeTab}
            selected={floor}
          />
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
          }}
        >
          {selectFloor && (
            <MiniSelectField
              style={{ width: 100 }}
              options={floorOption}
              value={floor}
              onChange={handleChangeFloor}
              search={true}
            />
          )}
          {actions}
        </div>
      </div>
      <div
        className='structure-container'
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateAreas: template,
          gridGap: '1px',
          width: '100%',
          boxSizing: 'border-box',
          padding: 20,
          overflow: 'auto',
          minHeight: '85vh',
          border: theme.border.dashed,
          borderRadius: theme.radius.primary,
        }}
      >
        {loading 
          ? <Loading /> 
          : structures?.map((structure, index) => {
            const isSelected = selectedStructure?.some(
              (item) => item._id === structure._id
            )

            if (structure.merged && structure.isMain === false)
              return <div key={index} style={{ display: 'none' }}></div>
            if (structure.type === 'blank') {
              return (
                <div
                  key={index}
                  style={{
                    gridArea: `${structure.id}`,
                    backgroundColor: `${theme.background.secondary}33`,
                    borderRadius: theme.radius.primary,
                  }}
                ></div>
              )
            } else {
              switch (structure.type) {
                case 'table':
                  return (
                    <Box
                      onClick={() =>
                        isSelected
                          ? handleRemoveStructure(structure._id)
                          : handleAddStructure(structure)
                      }
                      key={index}
                      className='structure'
                      sx={{
                        position: 'relative',
                        gridArea: `${structure.id}`,
                        backgroundColor: isSelected
                          ? `${theme.active.primary} !important`
                          : `${theme.background.secondary}33`,
                        borderRadius: theme.radius.primary,
                        cursor: onClick ? 'pointer' : 'default',
                        '&:hover': { backgroundColor: theme.active.secondary },
                      }}
                    >
                      <SelectReservation reservations={structure.reservations} onCreate={() => handleCreateReservation(structure)} />
                      <TableStructure
                        title={structure.title}
                        price={structure.price}
                        length={structure.length}
                        size={structure.size}
                        align={structure.align}
                        justify={structure.justify}
                        direction={structure.direction}
                        status={structure.status}
                      />
                    </Box>
                  )
                default:
                  return (
                    <Box
                      onClick={() =>
                        isSelected
                          ? handleRemoveStructure(structure._id)
                          : handleAddStructure(structure)
                      }
                      key={index}
                      className='structure'
                      sx={{
                        position: 'relative',
                        gridArea: `${structure.id}`,
                        backgroundColor: isSelected
                          ? `${theme.active.primary} !important`
                          : `${theme.background.secondary}33`,
                        borderRadius: theme.radius.primary,
                        cursor: onClick ? 'pointer' : 'default',
                        '&:hover': { backgroundColor: theme.active.secondary },
                      }}
                    >
                      <SelectReservation reservations={structure.reservations} onCreate={() => handleCreateReservation(structure)} />
                      <RoomStructure
                        title={structure.title}
                        price={structure.price}
                        size={structure.size}
                        align={structure.align}
                        justify={structure.justify}
                        direction={structure.direction}
                        status={structure.status}
                      />
                    </Box>
                  )
              }
            }
          })
        }
      </div>
    </div>
  )
}

const SelectReservation = ({ reservations, onCreate }) => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { language } = useLanguage()

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      style={{
        position: 'absolute',
        width: 50,
        height: 37,
        top: 10,
        right: 10,
        zIndex: 100,
      }}
    >
      <MenuDialog
        style={{
          height: 37,
          color: theme.color.info,
          backgroundColor: `${theme.color.info}22`,
          borderRadius: theme.radius.primary,
          width: '100%',
        }}
        label={<MenuBookRoundedIcon style={{ fontSize: 21 }} />}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {reservations?.map((reservation, key) => {
            return <MenuItem key={key} style={{ padding: '0 5px' }} onClick={() => navigate(`/sale/reservation/${reservation._id}`)}><ReservationItem data={reservation} /></MenuItem>
          })}
          <MenuItem onClick={() => onCreate()}>
            <span style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
              {language['START_NOW']}
            </span>
          </MenuItem>
        </div>
      </MenuDialog>
    </div>
  )
}
