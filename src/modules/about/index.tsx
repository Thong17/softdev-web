import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { PublicNav } from 'components/shared/PublicNav'
import { getStoreInfo, IPublicStore } from 'api/menu.api'

export const About = () => {
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
      <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} storeContact={store?.contact} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontWeight: 300, marginBottom: 20 }}>{language['ABOUT_US_TITLE']}</h1>
        <p style={{ color: theme.text.secondary, lineHeight: 1.7 }}>{language['ABOUT_US_CONTENT']}</p>
      </div>
    </div>
  )
}
