import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { getMenu, IMenuCategory } from 'api/menu.api'

export const Menu = () => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [categories, setCategories] = useState<IMenuCategory[]>([])
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE')

  useEffect(() => {
    setStatus('LOADING')
    getMenu()
      .then((res) => {
        setCategories(res.data?.data || [])
        setStatus('SUCCESS')
      })
      .catch(() => setStatus('FAILED'))
  }, [])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
        padding: '20px 16px 80px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontWeight: 300, marginBottom: 20 }}>Menu</h1>

      {status === 'LOADING' && <p style={{ color: theme.text.tertiary }}>Loading menu...</p>}
      {status === 'FAILED' && <p style={{ color: theme.color.error }}>Failed to load menu. Please try again.</p>}
      {status === 'SUCCESS' && categories.length === 0 && (
        <p style={{ color: theme.text.tertiary }}>No items available right now.</p>
      )}

      {categories.map((category) => (
        <div key={category._id} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12, borderBottom: `1px solid ${theme.background.tertiary}`, paddingBottom: 8 }}>
            {localize(category.name)}
          </h2>

          {(!category.products || category.products.length === 0) ? (
            <p style={{ color: theme.text.tertiary, fontSize: 13 }}>No items in this category.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 12,
              }}
            >
              {category.products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    background: theme.background.secondary,
                    borderRadius: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      paddingTop: '75%',
                      position: 'relative',
                      background: theme.background.tertiary,
                    }}
                  >
                    {product.profile?.filename && (
                      <img
                        src={`${process.env.REACT_APP_API_UPLOADS}${product.profile.filename}`}
                        alt={localize(product.name)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{localize(product.name)}</div>
                    <div style={{ fontSize: 13, color: theme.color.info }}>
                      {product.price?.toFixed(2)} {product.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
