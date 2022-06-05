import React, { useEffect } from 'react'
import CategoryForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getCategory, selectCategory } from './redux'

const Header = () => {
    return <><StoreBreadcrumbs page='categoryUpdate' /></>
}

export const UpdateCategory = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectCategory)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getCategory({ id, fields: ['name', 'icon', 'status', 'description'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <CategoryForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
