import { Box } from '@mui/material'
import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import Breadcrumb from 'components/shared/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'
import LoanDetail from 'components/shared/container/LoanDetail'
import LoanTable from 'components/shared/table/LoanTable'
import { CustomButton } from 'styles/index'
import useTheme from 'hooks/useTheme'
import { DepositDialog } from './DepositDialog'
import { IPaymentInfo } from 'components/shared/form/PaymentForm'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getDetailLoan, selectDetailLoan } from './redux'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { renderStatus } from './constant'
import { WriteOffDialog } from './WriteOffDialog'

const Header = ({ stages, status, styled, language, onOpenDeposit, onOpenWriteOff }) => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumb stages={stages} title={<ConfirmationNumberRoundedIcon />} />
      <div>
        {status === 'IN_PROGRESS' && <CustomButton
          onClick={() => onOpenWriteOff()}
          style={{
            marginLeft: 10,
            backgroundColor: `${styled.color.error}22`,
            color: styled.color.error,
          }}
          styled={styled}
        >
          {language['WRITE_OFF']}
        </CustomButton>}
        <CustomButton
          onClick={() => onOpenDeposit()}
          disabled={status === 'CLEARED'}
          style={{
            marginLeft: 10,
            backgroundColor: `${renderStatus(status, styled)}22`,
            color: renderStatus(status, styled),
          }}
          styled={styled}
        >
          {status === 'CLEARED' ? language['PAID_OFF'] : language['PAY_OFF']}
        </CustomButton>
      </div>
    </Box>
  )
}

export const DetailLoan = () => {
  const dispatch = useAppDispatch()
  const { data: loanDetail, status } = useAppSelector(selectDetailLoan)
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [depositDialog, setDepositDialog] = useState<any>({ open: false, payment: null, detail: null })
  const [writeOffDialog, setWriteOffDialog] = useState({ open: false });
  const { user } = useAuth()
  const { notify } = useNotify()

  const stages = [
    {
      title: language['SALE'],
      path: '/sale',
    },
    {
      title: language['LOAN'],
      path: '/sale/loan',
    },
    {
      title: data?.payment?.invoice,
    },
  ]

  useEffect(() => {
    if (status !== 'SUCCESS') return
    setData(loanDetail)
  }, [loanDetail, status])

  useEffect(() => {
    if (!id) return
    dispatch(getDetailLoan(id))
    // eslint-disable-next-line
  }, [id])

  const handleOpenDeposit = () => {
    if (!user?.drawer) return notify('No drawer opened', 'error')
    setDepositDialog({ open: true, payment: mapPayment(data, user?.drawer), detail: data })
  }

  return (
    <Container header={<Header status={data?.status} stages={stages} styled={theme} language={language} onOpenDeposit={handleOpenDeposit} onOpenWriteOff={() => setWriteOffDialog({ open: true })} />}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateAreas: `'loanDetail''loanTable'`,
        }}
      >
        <DepositDialog dialog={depositDialog} setDialog={setDepositDialog} />
        {data?.payment?.transactions && <WriteOffDialog dialog={writeOffDialog} setDialog={setWriteOffDialog} data={data} defaultValues={{ transactions: data?.payment?.transactions?.map(item => ({
          writeOffType: 'REPOSSESS',
          remainingCostCurrency: 'USD',
          remainingCost: 0,
          newPrice: 0,
          newPriceCurrency: 'USD',
          condition: 'USED',
          reason: '',
          note: '',
          id: item._id,
        })) }} />}
        <Box sx={{ gridArea: 'loanDetail' }}><LoanDetail data={data} /></Box>
        <Box sx={{ gridArea: 'loanTable' }}><LoanTable data={data?.loanPayments} detail={data} /></Box>
      </Box>
    </Container>
  )
}

const mapPayment = (data, rate): IPaymentInfo => {
  return {
    _id: data._id,
    rate,
    customer: data.customer,
    remainTotal: data.totalRemain,
    returnCashes: data.paymentObj?.returnCashes || [],
    status: data.paymentObj?.status || false,
    total: data.paymentObj?.total
  }
}
