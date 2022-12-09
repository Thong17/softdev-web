import React, { useEffect, useState } from 'react'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import Breadcrumb from 'components/shared/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListTransfer, selectListTransfer } from './redux'
import useTheme from 'hooks/useTheme'
import { SelectTab } from 'components/shared/form/SelectTab'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import { IconButton } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { TransferForm } from './TransferForm'
import {
  DeleteButton,
  UpdateButton,
} from 'components/shared/table/ActionButton'
import useAlert from 'hooks/useAlert'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
    </>
  )
}

const initTransfer = {}

export const PaymentStore = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { data } = useAppSelector(selectListTransfer)
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [transferMethods, setTransferMethods] = useState<any[]>([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [transferDialog, setTransferDialog] = useState({
    open: false,
    transferId: null,
  })
  const [image, setImage] = useState(null)
  const [transferId, setTransferId] = useState(null)
  const [defaultValues, setDefaultValues] = useState(initTransfer)
  const confirm = useAlert()
  const { notify } = useNotify()

  useEffect(() => {
    setSelectedMethod(data?.[0]?.title || '')
    setTransferMethods(
      data?.map((item) => ({ label: item.title, value: item.title })) || []
    )
    setImage(data?.[0]?.image?.filename)
    setTransferId(data?.[0]?._id)
    setDefaultValues({ title: data?.[0]?.title, image: data?.[0]?.image })
  }, [data])

  useEffect(() => {
    dispatch(getListTransfer())
  }, [dispatch])

  const stages = [
    {
      title: language['ORGANIZE'],
      path: '/organize',
    },
    {
      title: language['STORE'],
      path: '/organize/store',
    },
    {
      title: language['INFO'],
      path: `/organize/store/update/${id}`,
    },
    {
      title: language['PAYMENT'],
    },
  ]

  const handleChangeTransfer = (value) => {
    setSelectedMethod(value)
    const transferValue = data?.find((item) => item.title === value)
    setTransferId(transferValue?._id)
    setImage(transferValue?.image?.filename)
  }

  const handleUpdateTransfer = () => {
    const transferValue = data?.find((item) => item.title === selectedMethod)
    setDefaultValues({ title: selectedMethod, image: transferValue?.image })
    setTransferDialog({ open: true, transferId: transferId })
  }

  const handleCreateTransfer = () => {
    setDefaultValues(initTransfer)
    setTransferDialog({ ...transferDialog, open: true })
  }

  const handleDeleteTransfer = () => {
    confirm({
      title: 'Are you sure you want to delete this transfer?',
      description: 'Delete transfer will remove it from the database',
      variant: 'error',
    })
      .then(() => {
        Axios({
          url: `/organize/store/transfer/delete/${transferId}`,
          method: 'DELETE',
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            dispatch(getListTransfer())
          })
          .catch((err: any) => notify(err?.response?.data?.msg, 'error'))
      })
      .catch(() => {})
  }

  return (
    <Container header={<Header stages={stages} />}>
      <TransferForm
        dialog={transferDialog}
        setDialog={setTransferDialog}
        theme={theme}
        defaultValues={defaultValues}
      />
      <div
        className='payment-container'
        style={{ height: '100%', width: '100%', position: 'absolute' }}
      >
        <FlexBetween>
          <SelectTab
            selected={selectedMethod}
            options={transferMethods}
            onChange={handleChangeTransfer}
          />
          <IconButton
            onClick={handleCreateTransfer}
            style={{
              color: theme.color.info,
              backgroundColor: `${theme.color.info}22`,
              width: 30,
              height: 23,
              borderRadius: theme.radius.primary,
              marginRight: 10,
            }}
          >
            <AddRoundedIcon fontSize='small' />
          </IconButton>
        </FlexBetween>
        <div
          style={{
            border: theme.border.dashed,
            borderRadius: theme.radius.ternary,
            height: 'calc(100% - 30px)',
            overflow: 'hidden',
          }}
        >
          {transferMethods.length > 0 && (
            <>
              <div style={{ position: 'absolute', top: 40, right: 10 }}>
                <UpdateButton
                  onClick={handleUpdateTransfer}
                  style={{ margin: 0 }}
                />
                <DeleteButton onClick={handleDeleteTransfer} />
              </div>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                src={`${process.env.REACT_APP_API_UPLOADS}${
                  image ? image : 'default.png'
                }`}
                alt='transfer'
                loading='lazy'
              />
            </>
          )}
        </div>
      </div>
    </Container>
  )
}
