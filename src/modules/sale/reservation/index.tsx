import Container from 'components/shared/Container'
import { StructureContainer } from 'components/shared/container/StructureContainer'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ReservationForm } from './ReservationForm'
import { useState } from 'react'

export const Reservation = () => {
  const { theme } = useTheme()
  const [dialog, setDialog] = useState({ open: false })
  const [selectedStructures, setSelectedStructures] = useState<any[]>([])

  const handleClickStructure = (data) => {
    setSelectedStructures([...selectedStructures, data])
  }
 
  const handleClickReservation = () => {
    setDialog({ ...dialog, open: true })
  }

  const handleSaveReservation = () => {
    setSelectedStructures([])
  }

  const handleRemoveStructure = (id) => {
    setSelectedStructures(prev => prev.filter(item => item._id !== id))
  }

  return (
    <Container>
      <StructureContainer
        selected={selectedStructures}
        onClick={handleClickStructure}
        onRemove={handleRemoveStructure}
        actions={
          <IconButton
            onClick={handleClickReservation}
            style={{
              color: theme.color.info,
              width: 30,
              height: 30,
              marginRight: 5,
            }}
          >
            <CalendarMonthRoundedIcon style={{ fontSize: 19 }} />
          </IconButton>
        }
      />
      <ReservationForm dialog={dialog} setDialog={setDialog} structures={selectedStructures} onSave={handleSaveReservation} />
    </Container>
  )
}
