import { invoiceColumns } from 'constants/variables'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomInvoiceContainer } from 'styles'
import { dateFormat, timeFormat } from 'utils'
import { InvoiceTable } from '../table/InvoiceTable'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'

const PreDate = ({ date }) => {
    return <TextEllipsis><span>Date: </span><span>{dateFormat(date)}</span></TextEllipsis>
}

const PreTime = ({ date }) => {
    return <TextEllipsis style={{ textAlign: 'end' }}><span>{timeFormat(date)}</span></TextEllipsis>
}

const PreBorder = ({ styled }) => {
    return <div style={{ margin: '10px 0', borderTop: styled.border.dashed, width: '100%' }}></div>
}

export const InvoiceContainer = ({ width = 400 }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomInvoiceContainer style={{ width: width }} styled={theme}>
      <TextEllipsis
        style={{
          fontSize: theme.responsive[device]?.text.h1,
          textAlign: 'center',
          marginBottom: 10,
          color: theme.text.primary
        }}
      >
        Shop Name
      </TextEllipsis>
      <FlexBetween><PreDate date={null} /><PreTime date={null} /></FlexBetween>
      <FlexBetween><span>Invoice: INV0000001</span><span>Cashier: Thong</span></FlexBetween>
      <PreBorder styled={theme} />
      <InvoiceTable columns={invoiceColumns} rows={[]} />
      <PreBorder styled={theme} />
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
        <span>Total</span>
        <div style={{ width: '50%' }}>
            <FlexBetween>
                <span>USD:</span>
                <span>100$</span>
            </FlexBetween>
            <FlexBetween>
                <span>KHR:</span>
                <span>400000$</span>
            </FlexBetween>
            <FlexBetween>
                <span>Disc:</span>
                <span>50%</span>
            </FlexBetween>
            <FlexBetween>
                <span>Tax:</span>
                <span>10%</span>
            </FlexBetween>
            <PreBorder styled={theme} />
            <FlexBetween>
                <span>Receive:</span>
                <span>100$</span>
            </FlexBetween>
            <FlexBetween>
                <span>Remain:</span>
                <span>100$</span>
            </FlexBetween>
        </div>
      </div>
      <TextEllipsis
        style={{
          textAlign: 'center',
          marginTop: 30,
          color: theme.text.primary
        }}
      >
        Thank you for coming
      </TextEllipsis>
    </CustomInvoiceContainer>
  )
}
