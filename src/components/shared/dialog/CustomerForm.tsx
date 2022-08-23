import { AlertContainer } from 'components/shared/container/AlertContainer'


export const CustomerForm = ({ dialog, setDialog }: any) => {

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }
  return (
    <AlertContainer
      justify='end'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div style={{ height: '100vh', width: '50vw' }}>
        Customer
      </div>
    </AlertContainer>
  )
}
