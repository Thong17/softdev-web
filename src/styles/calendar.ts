import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { styled } from '@mui/system'

export const CustomCalendar = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    backgroundColor: styled.background.primary,
    height: '100%',
    '& .fc-media-screen': {
      height: '-webkit-fill-available'
    },
    '& #fc-dom-2': {
      fontSize: `${styled.responsive[device]?.text.h3}px !important`,
      fontWeight: `${styled.font.weight} !important`,
    },
    '& button': {
      background: 'none !important',
      border: 'none !important',
      fontSize: '13px !important',
      fontWeight: `${styled.font.weight} !important`,
    },
    '& .fc-addReservation-button': {
      backgroundColor: `${styled.color.info}22 !important`,
      color: `${styled.color.info} !important`,
      borderRadius: `${styled.radius.primary} !important`,
      padding: '5px 15px'
    },
    '& button:focus': {
      outline: 'none !important',
      boxShadow: 'none !important',
    },
    '& .fc-header-toolbar': {
      marginBottom: '10px !important',
    },
    '& thead tr th': {
      backgroundColor: `${styled.background.secondary}`,
      padding: '5px 0 !important',
      border: 'none !important',
      borderRadius: styled.radius.primary,
      boxShadow: styled.shadow.secondary,
    },
    '& .fc-col-header-cell': {
      boxShadow: 'none !important',
    },
    '& *': {
      border: 'none !important',
      fontWeight: `${styled.font.weight} !important`,
      color: `${styled.text.secondary} !important`
    },
    '& .fc-daygrid-event, & .fc-event-main': {
      backgroundColor: `${styled.background.secondary} !important`,
      cursor: 'pointer'
    },
    '& .fc-event-title-container': {
      boxShadow: styled.shadow.secondary,
      color: `#fff !important`,
      borderRadius: 4,
      padding: '0 5px',
    },
    '& .fc-event-start': {
      borderRadius: 4,
    },
    '& .fc-daygrid-day-frame': {
      borderBottom: `${styled.border.quaternary} !important`,
      padding: 10,
    },
    '& .fc-daygrid-day:hover, & .fc-day-today': {
      backgroundColor: `${styled.active.primary} !important`,
    },
    '& .fc-day-today': {
      backgroundColor: `${styled.active.secondary} !important`,
    },
    '& .fc-button-primary': {
        textTransform: 'capitalize',
    },
    '& .fc-timegrid-axis': {
        boxShadow: 'none'
    },
    '& .fc-timegrid-divider': {
        display: 'none'
    }, 
    '& .fc-scrollgrid-sync-inner': {
        border: 'none !important'
    },
    '& .fc-button-active::before': {
        content: `''`,
        backgroundColor: styled.color.info,
        position: 'absolute',
        bottom: 0,
        left: '30%',
        height: 2,
        width: '40%',
        borderRadius: 1
    },

    // Timegrid
    '& .fc-timegrid-event-harness *': {
      border: 'none !important',
      boxShadow: 'none !important',
    },
    '& .fc-timegrid-event': {
      color: `${styled.color.info} !important`,
      borderRadius: styled.radius.primary
    },
    '& .fc-timegrid-col': {
      border: 'none !important',
      '& *': {
        border: 'none !important',
      }
    },

    // List
    '& .fc-list-empty': {
      backgroundColor: `${styled.background.primary} !important`,
    },
    '& .fc-list-day *': {
      backgroundColor: `${styled.background.secondary} !important`,
      borderRadius: styled.radius.primary,
    },
    '& .fc-list-event': {
      cursor: 'pointer'
    },
    '& .fc-list-event:hover td': {
      backgroundColor: `${styled.active.secondary} !important`,
    },

    // Indicator
    '& .fc-timegrid-now-indicator-container': {
      '& .fc-timegrid-now-indicator-line': {
        border: `1px solid ${styled.color.info} !important`
      }
    }
  })
)
