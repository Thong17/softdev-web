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

export const StructureContainer = () => {
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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}
    >
      <MiniSelectField
        style={{ width: 100 }}
        options={floorOption}
        value={floor}
        onChange={handleChangeFloor}
        search={true}
      />
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
        {loading && <Loading />}
        {structures?.map((structure, index) => {
          if (structure.merged && structure.isMain === false)
            return <div key={index} style={{ display: 'none' }}></div>
          if (structure.type === 'blank') {
            return (
              <div
                key={index}
                style={{ gridArea: `${structure.id}`, backgroundColor: `${theme.color.info}11`, borderRadius: theme.radius.primary }}
              ></div>
            )
          } else {
            switch (structure.type) {
              case 'table':
                return (
                  <div
                    key={index}
                    className='structure'
                    style={{ gridArea: `${structure.id}`, backgroundColor: `${theme.color.info}11`, borderRadius: theme.radius.primary }}
                  >
                    <TableStructure
                      title={structure.title}
                      length={structure.length}
                      size={structure.size}
                      align={structure.align}
                      justify={structure.justify}
                      direction={structure.direction}
                    />
                  </div>
                )
              default:
                return (
                  <div
                    key={index}
                    className='structure'
                    style={{ gridArea: `${structure.id}`, backgroundColor: `${theme.color.info}11`, borderRadius: theme.radius.primary }}
                  >
                    <RoomStructure
                      title={structure.title}
                      size={structure.size}
                      align={structure.align}
                      justify={structure.justify}
                      direction={structure.direction}
                    />
                  </div>
                )
            }
          }
        })}
      </div>
    </div>
  )
}
