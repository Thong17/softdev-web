import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'
import { CardContainer } from 'components/shared/container/CardContainer'
import Footer from 'components/shared/Footer'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Avatar, CircularProgress, List, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

const localeLabel = (value: any) => (typeof value === 'string' ? value : value?.English)

export const SelectStore = () => {
  const navigate = useNavigate()
  const { user, switchStore, logout } = useAuth()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const stores = user?.stores || []

  const handleSelect = async (storeId: string) => {
    setLoadingId(storeId)
    await switchStore(storeId)
    navigate('/', { replace: true })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        color: theme.text.secondary,
        fontWeight: theme.font.weight,
        fontFamily: theme.font.family,
      }}
    >
      <CardContainer title={language['SELECT_STORE'] || 'Select a Store'}>
        <div style={{ padding: '20px 30px 40px 30px', width: device === 'mobile' ? 300 : 420 }}>
          {stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              You don't belong to any store yet.
            </div>
          ) : (
            <List style={{ width: '100%' }}>
              {stores.map((store) => {
                const isActive = store.id === user?.activeStoreId
                return (
                  <ListItemButton
                    key={store.id}
                    onClick={() => handleSelect(store.id)}
                    disabled={loadingId !== null}
                    style={{
                      borderRadius: theme.radius.secondary,
                      marginBottom: 8,
                      backgroundColor: theme.background.secondary,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={store.logo ? `${process.env.REACT_APP_API_UPLOADS}${store.logo}` : undefined}
                        style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
                      >
                        <StorefrontRoundedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={store.name}
                      secondary={localeLabel(store.roleName)}
                    />
                    {loadingId === store.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      isActive && <CheckCircleRoundedIcon style={{ color: theme.color.success }} />
                    )}
                  </ListItemButton>
                )
              })}
            </List>
          )}
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: theme.color.error,
            }}
            onClick={() => logout()}
          >
            <LogoutRoundedIcon fontSize='small' style={{ marginRight: 6 }} />
            {language['LOGOUT'] || 'Logout'}
          </div>
        </div>
      </CardContainer>
      <Footer style={{ position: 'absolute', right: 0, bottom: 0 }}>Footer</Footer>
    </div>
  )
}
