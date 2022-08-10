import { invoiceColumns } from 'constants/variables'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomInvoiceForm } from 'styles'
import { InvoiceTable } from '../table/InvoiceTable'
import { FlexBetween } from '../container/FlexBetween'
import { PreBorder, PreDate, PreTime, ThermalBorder } from '../container/InvoiceContainer'

export const InvoiceForm = ({
  width = 410,
  name = 'Shop Name',
  tax = 0,
  font = 'Ariel'
}: any) => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div
      style={{
        overflowX: 'hidden',
        overflowY: 'visible',
        height: 'fit-content',
        position: 'relative',
        minWidth: width,
        boxSizing: 'border-box',
        padding: '35px 0',
      }}
    >
      <CustomInvoiceForm
        mode='preview'
        style={{ minWidth: width, maxWidth: width }}
        styled={theme}
        font={font}
      >
        <p
          style={{
            fontSize: theme.responsive[device]?.text.h1,
            textAlign: 'center',
            marginBottom: 20
          }}
        >
          {name}
        </p>
        <FlexBetween>
          <PreDate date={null} />
          <PreTime date={null} />
        </FlexBetween>
        <FlexBetween>
          <span>Invoice: INV0000000</span>
          <span>Cashier: {user?.username}</span>
        </FlexBetween>
        <PreBorder styled={theme} />
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
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            marginTop: 20
          }}
        >
          Thank you for coming
        </p>
      </CustomInvoiceForm>
      <ThermalBorder styled={theme} position='bottom' />
    </div>
  )
}
