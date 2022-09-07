import Container from 'components/shared/Container'
import { StructureContainer } from 'components/shared/container/StructureContainer'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ReservationAlert } from './ReservationAlert'
import { useState } from 'react'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

export const Reservation = () => {
  const { theme } = useTheme()
  const [dialog, setDialog] = useState({ open: false })
  const [selectedStructures, setSelectedStructures] = useState<any[]>([])
  const [toggleReload, setToggleReload] = useState(false)

  const handleClickStructure = (data) => {
    setSelectedStructures([...selectedStructures, data])
  }

  const handleClickReservation = () => {
    setDialog({ ...dialog, open: true })
  }

  const handleSaveReservation = () => {
    setSelectedStructures([])
    setToggleReload(!toggleReload)
  }

  const handleRemoveStructure = (id) => {
    setSelectedStructures((prev) => prev.filter((item) => item._id !== id))
  }

  return (
    <Container>
      <StructureContainer
        reload={toggleReload}
        selected={selectedStructures}
        onClick={handleClickStructure}
        onRemove={handleRemoveStructure}
        actions={
          <>
            <IconButton
              onClick={() => setToggleReload(!toggleReload)}
              style={{
                color: theme.text.secondary,
                width: 30,
                height: 30,
                marginRight: 10,
              }}
            >
              <ReplayRoundedIcon style={{ fontSize: 19 }} />
            </IconButton>
            <IconButton
              onClick={handleClickReservation}
              style={{
                color: theme.color.info,
                width: 30,
                height: 30,
                marginRight: 10,
              }}
            >
              <CalendarMonthRoundedIcon style={{ fontSize: 19 }} />
            </IconButton>
          </>
        }
      />
      <ReservationAlert
        dialog={dialog}
        setDialog={setDialog}
        structures={selectedStructures}
        onSave={handleSaveReservation}
      />
    </Container>
  )
}

export { ReservationForm } from './ReservationForm'