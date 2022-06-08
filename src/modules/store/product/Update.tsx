import React, { useEffect } from 'react'
import ProductForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getProduct, selectProduct } from './redux'

const Header = () => {
    return <><StoreBreadcrumbs page='productUpdate' /></>
}

export const UpdateProduct = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectProduct)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getProduct({ id, fields: ['name', 'price', 'profile', 'status', 'currency', 'code', 'brand', 'category', 'description', 'isStock'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <ProductForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
