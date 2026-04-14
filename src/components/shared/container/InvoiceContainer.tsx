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
  createdBy = null,
  createdAt = null,
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
        {logo && <div style={{ width: 40, height: 40, position: 'absolute', left: 20, top: 20 }}>
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
        <p
          style={{
            fontSize: theme.responsive[device]?.text.quaternary,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >{contact}</p>
        <FlexBetween>
          <span>Order: {invoice}</span>
          <span>Cashier: {createdBy}</span>
        </FlexBetween>
        <FlexBetween style={{ marginBottom: 8 }}>
          <PreDate date={createdAt} />
        </FlexBetween>
        <InvoiceTable tableSpaceHeight={200} columns={invoiceColumns} rows={rows?.map((row) => ({
          description: row.description,
          qty: row.quantity,
          price: currencyFormat(row.total.value, row.total.currency),
          disc: <>{currencyFormat(row.discount?.value, row.discount?.currency)} {row.discount?.isFixed ? 'Only' : ''}</>,
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
              <span>{ discounts?.[0]?.title }:</span>
              <span>{ currencyFormat(discounts?.[0]?.value, discounts?.[0]?.type) ?? 0 } {discounts?.[0]?.isFixed ? 'Only' : ''}</span>
            </FlexBetween>
            <FlexBetween>
              <span>{ services?.[0]?.title }:</span>
              <span>{ currencyFormat(services?.[0]?.value, services?.[0]?.type) ?? 0 }</span>
            </FlexBetween>
            <FlexBetween>
              <span>Total:</span>
              <span>{ currencyFormat(total.value, total.currency) }</span>
            </FlexBetween>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <p
            style={{
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {address}
          </p>
        </div>
        <p
          style={{
            textAlign: 'center',
          }}
        >
          {footer}
        </p>
      </CustomInvoiceContainer>
      {hasThermalBorder && <ThermalBorder styled={theme} position='bottom' />}
    </Box>
  )
}
