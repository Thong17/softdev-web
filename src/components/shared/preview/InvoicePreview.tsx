import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React, { useEffect, useState } from 'react'
import { CustomInvoiceForm } from 'styles/container'
import { currencyFormat, timeFormat } from 'utils'
import { CustomerStatistic } from '../container/CustomerContainer'
import { CircleIcon } from '../table/CustomIcon'
import { IconButton } from '@mui/material'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import { handleThermalPrint } from 'utils/printer'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'

export const InvoicePreview = ({ payment, customer }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const { notify } = useNotify()

  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/organize/store/getTelegramSetting'
    })
      .then((res) => {
        const data = res.data.data
        setPrinterSetting({
          receiptPrinterName: data.receiptPrinterName || '',
          receiptPrinterCharPerLine: data.receiptPrinterCharPerLine || 0,
          storePrinterName: data.storePrinterName || '',
          storePrinterCharPerLine: data.storePrinterCharPerLine || 0,
          thermalPrinterName: data.thermalPrinterName || '',
          thermalPrinterWidth: data.thermalPrinterWidth || 0,
          thermalPrinterHeight: data.thermalPrinterHeight || 0,
          thermalPrinterGap: data.thermalPrinterGap || 0
        })
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
    //eslint-disable-next-line
  }, [])

  const [printerSetting, setPrinterSetting] = useState({
    receiptPrinterName: '',
    receiptPrinterCharPerLine: 0,
    storePrinterName: '',
    storePrinterCharPerLine: 0,
    thermalPrinterName: '',
    thermalPrinterWidth: 0,
    thermalPrinterHeight: 0,
    thermalPrinterGap: 0
  });

  const handlePrintTransaction = (event, transaction) => {
    event.stopPropagation()
    // Implementation for printing transaction
    handleThermalPrint({
      items: [{
        description: transaction.product?.name?.English || transaction.description,
        qty: transaction.quantity,
        hasThermalPrinting: !!transaction.product?.category?.hasThermalPrinting,
        options: transaction.options?.map(option => ({
          name: option.property?.name?.English,
          value: option.name?.English
        }))
      }],
      createdAt: timeFormat(payment?.createdAt, 'YYYY-MM-DD HH:mm'),
      invoice: payment?.invoice
    }, printerSetting.thermalPrinterName, {
      width: Number(printerSetting.thermalPrinterWidth),
      height: Number(printerSetting.thermalPrinterHeight),
      gap: Number(printerSetting.thermalPrinterGap)
    }).catch(err => notify(err.message, 'error'))
  }
  
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
            <span style={{ marginRight: 10 }}>#{payment?.invoice?.split('-')[1]}</span>
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
                              transaction.price,
                              transaction.currency
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
                        <div style={{ minWidth: 33 }}>
                          {(!payment?.status && transaction.product?.category?.hasThermalPrinting) && <IconButton
                            onClick={(e) => handlePrintTransaction(e, transaction)}
                            style={{
                              backgroundColor: `${theme.color.info}22`,
                            }}
                          >
                            <PrintRoundedIcon
                              style={{ fontSize: 17, color: theme.color.info }}
                            />
                          </IconButton>}
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
                        -{currencyFormat(promotion.isFixed ? payment?.subtotal.BOTH - promotion.value : promotion.value, promotion.type)}
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
                        -{currencyFormat(promotion.isFixed ? payment?.subtotal.BOTH - promotion.value : promotion.value, promotion.type)}
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
