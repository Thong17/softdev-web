import Container from 'components/shared/Container'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import {
  AddButton,
  RemoveButton,
  MergeButton,
  RejectButton,
  ToggleButton
} from 'components/shared/table/ActionButton'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomStructureLayout } from 'styles/container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { TableStructure } from 'components/shared/structure'
import { checkArraySequence, checkArrayValue } from 'utils'
import useNotify from 'hooks/useNotify'

const Header = () => {
  return (
    <>
      <StoreBreadcrumbs page='storeStructure' />
    </>
  )
}

const mapStructures = (currentStructures, newStructures) => {
  let mappedStructures: any = []
  const extractCurrentStructures = currentStructures.map(current => current.id)
  newStructures.forEach((_new) => {
    if (extractCurrentStructures.indexOf(_new.id) > -1) return mappedStructures = [...mappedStructures, currentStructures.find(current => current.id === _new.id)] 
    mappedStructures = [...mappedStructures, _new]
  })
  return mappedStructures
}

export const StructureForm = () => {
  const { notify } = useNotify()
  const { theme } = useTheme()
  const [column, setColumn] = useState<any>([1])
  const [row, setRow] = useState<any>([1])
  const [template, setTemplate] = useState('')
  const [structures, setStructures] = useState<any>([])
  const [merges, setMerges] = useState<any[]>([])

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
          { id, type: 'blank', direction: 'row' },
        ]
      })
      template += `"${rowTemplate}"`
    })
    setStructures((currentStructures) => mapStructures(currentStructures, newStructures))
    setTemplate(template)
  }, [column, row])

  const handleAddColumn = () => {
    const id = column.length + 1
    setColumn((prevColumn) => [...prevColumn, id])
  }

  const handleAddRow = () => {
    const id = row.length + 1
    setRow((prevRow) => [...prevRow, id])
  }

  const handleRemoveColumn = () => {}

  const handleRemoveRow = () => {}

  const handleAddStructure = (id) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id
          ? { ...structure, id, type: 'table', direction: 'row', length: 3 }
          : structure
      )
    )
  }

  const handleRemoveStructure = (id) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id
          ? { id, type: 'blank', direction: 'row' }
          : structure
      )
    )
  }

  const handleMergeStructure = (id, merged) => {
    setStructures(
      structures?.map((structure) =>
        structure.id === id
          ? { ...structure, merged }
          : structure
      )
    )
    merged ? setMerges([...merges, id]) : setMerges((prev) => prev.filter(prevId => prevId !== id))
  }


  const handleConfirmMergeStructure = () => {
    const mappedMerge = merges.map(id => {
      const splitB = id.split('B')[1]
      return { row: parseInt(splitB.split('S')[0]), colum: parseInt(splitB.split('S')[1]) }
    })
    
    let rows: number[] = []
    let columns: number[] = []

    mappedMerge.forEach(item => {
      rows = [...rows, item.row]
      columns = [...columns, item.colum]
    })

    if (!checkArrayValue(rows, rows[0]) && !checkArrayValue(columns, columns[0])) return notify('Cannot merge a different position items', 'error')
    if (!checkArraySequence(rows, 1) && !checkArraySequence(columns, 1)) return notify('Cannot merge an unordered items', 'error')
    
    // Create merged ID
    let newId = ' '
    merges.forEach((id, index) => {
      const oldId = id.trim()
      if (index === merges.length - 1) return newId += `${oldId}`
      newId += `${oldId}M`
    })
    
    // Replaced old grid area template with new mapped
    let newTemplate = template
    merges.forEach(id => {
      newTemplate = newTemplate.replace(id, newId)
    })
    setTemplate(newTemplate)

    // Replace merged elements to a single element
    let mappedStructures: any[] = []
    structures.forEach((item) => {
      if (merges.includes(item.id)) {
        let mappedItem = { ...item, id: ` ${newId}`, isMain: item.id === merges[0] }
        return mappedStructures = [...mappedStructures, mappedItem]
      }
      mappedStructures = [...mappedStructures, item]
    })
    setStructures(mappedStructures)
    setMerges([])
  }


  return (
    <Container header={<Header />}>
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
                <MergeButton title='Combine' disabled={merges.length < 2} onClick={handleConfirmMergeStructure} />
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
            { 
              structures?.map((structure, index) => {
                if (structure.merged && structure.isMain === false) return <div key={index} style={{ display: 'none' }}></div>
                if (structure.type === 'blank') {
                    return <div
                      key={index}
                      style={{ gridArea: `${structure.id} / ${structure.id} / ${structure.id} / ${structure.id}` }}
                      className={structure.merged ? 'structure merged' : 'structure'}
                    >
                      <div className='action blank'>
                        <ToggleButton onClick={() => handleMergeStructure(structure.id, !structure.merged)} state={structure.merged} />
                        <AddButton onClick={() => handleAddStructure(structure.id)} />
                      </div>
                    </div>
                } else {
                  return <div key={index} className={structure.merged ? 'structure merged' : 'structure'} style={{ gridArea: `${structure.id} / ${structure.id} / ${structure.id} / ${structure.id}` }}>
                    <TableStructure
                      title='T1'
                      length={structure.length}
                      size='small'
                      direction={structure.direction}
                    />
                    <div className='action object'>
                      <RejectButton onClick={() => handleRemoveStructure(structure.id)} />
                    </div>
                  </div>
                }
              }
            )}
          </div>
        </CustomStructureLayout>
      </FlexBetween>
    </Container>
  )
}
