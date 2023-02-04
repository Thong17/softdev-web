import { AlertDialog } from 'components/shared/table/AlertDialog'

export const DepositDialog = ({ dialog, setDialog }: any) => {
  
  const handleCloseDialog = () => {
    setDialog({ open: false })
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <div>
        Deposit container
      </div>
    </AlertDialog>
  )
}