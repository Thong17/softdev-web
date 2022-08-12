import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { CustomButton, CustomInvoiceForm } from 'styles'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { FlexBetween } from '../container/FlexBetween'

export const InvoiceForm = ({
  name = 'Shop Name',
  tax = 0,
  font = 'Ariel',
}: any) => {
  const { theme } = useTheme()
  const [toggle, setToggle] = useState(false)

  return (
    <CustomInvoiceForm
      mode={toggle ? 'expand' : 'compact'}
      styled={theme}
      font={font}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <div className='toggle' onClick={() => setToggle(!toggle)}>
          <ShoppingCartRoundedIcon fontSize='small' />
        </div>
      </div>
      <div className='invoice-form'>

      </div>
      <div className="invoice-total">
        <div className="total-container">
        <div className="charge">
            <div className='item'>
              <span>Subtotal</span>
              <span>20.00$</span>
            </div>
            <div className='item'>
              <span>Discount</span>
              <span>10%</span>
            </div>
            <div className='item'>
              <span>Tax</span>
              <span>10%</span>
            </div>
          </div>
          <div className="total">
            <span>Total</span>
            <span>20.00$</span>
          </div>
        </div>
      </div>
      <div className="invoice-payment">
        <div className="total-container">
          <div className="total">
            <FlexBetween>
              <CustomButton styled={theme} fullWidth style={{ color: theme.color.error, marginRight: 10 }}>Cancel</CustomButton>
              <CustomButton styled={theme} fullWidth style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success }}>Payment</CustomButton>
            </FlexBetween>
          </div>
        </div>
      </div>
    </CustomInvoiceForm>
  )
}
