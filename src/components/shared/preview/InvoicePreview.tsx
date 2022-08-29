import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import { CustomInvoiceForm } from 'styles/container'
import { CustomerStatistic } from '../container/CustomerContainer'

export const InvoicePreview = () => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <div
      style={{
        borderRadius: theme.radius.ternary,
        height: '100%',
      }}
    >
      <CustomInvoiceForm
        mode='expand'
        styled={theme}
        device={device}
        font='Ariel'
        height='100%'
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
            <CustomerStatistic
              point={10}
              phone='Test'
              style={{ marginLeft: 10 }}
            />
          </div>
          <div className='invoice-form'></div>
        </div>
        <div className='invoice-total'>
          <div className='total-container' style={{ marginBottom: 10 }}>
            <div className='charge'>
              <div className='item'>
                <span>Subtotal</span>
                <div style={{ display: 'flex', lineHeight: 1 }}>
                  <span>100%</span>
                </div>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Discount</span>
                <span>-10%</span>
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
              <span>100$</span>
            </div>
          </div>
        </div>
      </CustomInvoiceForm>
    </div>
  )
}
