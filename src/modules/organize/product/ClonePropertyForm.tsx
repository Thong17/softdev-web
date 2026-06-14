import { CustomButton } from 'styles'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Axios from 'constants/functions/Axios';
import { useEffect } from 'react';

export const ClonePropertyForm = ({
  dialog,
  setDialog,
  theme,
}: any) => {

  useEffect(() => {
    Axios({
      method: 'GET',
      url: `/organize/product/property/list`
    }).then((response) => {
      console.log(response.data)
    }).catch(console.error)
  }, []);
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title='Clone Property Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: '80vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'property property property'
                            'choice choice isRequire'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}>
          <CustomButton
            onClick={handleCloseDialog}
            styled={theme}
            style={{ 
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error 
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            styled={theme}
            autoFocus
          >
            Clone
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
