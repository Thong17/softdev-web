import { AlertContainer } from 'components/shared/container/AlertContainer'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import React from 'react'
import useTheme from 'hooks/useTheme'
import { IconButton } from '@mui/material'
import './css/index.css'

const GroupPaymentDialog = ({ dialog, setDialog }) => {
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: '20px' }}>
                    <div style={{ display: 'flex', gap: 10, padding: '0', maxWidth: '80vw', overflowX: 'auto' }}>
                        {dialog.payments?.map((payment) => (
                            <div key={payment._id} className="payment-item" style={{ backgroundColor: `${theme.text.secondary}22`, color: theme.text.secondary, borderRadius: theme.radius.ternary }}>    
                                <span>{payment.invoice}</span>
                                <IconButton>
                                    <CloseRoundedIcon style={{ color: theme.text.secondary }} />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    <IconButton onClick={handleCloseDialog}>
                        <CloseRoundedIcon style={{ color: theme.text.primary }} />
                    </IconButton>
                </div>
            </div>
        </AlertContainer>
    )
}

export default GroupPaymentDialog
