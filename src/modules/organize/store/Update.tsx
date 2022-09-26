import React, { useEffect } from 'react'
import StoreForm from './Form'
import Container from 'components/shared/Container'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getStore, selectStore } from './redux'
import Breadcrumb from 'components/shared/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import useLanguage from 'hooks/useLanguage'

const Header = ({ stages }) => {
    return <><Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} /></>
}

export const UpdateStore = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectStore)
  const { id } = useParams()
  const { language } = useLanguage()
  
  useEffect(() => {
    if (id) {
      dispatch(getStore({ id, fields: ['name', 'logo', 'contact', 'address', 'type', 'other', 'font', 'tax'] }))
    }
  }, [dispatch, id])

  const stages = [
    {
      title: language['ORGANIZE'],
      path: '/organize'
    },
    {
      title: language['STORE'],
      path: '/organize/store'
    },
    {
      title: language['INFO'],
    },
    {
      title: language['PAYMENT'],
      path: `/organize/store/${id}/payment`
    },
  ]
  
  return (
    <Container header={<Header stages={stages} />}>
      {
        status === 'SUCCESS' && <StoreForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
