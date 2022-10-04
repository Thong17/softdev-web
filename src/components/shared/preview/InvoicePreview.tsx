import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import { CustomInvoiceForm } from 'styles/container'
import { currencyFormat } from 'utils'
import { CustomerStatistic } from '../container/CustomerContainer'
import { CircleIcon } from '../table/CustomIcon'

export const InvoicePreview = ({ payment, customer }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  
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
        height='100%'
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 0',
            }}
          >
            <CustomerStatistic
              point={customer?.point || 0}
              phone={customer?.displayName}
              style={{ marginLeft: 10 }}
            />
          </div>
          <div
            style={{ height: '100%', position: 'relative', marginBottom: 10 }}
          >
            <div
              className='invoice-form'
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                top: 0,
                right: 0,
                overflowY: 'auto',
                boxSizing: 'border-box'
              }}
            >
              <div className='form'>
                {payment?.transactions.map((transaction, key) => {
                  const { value: total, currency } = transaction.total
                  return (
                    <div className='item' key={key} style={{ cursor: 'default' }}>
                      <div className='item-description'>
                        <div className='profile'>
                          <CircleIcon icon={transaction.product?.profile?.filename} />
                        </div>
                        <div className='description'>
                          <span className='main-description'>
                            {transaction.description}
                          </span>
                          <span className='sub-description'>
                            {language['PRICE']}:
                            {currencyFormat(
                              transaction.price?.value,
                              transaction.price?.currency
                            )}
                            <span
                              style={{
                                margin: '0 3px',
                                color: theme.text.quaternary,
                              }}
                            >
                              |
                            </span>
                            <span>{language['QTY']}: {transaction.quantity}</span>
                          </span>
                        </div>
                        <div className='discount'>
                          <span className='main-description'>{language['DISC']}</span>
                          <span className='sub-description'>
                            {currencyFormat(
                              transaction.discount?.value,
                              transaction.discount?.currency
                            )}
                            {transaction.discount?.isFixed && (
                              <span style={{ marginLeft: 3 }}>{language['ONLY']}</span>
                            )}
                          </span>
                        </div>
                        <div className='total'>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span className='main-description'>{language['TOTAL']}</span>
                            <span className='sub-description'>
                              {currencyFormat(total, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='invoice-total'>
            <div className='total-container'>
              <div className='charge'>
                <div className='item'>
                  <span>{language['SUBTOTAL']}</span>
                  <div style={{ display: 'flex', lineHeight: 1 }}>
                    <span>
                      {currencyFormat(
                        payment?.subtotal.USD +
                          payment?.subtotal.KHR / payment?.rate.sellRate,
                        'USD'
                      )}
                    </span>
                  </div>
                </div>
                {payment?.discounts.map((promotion, key) => {
                  return (
                    <div
                      key={key}
                      className='item'
                      style={{
                        color: theme.text.quaternary,
                        fontSize: theme.responsive[device]?.text.quaternary,
                      }}
                    >
                      <span>{promotion.title}</span>
                      <span>
                        -{currencyFormat(promotion.value, promotion.type)}
                      </span>
                    </div>
                  )
                })}
                {payment?.services.map((service, key) => {
                  return (
                    <div
                      key={key}
                      className='item'
                      style={{
                        color: theme.text.quaternary,
                        fontSize: theme.responsive[device]?.text.quaternary,
                      }}
                    >
                      <span>{service.title}</span>
                      <span>
                        +{currencyFormat(service.value, service.type)}
                      </span>
                    </div>
                  )
                })}
                {payment?.vouchers.map((promotion, key) => {
                  return (
                    <div
                      key={key}
                      className='item'
                      style={{
                        color: theme.text.quaternary,
                        fontSize: theme.responsive[device]?.text.quaternary,
                      }}
                    >
                      <span>{promotion.title}</span>
                      <span>
                        -{currencyFormat(promotion.value, promotion.type)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className='total'>
                <span>{language['TOTAL']}</span>
                <span>
                  {currencyFormat(
                    payment?.total.value,
                    payment?.total.currency
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomInvoiceForm>
    </div>
  )
}
