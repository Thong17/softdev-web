import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { PublicNav } from 'components/shared/PublicNav'

export const About = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
      }}
    >
      <PublicNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontWeight: 300, marginBottom: 20 }}>{language['ABOUT_US_TITLE']}</h1>
        <p style={{ color: theme.text.secondary, lineHeight: 1.7 }}>{language['ABOUT_US_CONTENT']}</p>
      </div>
    </div>
  )
}
