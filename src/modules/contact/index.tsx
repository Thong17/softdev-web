import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { PublicNav } from 'components/shared/PublicNav'
import { SocialNav } from 'components/shared/SocialNav'
import { getStoreInfo, IPublicStore } from 'api/menu.api'

export const Contact = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [store, setStore] = useState<IPublicStore | null>(null)

  useEffect(() => {
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null))
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
      }}
    >
      <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} storeAddress={store?.address} />
      <SocialNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontWeight: 300, marginBottom: 20 }}>{language['CONTACT_US_TITLE']}</h1>

        <div
          style={{
            background: theme.background.secondary,
            borderRadius: 8,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {store?.name && (
            <div>
              <div style={{ fontSize: 12, color: theme.text.tertiary, marginBottom: 4 }}>{language['HOME']}</div>
              <div style={{ fontSize: 15 }}>{store.name}</div>
            </div>
          )}
          {store?.address && (
            <div>
              <div style={{ fontSize: 12, color: theme.text.tertiary, marginBottom: 4 }}>{language['CONTACT_ADDRESS']}</div>
              <div style={{ fontSize: 15 }}>{store.address}</div>
            </div>
          )}
          {store?.contact && (
            <div>
              <div style={{ fontSize: 12, color: theme.text.tertiary, marginBottom: 4 }}>{language['CONTACT_PHONE']}</div>
              <div style={{ fontSize: 15 }}>{store.contact}</div>
            </div>
          )}
          {!store && (
            <div style={{ fontSize: 13, color: theme.text.tertiary }}>{language['CONTACT_INFO_UNAVAILABLE']}</div>
          )}
        </div>
      </div>
    </div>
  )
}
