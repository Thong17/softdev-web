import useAuth from 'hooks/useAuth'
import React from 'react'

const Profile = ({ username }) => {
  const { logout } = useAuth()
  
  return (
    <div>Hello {username} <button onClick={() => logout()}>Logout</button></div>
  )
}

export default Profile