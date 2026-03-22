import { Box } from '@mui/material'
import { invoiceColumns } from 'constants/variables'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomInvoiceContainer, StyledThermalBorder } from 'styles'
import { currencyFormat, timeFormat } from 'utils'
import { InvoiceTable } from '../table/InvoiceTable'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'

export const PreDate = ({ date }) => {
  return (
    <TextEllipsis>
      <span>Date: </span>
      <span>{timeFormat(date, 'YYYY-MM-DD HH:mm')}</span>
    </TextEllipsis>
  )
}

export const PreTime = ({ date }) => {
  return (
    <TextEllipsis style={{ textAlign: 'end' }}>
      <span>Time: </span>
      <span>{timeFormat(date)}</span>
    </TextEllipsis>
  )
}

export const PreBorder = ({ styled }) => {
  return (
    <div
      style={{
        margin: '10px 0',
        borderTop: styled.border.dashed,
        width: '100%',
      }}
    ></div>
  )
}

export const ThermalBorder = ({ styled, position = 'bottom' }: any) => {
  return (
    <StyledThermalBorder styled={styled} position={position}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </StyledThermalBorder>
  )
}

export const InvoiceContainer = ({
  width = 410,
  name = 'Shop Name',
  address = 'Address',
  contact = 'Contact',
  logo = null,
  tax = 0,
  footer = '',
  font = 'Ariel',
  padding = '35px 0',
  hasThermalBorder = true,
  rows=[],
  invoice = 'INV0000000',
  subtotal = { USD: 0, KHR: 0 },
  total = { value: 0, currency: 'USD' },
  discounts = [],
  services = [],
  vouchers = [],
  receiveCashes = [],
  remain = 0,
  createdBy = null
}: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        overflowY: 'visible',
        height: 'fit-content',
        position: 'relative',
        minWidth: width,
        boxSizing: 'border-box',
        padding: padding,
        '*': {
          fontFamily: `${font} !important`,
          textTransform: 'none',
          fontSize: '16px',
          letterSpacing: '0.5px',
          lineHeight: '1',
        }
      }}
    >
      {hasThermalBorder && <ThermalBorder styled={theme} position='top' />}
      <CustomInvoiceContainer
        mode='preview'
        style={{ minWidth: width, maxWidth: width }}
        styled={theme}
        font={font}
      >
        {logo && <div style={{ width: 50, height: 50, position: 'absolute', left: 20, top: 20 }}>
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: theme.radius.primary,
            }}
            src={`${process.env.REACT_APP_API_UPLOADS}${logo}`}
            alt='logo'
            loading='lazy'
          />
        </div>}
        <p
          style={{
            fontSize: theme.responsive[device]?.text.h1,
            textAlign: 'center',
          }}
        >
          {name}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            style={{
              fontSize: theme.responsive[device]?.text.quaternary,
              textAlign: 'center',
              marginBottom: 10,
              maxWidth: '80%',
            }}
          >
            {address}
          </p>
        </div>
        <p
          style={{
            fontSize: theme.responsive[device]?.text.quaternary,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >{contact}</p>
        <FlexBetween>
          <span>Order: {invoice}</span>
          <span>Cashier: {createdBy}</span>
        </FlexBetween>
        <FlexBetween style={{ marginBottom: 8 }}>
          <PreDate date={null} />
        </FlexBetween>
        <InvoiceTable tableSpaceHeight={200} columns={invoiceColumns} rows={rows?.map((row) => ({
          description: row.description,
          qty: row.quantity,
          price: currencyFormat(row.price.value, row.price.currency),
          disc: <>{currencyFormat(row.discount.value, row.discount.currency)} {row.discount.isFixed ? 'Only' : ''}</>,
          total: currencyFormat(row.total.value, row.total.currency)
        }))} />
        <p style={{ lineHeight: 0 }}>{'-'.repeat(200)}</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <span></span>
          <div style={{ width: '50%' }}>
            <FlexBetween>
              <span>Subtotal:</span>
              <span>{ currencyFormat(subtotal.USD, 'USD') }</span>
            </FlexBetween>
            <FlexBetween>
              <span>Discount:</span>
              <span>%</span>
            </FlexBetween>
            <FlexBetween>
              <span>Tax:</span>
              <span>{tax}%</span>
            </FlexBetween>
            <FlexBetween>
              <span>Total:</span>
              <span>$</span>
            </FlexBetween>
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          {footer}
        </p>
        <p
          style={{
            textAlign: 'center',
          }}
        >
          Thank you for coming
        </p>
      </CustomInvoiceContainer>
      {hasThermalBorder && <ThermalBorder styled={theme} position='bottom' />}
    </Box>
  )
}
