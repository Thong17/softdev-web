import React, { useEffect } from 'react'
import StoreForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getStore, selectStore } from './redux'

const Header = () => {
    return <><StoreBreadcrumbs page='storeUpdate' /></>
}

export const UpdateStore = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectStore)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getStore({ id, fields: ['name', 'icon', 'status', 'description'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <StoreForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
