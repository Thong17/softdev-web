import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import useTheme from 'hooks/useTheme'
import { CustomCalendar } from 'styles'
import useWeb from 'hooks/useWeb'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { timeFormat } from 'utils'

export interface ICalendarEvent {
    title: string,
    start: string,
    end?: string
}

const renderEventContent = (eventInfo, theme) => {
  switch (eventInfo.event.title) {
    case 'Annual Leave':
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }} title={`From: ${timeFormat(eventInfo.event.start)} - To: ${timeFormat(eventInfo.event.end)}`}>
          <CancelRoundedIcon style={{ color: theme.color.info, fontSize: 17, marginRight: 3 }} />
          <p style={{ color: theme.text.ternary }}>{eventInfo.timeText}</p>
          <p style={{ color: theme.text.secondary }}>{eventInfo.event.title}</p>
        </div>
      )
    case 'Sick Leave':
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }} title={`From: ${timeFormat(eventInfo.event.start)} - To: ${timeFormat(eventInfo.event.end)}`}>
          <CancelRoundedIcon style={{ color: theme.color.warning, fontSize: 17, marginRight: 3 }} />
          <p style={{ color: theme.text.ternary }}>{eventInfo.timeText}</p>
          <p style={{ color: theme.text.secondary }}>{eventInfo.event.title}</p>
        </div>
      )
    case 'Urgent Leave':
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }} title={`From: ${timeFormat(eventInfo.event.start)} - To: ${timeFormat(eventInfo.event.end)}`}>
          <CancelRoundedIcon style={{ color: theme.color.warning, fontSize: 17, marginRight: 3 }} />
          <p style={{ color: theme.text.ternary }}>{eventInfo.timeText}</p>
          <p style={{ color: theme.text.secondary }}>{eventInfo.event.title}</p>
        </div>
      )
    case 'Absent':
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }} title={`From: ${timeFormat(eventInfo.event.start)} - To: ${timeFormat(eventInfo.event.end)}`}>
          <CancelRoundedIcon style={{ color: theme.color.error, fontSize: 17, marginRight: 3 }} />
          <p style={{ color: theme.text.ternary }}>{eventInfo.timeText}</p>
          <p style={{ color: theme.text.secondary }}>{eventInfo.event.title}</p>
        </div>
      )
    default:
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }} title={`From: ${timeFormat(eventInfo.event.start)} - To: ${timeFormat(eventInfo.event.end)}`}>
          <CheckCircleRoundedIcon style={{ color: theme.color.success, fontSize: 17, marginRight: 3 }} />
          <p style={{ color: theme.text.ternary }}>{eventInfo.timeText}</p>
          <p style={{ color: theme.text.secondary }}>{eventInfo.event.title}</p>
        </div>
      )
  }
}

export const AttendanceCalendar = ({ events }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomCalendar styled={theme} device={device}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        events={events}
        initialView='dayGridMonth'
        eventContent={(event) => renderEventContent(event, theme)}
      />
    </CustomCalendar>
  )
}
