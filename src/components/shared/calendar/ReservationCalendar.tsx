import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import useTheme from 'hooks/useTheme'
import { CustomCalendar } from 'styles'
import useWeb from 'hooks/useWeb'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getListReservation,
  selectListReservation,
} from 'modules/sale/reservation/redux'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export interface ICalendarEvent {
  start: string
  end?: string
  structures?: string
  reservationId?: string
  name?: string
}

const mappedEvent = (data): ICalendarEvent[] => {
  const mappedData: ICalendarEvent[] = []
  data.forEach((reservation) => {
    mappedData.push({
      start: reservation.startAt,
      end: reservation.endAt,
      structures: reservation.structures,
      reservationId: reservation._id,
      name: reservation.customer?.displayName,
    })
  })
  return mappedData
}

const renderEventContent = (eventInfo, theme) => {
  const { structures, name } = eventInfo.event._def.extendedProps
  let title = `${name}, `
  let status = ''
  structures.forEach((structure, index) => {
    status = structure.status
    if (index === structures.length - 1) return (title += structure.title)
    title += `${structure.title}, `
  })

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 5px',
        width: '100%',
      }}
    >
      <span
        style={{
          minWidth: 7,
          minHeight: 7,
          marginRight: 5,
          boxSizing: 'border-box',
          borderRadius: theme.radius.circle,
          backgroundColor:
            status === 'reserved'
              ? `${theme.color.warning}`
              : `${theme.color.error}`,
          display: 'flex',
        }}
      ></span>
      {title}
    </Box>
  )
}

export const ReservationCalendar = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data, status } = useAppSelector(selectListReservation)
  const [reservations, setReservations] = useState<ICalendarEvent[]>([])

  useEffect(() => {
    dispatch(getListReservation())
  }, [dispatch])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    setReservations(data)
  }, [data, status])

  const onClick = (data) => {
    const { reservationId } = data.event.extendedProps
    navigate(`/sale/reservation/${reservationId}`)
  }

  return (
    <CustomCalendar styled={theme} device={device}>
      <FullCalendar
        eventClick={onClick}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView='timeGridWeek'
        events={mappedEvent(reservations)}
        eventContent={(event) => renderEventContent(event, theme)}
        nowIndicator={true}
        headerToolbar={{
          start: 'dayGridMonth,timeGridWeek,listWeek',
          end: 'prev,today,next',
          center: 'title',
        }}
      />
    </CustomCalendar>
  )
}
