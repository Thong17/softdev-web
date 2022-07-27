import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { styled } from '@mui/system'

export const CustomCalendar = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    backgroundColor: styled.background.primary,
    padding: '20px 0',
    '& #fc-dom-2': {
      fontSize: `${styled.responsive[device]?.text.h3} !important`,
        fontWeight: `${styled.font.weight} !important`
    },
    '& button': {
      background: 'none !important',
      border: 'none !important',
      fontSize: '13px !important',
      fontWeight: `${styled.font.weight} !important`
    },
    '& button:focus': {
      outline: 'none !important',
      boxShadow: 'none !important'
    },
    '& .fc-header-toolbar': {
        marginBottom: '10px !important'
    },
    '& thead tr th': {
        backgroundColor: `${styled.background.secondary}`,
        padding: '5px 0 !important',
        border: 'none !important',
        borderRadius: styled.radius.primary,
        boxShadow: styled.shadow.secondary
    },
    '& .fc-col-header-cell': {
        boxShadow: 'none !important'
    },
    '& *': {
        border: 'none !important',
        fontWeight: `${styled.font.weight} !important`,
    },
    '& .fc-daygrid-event': {
        backgroundColor: `${styled.background.primary} !important`,
    },
    '& .fc-event-title-container': {
        boxShadow: styled.shadow.secondary,
        color: `#fff !important`,
        borderRadius: 4,
        padding: '0 5px'
    },
    '& .fc-event-start': {
        borderRadius: 4,
    },
    '& .fc-daygrid-day-frame': {
        borderBottom: `${styled.border.quaternary} !important`,
        padding: 10
    },
    '& .fc-daygrid-day:hover, & .fc-day-today ': {
        backgroundColor: `${styled.active.secondary} !important`,
    },
    '& .fc-day-today ': {
        backgroundColor: `${styled.active.primary} !important`,
    }
  })
)
