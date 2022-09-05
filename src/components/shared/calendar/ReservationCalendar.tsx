import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import useTheme from 'hooks/useTheme'
import { CustomCalendar } from 'styles'
import useWeb from 'hooks/useWeb'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListReservation, selectListReservation } from 'modules/sale/reservation/redux'

export interface ICalendarEvent {
  start: string
  end?: string
  structures?: string
}

const mappedEvent = (data):ICalendarEvent[] => {
  const mappedData: ICalendarEvent[] = []
  data.forEach(reservation => {
    mappedData.push({
      start: reservation.startAt,
      end: reservation.endAt,
      structures: reservation.structures
    })
  })
  return mappedData
}

const renderEventContent = (eventInfo, theme) => {
  const { structures } = eventInfo.event._def.extendedProps
  let title = ''
  let status = ''
  structures.forEach((structure, index) => {
    status = structure.status
    if (index === structures.length - 1) return title += structure.title
    title += `${structure.title}, `
  })
  
  return <div style={{ display: 'flex', alignItems: 'center', padding: '2px 5px' }}>
    <span style={{ minWidth: 7, minHeight: 7, marginRight: 5, boxSizing: 'border-box', borderRadius: theme.radius.circle, backgroundColor: status === 'reserved' ? `${theme.color.warning}` : `${theme.color.error}`, display: 'flex' }}></span>
    {title}
  </div>
}

export const ReservationCalendar = () => {
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

  return (
    <CustomCalendar styled={theme} device={device}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView='timeGridWeek'
        events={mappedEvent(reservations)}
        eventContent={(event) => renderEventContent(event, theme)}
        headerToolbar={{
          start: 'dayGridMonth,timeGridWeek',
          end: 'prev,today,next',
          center: 'title',
        }}
      />
    </CustomCalendar>
  )
}
