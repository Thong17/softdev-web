import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { CustomButton, CustomInvoiceForm } from 'styles'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { FlexBetween } from '../container/FlexBetween'
import useWeb from 'hooks/useWeb'
import { CustomerContainer } from '../container/CustomerContainer'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const InvoiceForm = ({
  name = 'Shop Name',
  tax = 0,
  font = 'Ariel',
}: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [toggle, setToggle] = useState(false)

  return (
    <CustomInvoiceForm
      mode={toggle ? 'expand' : 'compact'}
      styled={theme}
      device={device}
      font={font}
    >
      <div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {toggle && <CustomerContainer style={{ marginLeft: 10 }} />}
          <div className='toggle' onClick={() => setToggle(!toggle)}>
            <ShoppingCartRoundedIcon fontSize='small' />
          </div>
        </div>
        <div className='invoice-form'>
          <div className='form'>

            <div className='item'>
              <div className='description'>
                <span className='main-description'>MSI Predator 17 inches</span>
                <span className='sub-description'>Price: 1,333$, <span style={{ color: theme.text.tertiary }}>Qty x2</span></span>
              </div>
              <div className='discount'>10%</div>
              <div className='total'><span>1,199$</span><CloseRoundedIcon style={{ fontSize: 17, color: theme.color.error }} /></div>
            </div>
            <div className='item'>
              <div className='description'>
                <span className='main-description'>Apple Macbook Pro 13 inches</span>
                <span className='sub-description'>Price: 1,333$, <span style={{ color: theme.text.tertiary }}>Qty x2</span></span>
              </div>
              <div className='discount'>10%</div>
              <div className='total'><span>1,199$</span><CloseRoundedIcon style={{ fontSize: 17, color: theme.color.error }} /></div>
            </div>
            <div className='item'>
              <div className='description'>
                <span className='main-description'>Apple Macbook Pro 15 inches</span>
                <span className='sub-description'>Price: 1,333$, <span style={{ color: theme.text.tertiary }}>Qty x2</span></span>
              </div>
              <div className='discount'>10%</div>
              <div className='total'><span>1,199$</span><CloseRoundedIcon style={{ fontSize: 17, color: theme.color.error }} /></div>
            </div>

          </div>
        </div>
      </div>
      <div>
        <div className='invoice-total'>
          <div className='total-container'>
            <div className='charge'>
              <div className='item'>
                <span>Subtotal</span>
                <span>20.00$</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Discount</span>
                <span>-20%</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Tax</span>
                <span>+10%</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Voucher</span>
                <span>-10%</span>
              </div>
            </div>
            <div className='total'>
              <span>Total</span>
              <span>20.00$</span>
            </div>
          </div>
        </div>
        <div className='invoice-payment'>
          <div className='total-container'>
            <div className='total'>
              <FlexBetween>
                <CustomButton
                  styled={theme}
                  fullWidth
                  style={{
                    color: theme.text.secondary,
                    marginRight: 10,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  Clear
                </CustomButton>
                <CustomButton
                  styled={theme}
                  fullWidth
                  style={{
                    backgroundColor: `${theme.color.info}22`,
                    color: theme.color.info,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  Payment
                </CustomButton>
              </FlexBetween>
            </div>
          </div>
        </div>
      </div>
    </CustomInvoiceForm>
  )
}
