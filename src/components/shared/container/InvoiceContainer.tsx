import { Box } from '@mui/material'
import { invoiceColumns } from 'constants/variables'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomInvoiceContainer, StyledThermalBorder } from 'styles'
import { dateFormat, timeFormat } from 'utils'
import { InvoiceTable } from '../table/InvoiceTable'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'

export const PreDate = ({ date }) => {
  return (
    <TextEllipsis>
      <span>Date: </span>
      <span>{dateFormat(date)}</span>
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
  font = 'Ariel'
}: any) => {
  const { user } = useAuth()
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
        padding: '35px 0',
        '*': {
          fontFamily: `${font} !important`
        }
      }}
    >
      <ThermalBorder styled={theme} position='top' />
      <CustomInvoiceContainer
        mode='preview'
        style={{ minWidth: width, maxWidth: width }}
        styled={theme}
        font={font}
      >
        {logo && <div style={{ width: 50, height: 50, position: 'absolute', left: 20, top: 70 }}>
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
          <PreDate date={null} />
          <PreTime date={null} />
        </FlexBetween>
        <FlexBetween>
          <span>Invoice: INV0000000</span>
          <span>Cashier: {user?.username}</span>
        </FlexBetween>
        <InvoiceTable columns={invoiceColumns} rows={[]} />
        <PreBorder styled={theme} />
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
          }}
        >
          <span>Total</span>
          <div style={{ width: '50%' }}>
            <FlexBetween>
              <span>USD:</span>
              <span>$</span>
            </FlexBetween>
            <FlexBetween>
              <span>KHR:</span>
              <span>$</span>
            </FlexBetween>
            <FlexBetween>
              <span>Disc:</span>
              <span>%</span>
            </FlexBetween>
            <FlexBetween>
              <span>Tax:</span>
              <span>{tax}%</span>
            </FlexBetween>
            <PreBorder styled={theme} />
            <FlexBetween>
              <span>Receive:</span>
              <span>$</span>
            </FlexBetween>
            <FlexBetween>
              <span>Remain:</span>
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
      <ThermalBorder styled={theme} />
    </Box>
  )
}
