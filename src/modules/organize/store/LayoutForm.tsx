import Container from 'components/shared/Container'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import {
  AddButton,
  RemoveButton,
  MergeButton,
  RejectButton,
  ToggleButton,
  UploadButton,
  ResetButton,
  FloorButton,
  UpdateButton,
} from 'components/shared/table/ActionButton'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomStructureLayout } from 'styles/container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { RoomStructure, TableStructure } from 'components/shared/structure'
import { checkArraySequence, checkArrayValue } from 'utils'
import useNotify from 'hooks/useNotify'
import { StructureForm } from './StructureForm'
import { MiniSelectField } from 'components/shared/form'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getLayoutStore, getListFloor, selectLayoutStore, selectListFloor } from './redux'
import { IOptions } from 'components/shared/form/SelectField'
import Axios from 'constants/functions/Axios'
import Loading from 'components/shared/Loading'
import useAlert from 'hooks/useAlert'
import { FloorForm } from './FloorForm'
import { initStructure } from './redux/constant'

const Header = () => {
  return (
    <>
      <StoreBreadcrumbs page='storeLayout' />
    </>
  )
}

const mappedStructureSchema = (structure) => {
  return {
    title: structure.title,
    price: structure.price,
    size: structure.size,
    type: structure.type,
    length: structure.length,
    direction: structure.direction,
    justify: structure.justify,
    align: structure.align,
    description: structure.description,
  }
}

export const mapStructures = (currentStructures, newStructures) => {
  let mappedStructures: any = []

  const extractCurrentStructures = currentStructures?.map(
    (current) => {
      if (current.originId) return current.originId
      return current.id
    }
  )
  
  newStructures?.forEach((_new) => {
    if (extractCurrentStructures?.indexOf(_new.id) > -1)
      return (mappedStructures = [
        ...mappedStructures,
        currentStructures.find((current) => {
          if (current.originId) return current.originId === _new.id
          return current.id === _new.id
        }),
      ])
    mappedStructures = [...mappedStructures, _new]
  })
  
  return mappedStructures
}

export const LayoutForm = () => {
  const dispatch = useAppDispatch()
  const confirm = useAlert()
  const { notify } = useNotify()
  const { data: storeLayout, status: statusLayout } = useAppSelector(selectLayoutStore)
  const { data: listFloor, status } = useAppSelector(selectListFloor)
  const { theme } = useTheme()
  const [column, setColumn] = useState<any>([])
  const [row, setRow] = useState<any>([])
  const [template, setTemplate] = useState('')
  const [structures, setStructures] = useState<any>([])
  const [mergedStructures, setMergedStructures] = useState<any>([])
  const [merges, setMerges] = useState<any[]>([])
  const [structureDialog, setStructureDialog] = useState({
    open: false,
    structureId: null,
  })
  const [floorDialog, setFloorDialog] = useState<any>({
    open: false,
    floors: []
  })
  const [floor, setFloor] = useState('')
  const [loading, setLoading] = useState(true)
  const [floorOption, setFloorOption] = useState<IOptions[]>([])
  const [defaultStructure, setDefaultStructure] = useState(initStructure)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setFloorOption(listFloor?.map(item => ({ label: item.floor, value: item._id, tags: item.tags })))
    setFloorDialog((floorDialog) => ({ ...floorDialog, floors: listFloor }))
  }, [listFloor])

  useEffect(() => {
    dispatch(getListFloor())
  }, [dispatch])

  useEffect(() => {
    if (statusLayout !== 'SUCCESS') return

    setColumn(storeLayout?.column)
    setRow(storeLayout?.row)
    setStructures(storeLayout?.structures)
    setMergedStructures(storeLayout?.mergedStructures)
  }, [storeLayout, statusLayout])

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

  const handleAddColumn = () => {
    const id = column.length + 1
    setColumn((prevColumn) => [...prevColumn, id])
    setIsDirty(true)
  }

  const handleAddRow = () => {
    const id = row.length + 1
    setRow((prevRow) => [...prevRow, id])
    setIsDirty(true)
  }

  const handleRemoveColumn = () => {
    const lengthColumn = column.length
    if (lengthColumn < 2) return

    const removedIndex = column[lengthColumn - 1]
    for (let i = 0; i < structures.length; i++) {
      const structure = structures[i]
      if (structure.column === removedIndex && structure.type !== 'blank')
        return notify('Cannot remove column that contain structure!', 'error')
    }

    setColumn(column.slice(0, -1))
    setIsDirty(true)
  }

  const handleResetLayout = () => {
    confirm({
      title: 'Are you sure you want to reset?',
      description: 'Reset will remove all the structures and layout.',
      variant: 'error'
    }).then(() => {
      setColumn([1])
      setRow([1])
      setMergedStructures([])
      setStructures([])
      setIsDirty(true)
    }).catch()
  }

  const handleRemoveRow = () => {
    const lengthRow = row.length
    if (lengthRow < 2) return

    const removedIndex = row[lengthRow - 1]
    for (let i = 0; i < structures.length; i++) {
      const structure = structures[i]
      if (structure.row === removedIndex && structure.type !== 'blank')
        return notify('Cannot remove row that contain structure!', 'error')
    }

    setRow(row.slice(0, -1))
    setIsDirty(true)
  }

  const handleAddStructure = (id) => {
    setStructureDialog({ open: true, structureId: id })
  }

  const handleRemoveStructure = (id) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id
          ? { ...structure, id, type: 'blank', direction: 'row' }
          : structure
      )
    )
    setIsDirty(true)
  }

  const handleMergeStructure = (id, selected) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id ? { ...structure, selected } : structure
      )
    )
    selected
      ? setMerges([...merges, id].sort())
      : setMerges((prev) => prev.filter((prevId) => prevId !== id))
    setIsDirty(true)
  }

  const handleConfirmMergeStructure = () => {
    const mappedMerge = merges.map((id) => {
      const splitB = id.split('B')[1]
      return {
        row: parseInt(splitB.split('S')[0]),
        column: parseInt(splitB.split('S')[1]),
      }
    })

    let rows: number[] = []
    let columns: number[] = []

    mappedMerge.forEach((item) => {
      rows = [...rows, item.row]
      columns = [...columns, item.column]
    })

    if (
      !checkArrayValue(rows, rows[0]) &&
      !checkArrayValue(columns, columns[0])
    )
      return notify('Cannot merge a different position items', 'error')
    if (!checkArraySequence(rows, 1) && !checkArraySequence(columns, 1))
      return notify('Cannot merge an unordered items', 'error')

    // Create merged ID
    let newId = ' '
    merges.forEach((id, index) => {
      const oldId = id.trim()
      if (index === merges.length - 1) return (newId += `${oldId}`)
      newId += `${oldId}M`
    })

    // Replaced old grid area template with new mapped
    let newTemplate = template
    merges.forEach((id) => {
      newTemplate = newTemplate.replace(id, newId)
    })
    
    setTemplate(newTemplate)

    // Replace merged elements to a single element
    let mappedStructures: any[] = []
    structures.forEach((item) => {
      if (merges.includes(item.id)) {
        let mappedItem = {
          ...item,
          originId: item.id,
          id: ` ${newId}`,
          isMain: item.id === merges[0],
          selected: false,
          merged: true,
          floor
        }
        setMergedStructures((prevMerged) => [...prevMerged, { originId: mappedItem.originId, id: mappedItem.id }])
        return (mappedStructures = [...mappedStructures, mappedItem])
      }
      mappedStructures = [...mappedStructures, item]
    })
    setStructures(mappedStructures)
    setMerges([])
    setIsDirty(true)
  }

  const handleSubmitStructure = (data) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === data.id ? { ...structure, ...data, floor } : structure
      )
    )
    setIsDirty(true)
  }

  const handleUnMergeStructure = (structure) => {
    let newTemplate = template
    let mappedStructures: any[] = []

    structures.forEach((str) => {
      if (str.id === structure.id) {
        newTemplate = newTemplate.replace(str.id.trim(), str.originId)
        setMergedStructures((prev) => prev.filter((item => item.id !== str.id)))
        mappedStructures = [
          ...mappedStructures,
          {
            ...str,
            merged: false,
            id: str.originId,
            originId: null,
            isMain: false,
          },
        ]
      } else {
        mappedStructures = [...mappedStructures, str]
      }
    })

    setTemplate(newTemplate)
    setStructures(mappedStructures)
    setIsDirty(true)
  }

  const handleSaveLayout = () => {
    confirm({
      title: 'Are you sure you want to save this layout?',
      description: 'Save this layout will override existing.',
      variant: 'info'
    }).then(() => {
      Axios({
        method: 'PUT',
        url: `/organize/store/layout/update/${floor}`,
        body: {
          structures,
          mergedStructures,
          column,
          row
        }
      })
        .then((data) => notify(data?.data?.msg, 'success'))
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }).catch()
  }

  const handleUpdateStructure = (data) => {
    setDefaultStructure(mappedStructureSchema(data))
    setStructureDialog({ ...structureDialog, structureId: data?.id, open: true })
  }

  return (
    <Container header={<Header />}>
      <StructureForm
        dialog={structureDialog}
        setDialog={setStructureDialog}
        theme={theme}
        onSubmit={handleSubmitStructure}
        defaultValues={defaultStructure}
      />
      <FloorForm
        dialog={floorDialog}
        setDialog={setFloorDialog}
        theme={theme}
      />
      <FlexBetween>
        <CustomStructureLayout styled={theme}>
          <div
            className='column'
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <div
              style={{
                width: '100%',
                paddingLeft: 40,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex' }}>
                <MergeButton
                  title='Combine'
                  disabled={merges.length < 2}
                  onClick={handleConfirmMergeStructure}
                />
                <ResetButton title='Reset' onClick={handleResetLayout} />
                <UploadButton title='Save' onClick={handleSaveLayout} disabled={isDirty} />
                <FloorButton title='Floor' onClick={() => setFloorDialog({ ...floorDialog, open: true })} />
                <MiniSelectField style={{ marginLeft: 10 }} options={floorOption} value={floor} onChange={handleChangeFloor} search={true} />
              </div>
              <div style={{ display: 'flex' }}>
                <RemoveButton onClick={handleRemoveColumn} />
                <span style={{ width: 5, display: 'block' }}></span>
                <AddButton onClick={handleAddColumn} />
              </div>
            </div>
          </div>
          <div
            className='row'
            style={{
              display: 'flex',
              justifyContent: 'end',
              flexDirection: 'column',
            }}
          >
            <RemoveButton onClick={handleRemoveRow} />
            <span style={{ height: 5, display: 'block' }}></span>
            <AddButton onClick={handleAddRow} />
          </div>
          <div
            className='structure-container'
            style={{
              display: 'grid',
              gridTemplateAreas: template,
              gridGap: '1px',
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
                    style={{ gridArea: `${structure.id}` }}
                    className={
                      structure.selected ? 'structure selected' : 'structure'
                    }
                  >
                    <div className='action blank'>
                      {structure.merged ? (
                        <ToggleButton
                          onClick={() => handleUnMergeStructure(structure)}
                          state={true}
                        />
                      ) : (
                        <ToggleButton
                          onClick={() =>
                            handleMergeStructure(
                              structure.id,
                              !structure.selected
                            )
                          }
                          state={structure.selected}
                        />
                      )}
                      <AddButton
                        onClick={() => handleAddStructure(structure.id)}
                      />
                    </div>
                  </div>
                )
              } else {
                switch (structure.type) {
                  case 'table':
                    return (
                      <div
                        key={index}
                        className='structure'
                        style={{ gridArea: `${structure.id}` }}
                      >
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
                        <div className='action object'>
                          <UpdateButton
                            onClick={() => handleUpdateStructure(structure)}
                          />
                          <RejectButton
                            onClick={() => handleRemoveStructure(structure.id)}
                          />
                        </div>
                      </div>
                    )
                  default:
                    return (
                      <div
                        key={index}
                        className='structure'
                        style={{ gridArea: `${structure.id}` }}
                      >
                        <RoomStructure
                          title={structure.title}
                          price={structure.price}
                          size={structure.size}
                          align={structure.align}
                          justify={structure.justify}
                          direction={structure.direction}
                          status={structure.status}
                        />
                        <div className='action object'>
                          <UpdateButton
                            onClick={() => handleUpdateStructure(structure)}
                          />
                          <RejectButton
                            onClick={() => handleRemoveStructure(structure.id)}
                          />
                        </div>
                      </div>
                    )
                }
              }
            })}
          </div>
        </CustomStructureLayout>
      </FlexBetween>
    </Container>
  )
}
