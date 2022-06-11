import React, { useEffect } from 'react'
import ProductForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getDetailProduct, selectDetailProduct } from './redux'

const Header = ({ id }) => {
    return <><StoreBreadcrumbs page='productUpdate' id={id} /></>
}

export const UpdateProduct = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectDetailProduct)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getDetailProduct({ id, fields: ['name', 'price', 'profile', 'status', 'currency', 'code', 'brand', 'category', 'images', 'description', 'isStock'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header id={id} />}>
      {
        status === 'SUCCESS' && <ProductForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
