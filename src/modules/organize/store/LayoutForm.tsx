import Container from 'components/shared/Container'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import {
  AddButton,
  RemoveButton,
  MergeButton,
  RejectButton,
  ToggleButton,
} from 'components/shared/table/ActionButton'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomStructureLayout } from 'styles/container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { RoomStructure, TableStructure } from 'components/shared/structure'
import { checkArraySequence, checkArrayValue } from 'utils'
import useNotify from 'hooks/useNotify'
import { StructureForm } from './StructureForm'

const Header = () => {
  return (
    <>
      <StoreBreadcrumbs page='storeLayout' />
    </>
  )
}

const mapStructures = (currentStructures, newStructures) => {
  let mappedStructures: any = []

  const extractCurrentStructures = currentStructures.map(
    (current) => {
      if (current.originId) return current.originId
      return current.id
    }
  )
  
  newStructures.forEach((_new) => {
    if (extractCurrentStructures.indexOf(_new.id) > -1)
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
  const { notify } = useNotify()
  const { theme } = useTheme()
  const [column, setColumn] = useState<any>([1])
  const [row, setRow] = useState<any>([1])
  const [template, setTemplate] = useState('')
  const [structures, setStructures] = useState<any>([])
  const [merges, setMerges] = useState<any[]>([])
  const [structureDialog, setStructureDialog] = useState({
    open: false,
    structureId: null,
  })
  const [mergedStructures, setMergedStructures] = useState<any>([])
  

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
  }, [column, row, mergedStructures])

  const handleAddColumn = () => {
    const id = column.length + 1
    setColumn((prevColumn) => [...prevColumn, id])
  }

  const handleAddRow = () => {
    const id = row.length + 1
    setRow((prevRow) => [...prevRow, id])
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
  }

  const handleMergeStructure = (id, selected) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id ? { ...structure, selected } : structure
      )
    )
    selected
      ? setMerges([...merges, id])
      : setMerges((prev) => prev.filter((prevId) => prevId !== id))
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
        }
        setMergedStructures((prevMerged) => [...prevMerged, mappedItem])
        return (mappedStructures = [...mappedStructures, mappedItem])
      }
      mappedStructures = [...mappedStructures, item]
    })
    setStructures(mappedStructures)
    setMerges([])
  }

  const handleSubmitStructure = (data) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === data.id ? { ...structure, ...data } : structure
      )
    )
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
  }

  return (
    <Container header={<Header />}>
      <StructureForm
        dialog={structureDialog}
        setDialog={setStructureDialog}
        theme={theme}
        onSubmit={handleSubmitStructure}
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
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              <div>
                <MergeButton
                  title='Combine'
                  disabled={merges.length < 2}
                  onClick={handleConfirmMergeStructure}
                />
              </div>
              <div>
                <RemoveButton onClick={handleRemoveColumn} />
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
                          length={structure.length}
                          size={structure.size}
                          align={structure.align}
                          justify={structure.justify}
                          direction={structure.direction}
                        />
                        <div className='action object'>
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
                          size={structure.size}
                          align={structure.align}
                          justify={structure.justify}
                          direction={structure.direction}
                        />
                        <div className='action object'>
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
