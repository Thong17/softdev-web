import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { PublicNav } from 'components/shared/PublicNav'
import { SocialNav } from 'components/shared/SocialNav'
import { ProductPriceTag } from 'components/shared/ProductPriceTag'
import { getMenu, getBrands, IMenuCategory, IMenuProduct, IPublicBrand, getStoreInfo, IPublicStore } from 'api/menu.api'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS

export const Home = () => {
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const [categories, setCategories] = useState<IMenuCategory[]>([])
  const [brands, setBrands] = useState<IPublicBrand[]>([])
  const [store, setStore] = useState<IPublicStore | null>(null)

  useEffect(() => {
    getMenu().then((res) => setCategories(res.data?.data || [])).catch(() => setCategories([]))
    getBrands().then((res) => setBrands(res.data?.data || [])).catch(() => setBrands([]))
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null))
  }, [])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const featuredProducts: IMenuProduct[] = categories
    .flatMap((category) => category.products || [])
    .slice(0, 8)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
      }}
    >
      <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} />
      <SocialNav />

      {/* Hero */}
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 300, fontSize: 32, marginBottom: 16 }}>
          {store?.name ? `${language['WELCOME_TO']} ${store.name}` : language['HOMEPAGE_TITLE']}
        </h1>
        <p style={{ color: theme.text.tertiary, maxWidth: 560, margin: '0 auto 28px' }}>
          {language['HOMEPAGE_TAGLINE']}
        </p>
        <Link
          to='/menu'
          style={{
            display: 'inline-block',
            background: theme.color.info,
            color: theme.background.secondary,
            borderRadius: theme.radius.rounded,
            padding: '12px 28px',
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          {language['VIEW_CATALOG']}
        </Link>
      </div>

      {/* Categories */}
      <div style={{ padding: '20px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, borderBottom: `1px solid ${theme.background.tertiary}`, paddingBottom: 8 }}>
          {language['OUR_CATEGORIES']}
        </h2>
        {categories.length === 0 ? (
          <p style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['NO_CATEGORIES_AVAILABLE']}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {categories.map((category) => (
              <Link
                key={category._id}
                to='/menu'
                style={{
                  background: theme.background.secondary,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: theme.text.primary,
                }}
              >
                {category.icon?.filename && (
                  <img
                    src={`${IMAGE_HOST}${category.icon.filename}`}
                    alt={localize(category.name)}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', marginBottom: 8 }}
                  />
                )}
                <div style={{ fontSize: 14 }}>{localize(category.name)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div style={{ padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, borderBottom: `1px solid ${theme.background.tertiary}`, paddingBottom: 8 }}>
          {language['OUR_BRANDS']}
        </h2>
        {brands.length === 0 ? (
          <p style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['NO_BRANDS_AVAILABLE']}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {brands.map((brand) => (
              <div
                key={brand._id}
                style={{
                  background: theme.background.secondary,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                }}
              >
                {brand.icon?.filename && (
                  <img
                    src={`${IMAGE_HOST}${brand.icon.filename}`}
                    alt={localize(brand.name)}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', marginBottom: 8 }}
                  />
                )}
                <div style={{ fontSize: 14 }}>{localize(brand.name)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <div style={{ padding: '0 24px 64px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, borderBottom: `1px solid ${theme.background.tertiary}`, paddingBottom: 8 }}>
            {language['FEATURED_PRODUCTS']}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {featuredProducts.map((product) => (
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
                <div style={{ width: '100%', paddingTop: '75%', position: 'relative', background: theme.background.tertiary }}>
                  {product.profile?.filename && (
                    <img
                      src={`${IMAGE_HOST}${product.profile.filename}`}
                      alt={localize(product.name)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>{localize(product.name)}</div>
                  <ProductPriceTag product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
