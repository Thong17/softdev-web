import { Box } from '@mui/material'
import Container from 'components/shared/Container'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import Breadcrumb from 'components/shared/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'

const Header = ({ stages }) => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumb stages={stages} title={<ConfirmationNumberRoundedIcon />} />
    </Box>
  )
}

export const DetailLoan = ({}: any) => {
  const { notify } = useNotify()
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const { language } = useLanguage()

  const stages = [
    {
      title: language['FUNCTION'],
      path: '/function',
    },
    {
      title: language['LOAN'],
      path: '/function/loan'
    },
    {
      title: data?.payment?.invoice
    }
  ]

  useEffect(() => {
    if (!id) return
    Axios({
      method: 'GET',
      url: `/function/loan/detail/${id}`,
    })
      .then((data) => {        
        setData(data?.data?.data)
      })
      .catch((err) => notify(err?.response?.data?.msg))
    // eslint-disable-next-line
  }, [id])

  return <Container header={<Header stages={stages} />}>Hello</Container>
}
