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

  const handleClickStructure = (id) => {
    console.log(id)
  }
 
  const handleClickReservation = () => {
    setDialog({ ...dialog, open: true })
  }

  return (
    <Container>
      <StructureContainer
        onClick={handleClickStructure}
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
      <ReservationForm dialog={dialog} setDialog={setDialog} />
    </Container>
  )
}
