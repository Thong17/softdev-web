import Container from 'components/shared/Container'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import {
  AddButton,
  RemoveButton,
  MergeButton,
} from 'components/shared/table/ActionButton'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomStructureLayout } from 'styles/container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Button from 'components/shared/Button'
import { TableStructure } from 'components/shared/structure'

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
  const { theme } = useTheme()
  const [column, setColumn] = useState<any>(['1'])
  const [row, setRow] = useState<any>(['1'])
  const [template, setTemplate] = useState('')
  const [structures, setStructures] = useState<any>([])

  useEffect(() => {
    let template = ''
    let newStructures: any[] = []
    row.forEach((r) => {
      let rowTemplate = ''
      column.forEach((c) => {
        const id = ` ${r}-${c}`
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
          ? { id, type: 'table', direction: 'row', length: 1 }
          : structure
      )
    )
  }

  const handleMergeStructure = (structures) => {
    console.log(structures)
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
                <MergeButton onClick={handleMergeStructure} />
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
            {structures?.map((structure) =>
              structure.type === 'blank' ? (
                <Button
                  key={structure.id}
                  style={{ gridArea: structure.id }}
                  onClick={() => handleAddStructure(structure.id)}
                >
                  <AddRoundedIcon />
                </Button>
              ) : (
                <div key={structure.id} className='structure'>
                  <TableStructure
                    title={structure.id}
                    length={structure.length}
                    area={structure.id}
                    size='small'
                    direction={structure.direction}
                  />
                </div>
              )
            )}
          </div>
        </CustomStructureLayout>
      </FlexBetween>
    </Container>
  )
}
