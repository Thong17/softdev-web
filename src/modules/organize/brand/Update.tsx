import React, { useEffect } from 'react'
import BrandForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getBrand, selectBrand } from './redux'

const Header = () => {
    return <><StoreBreadcrumbs page='brandUpdate' /></>
}

export const UpdateBrand = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectBrand)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getBrand({ id, fields: ['name', 'icon', 'status', 'description'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <BrandForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
