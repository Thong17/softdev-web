import { AlertContainer } from 'components/shared/container/AlertContainer'


export const DrawerForm = ({ dialog, setDialog }: any) => {

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }
  return (
    <AlertContainer
      justify='center'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div style={{ height: '100vh', width: '50vw' }}>
        Drawer
      </div>
    </AlertContainer>
  )
}
