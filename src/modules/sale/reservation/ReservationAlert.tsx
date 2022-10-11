import { ReservationCalendar } from 'components/shared/calendar/ReservationCalendar'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { ReservationContainer } from 'components/shared/container/ReservationContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'

export const ReservationAlert = ({ dialog, setDialog, structures, onSave }: any) => {
  const { width } = useWeb()
  const { language } = useLanguage()
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const handleAfterSave = () => {
    onSave()
    handleCloseDialog()
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
        <DialogTitle title={language['RESERVATION']} onClose={handleCloseDialog} />
        <div
          style={{
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20,
            display: 'grid',
            gridTemplateColumns: 'calc(100% - 480px) auto',
            gridTemplateAreas: width > 1024 ? `'calendar form'` : `'form form''calendar calendar'`,
          }}
        >
          <div style={{ gridArea: 'calendar', minHeight: width > 1024 ? '100%' : '70vh', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', overflowY: 'auto' }}>
              <ReservationCalendar />
            </div>
          </div>
          <div style={{ gridArea: 'form', height: width > 1024 ? '100%' : '70vh' }}>
            <ReservationContainer selectedStructures={structures} onSave={handleAfterSave} />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
