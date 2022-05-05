import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import React from 'react'

const Profile = ({ username }) => {
  const { logout } = useAuth()
  const { theme } = useTheme()

  return (
    <div style={{ color: theme.text.primary }}>
      Hello {username} <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default Profile
