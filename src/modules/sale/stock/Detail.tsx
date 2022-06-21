import { AlertDialog } from 'components/shared/table/AlertDialog'

export const Detail = ({
  dialog,
  setDialog,
  defaultValues,
}: any) => { 
  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <p>{defaultValues.cost}</p>
    </AlertDialog>
  )
}
