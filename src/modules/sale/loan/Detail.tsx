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

const Header = ({ stages, status, styled, language, onOpenDeposit }) => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumb stages={stages} title={<ConfirmationNumberRoundedIcon />} />
      <CustomButton
        onClick={() => onOpenDeposit()}
        disabled={!status}
        style={{
          marginLeft: 10,
          backgroundColor: !status ? `${styled.text.secondary}22` : `${styled.color.success}22`,
          color: !status ? styled.text.secondary : styled.color.success,
        }}
        styled={styled}
      >
        {!status ? language['COMPLETED'] : language['CLEAR']}
      </CustomButton>
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

  return (
    <Container header={<Header status={data?.status === 'APPROVED'} stages={stages} styled={theme} language={language} onOpenDeposit={() => setDepositDialog({ open: true, payment: mapPayment(data), detail: data })} />}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateAreas: `'loanDetail''loanTable'`,
        }}
      >
        <DepositDialog dialog={depositDialog} setDialog={setDepositDialog} />
        <Box sx={{ gridArea: 'loanDetail' }}><LoanDetail data={data} /></Box>
        <Box sx={{ gridArea: 'loanTable' }}><LoanTable data={data?.loanPayments} /></Box>
      </Box>
    </Container>
  )
}

const mapPayment = (data): IPaymentInfo => {
  return {
    _id: data._id,
    rate: data.payment.rate,
    customer: data.customer,
    remainTotal: data.totalRemain,
    returnCashes: [],
    status: false,
    total: { value: data.totalRemain.USD, currency: 'USD' }
  }
}
