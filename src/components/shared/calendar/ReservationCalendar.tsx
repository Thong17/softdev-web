import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import useTheme from 'hooks/useTheme'
import { CustomCalendar } from 'styles'
import useWeb from 'hooks/useWeb'

export interface ICalendarEvent {
  title: string
  start: string
  end?: string
}

export const ReservationCalendar = () => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomCalendar styled={theme} device={device}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView='dayGridMonth'
        headerToolbar={{
          start: 'dayGridMonth,timeGridWeek',
          end: 'prev,today,next,addReservation',
          center: 'title',
        }}
        customButtons={{
          addReservation: {
            text: 'Reservation',
            click: () => {
              alert('hey')
            }
          }
        }}
      />
    </CustomCalendar>
  )
}
