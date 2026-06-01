import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import useLanguage from 'hooks/useLanguage'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import React from 'react'
import useTheme from 'hooks/useTheme'
import { IconButton } from '@mui/material'

const GroupPaymentDialog = ({ dialog, setDialog }) => {
    const { language } = useLanguage()
    const { theme } = useTheme()
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
                }}
            >
                <DialogTitle
                    title={language['PAYMENT']}
                    onClose={handleCloseDialog}
                >
                    {language['TEST']}
                    <IconButton onClick={handleCloseDialog}><CloseRoundedIcon style={{ color: theme.text.primary }} /></IconButton>
                </DialogTitle>
            </div>
        </AlertContainer>
    )
}

export default GroupPaymentDialog
