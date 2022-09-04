import { ReservationCalendar } from 'components/shared/calendar/ReservationCalendar'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { ReservationContainer } from 'components/shared/container/ReservationContainer'
import { DialogTitle } from 'components/shared/DialogTitle'

export const ReservationForm = ({ dialog, setDialog }: any) => {
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  return (
    <AlertContainer
      justify='center'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          height: '100vh',
          width: 'calc(100vw - 64px)',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle title='Reservation' onClose={handleCloseDialog} />
        <div
          style={{
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20,
            display: 'grid',
            gridTemplateColumns: 'calc(100% - 480px) auto',
            gridTemplateRows: '1fr',
            gridTemplateAreas: `'calendar form'`,
          }}
        >
          <div style={{ gridArea: 'calendar', height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', overflowY: 'auto' }}>
              <ReservationCalendar />
            </div>
          </div>
          <div style={{ gridArea: 'form' }}>
            <ReservationContainer />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
