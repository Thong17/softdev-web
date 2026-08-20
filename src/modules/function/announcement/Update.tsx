import React, { useEffect } from 'react'
import AnnouncementForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getAnnouncement, selectAnnouncement } from './redux'
import { inputDateTimeFormat } from 'utils'

const Header = () => {
    return <><StoreBreadcrumbs page='announcementUpdate' /></>
}

export const UpdateAnnouncement = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectAnnouncement)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getAnnouncement({ id, fields: ['title', 'description', 'banner', 'status', 'startAt', 'expireAt', 'order'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <AnnouncementForm id={id} defaultValues={{ ...defaultValues, startAt: inputDateTimeFormat(defaultValues.startAt), expireAt: inputDateTimeFormat(defaultValues.expireAt) }} />
      }
    </Container>
  )
}
