import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import { Layout } from 'components/layouts/Layout'
import { PublicNav } from 'components/shared/PublicNav'
import { SocialNav } from 'components/shared/SocialNav'
import { ProductPriceTag } from 'components/shared/ProductPriceTag'
import { AnnouncementCarousel } from 'components/shared/AnnouncementCarousel'
import { Pagination } from 'components/shared/Pagination'
import { ProductFilterSidebar } from 'components/shared/ProductFilterSidebar'
import { getMenu, getBrands, getProducts, IMenuCategory, IMenuProduct, IPublicBrand, getStoreInfo, IPublicStore, getAnnouncements, IPublicAnnouncement } from 'api/menu.api'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS
const FEATURED_PAGE_SIZE = 8

export const Home = () => {
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { device } = useWeb()
  const [categories, setCategories] = useState<IMenuCategory[]>([])
  const [brands, setBrands] = useState<IPublicBrand[]>([])
  const [store, setStore] = useState<IPublicStore | null>(null)
  const [announcements, setAnnouncements] = useState<IPublicAnnouncement[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<IMenuProduct[]>([])
  const [featuredCount, setFeaturedCount] = useState(0)
  const [featuredPage, setFeaturedPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

  useEffect(() => {
    getMenu().then((res) => setCategories(res.data?.data || [])).catch(() => setCategories([]))
    getBrands().then((res) => setBrands(res.data?.data || [])).catch(() => setBrands([]))
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null))
    getAnnouncements().then((res) => setAnnouncements(res.data?.data || [])).catch(() => setAnnouncements([]))
  }, [])

  useEffect(() => {
    if (store?.name) document.title = store.name
  }, [store])

  useEffect(() => {
    getProducts({
      page: featuredPage,
      limit: FEATURED_PAGE_SIZE,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      minPrice: priceRange?.[0],
      maxPrice: priceRange?.[1],
    })
      .then((res) => {
        setFeaturedProducts(res.data?.data || [])
        setFeaturedCount(res.data?.length || 0)
      })
      .catch(() => setFeaturedProducts([]))
  }, [featuredPage, selectedCategory, selectedBrand, priceRange])

  const changeCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setFeaturedPage(0)
  }

  const changeBrand = (brandId: string | null) => {
    setSelectedBrand(brandId)
    setFeaturedPage(0)
  }

  const changePriceRange = (range: [number, number] | null) => {
    setPriceRange(range)
    setFeaturedPage(0)
  }

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const content = (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
      }}
    >
      {!isAuthenticated && <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} />}
      <SocialNav />

      {/* Hero */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: device === 'mobile' || device === 'tablet' ? '1fr' : '1fr 1fr',
          gap: 40,
          alignItems: 'center',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              background: theme.background.secondary,
              color: theme.text.secondary,
              borderRadius: theme.radius.rounded,
              padding: '6px 16px',
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            {language['HERO_BADGE']}
          </div>
          <h1 style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.15, marginBottom: 16 }}>
            {store?.name ? (
              <>
                {language['WELCOME_TO']}{' '}
                <span style={{ color: theme.color.info }}>{store.name}</span>
              </>
            ) : (
              language['HOMEPAGE_TITLE']
            )}
          </h1>
          <p style={{ color: theme.text.tertiary, maxWidth: 460, marginBottom: 28 }}>
            {language['HOMEPAGE_TAGLINE']}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
                fontWeight: 600,
              }}
            >
              {language['SHOP_NOW']}
            </Link>
            <a
              href='#featured-products'
              style={{
                display: 'inline-block',
                background: theme.background.secondary,
                color: theme.text.primary,
                borderRadius: theme.radius.rounded,
                padding: '12px 28px',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {language['EXPLORE_DEALS']}
            </a>
          </div>
        </div>

        <div style={{ height: 380 }}>
          {announcements.length > 0 ? (
            <AnnouncementCarousel announcements={announcements} height='100%' borderRadius={16} />
          ) : (
            <div
              style={{
                height: '100%',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${theme.background.secondary}, ${theme.background.tertiary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {store?.logo?.filename && (
                <img
                  src={`${IMAGE_HOST}${store.logo.filename}`}
                  alt={store?.name || ''}
                  style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%' }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured products, with filter sidebar */}
      <div
        id='featured-products'
        style={{
          display: 'grid',
          gridTemplateColumns: device === 'mobile' || device === 'tablet' ? '1fr' : '260px 1fr',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 24px 64px',
          scrollMarginTop: 24,
        }}
      >
        <ProductFilterSidebar
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          priceRange={priceRange}
          onChangeCategory={changeCategory}
          onChangeBrand={changeBrand}
          onChangePriceRange={changePriceRange}
        />

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, borderBottom: `1px solid ${theme.background.tertiary}`, paddingBottom: 8 }}>
            {language['FEATURED_PRODUCTS']}
          </h2>
          {featuredProducts.length === 0 ? (
            <p style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['NO_PRODUCTS_AVAILABLE']}</p>
          ) : (
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
                    <img
                      src={`${IMAGE_HOST}${product.profile?.filename || 'default.png'}`}
                      alt={localize(product.name)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{localize(product.name)}</div>
                    <ProductPriceTag product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination page={featuredPage} limit={FEATURED_PAGE_SIZE} totalCount={featuredCount} onChange={setFeaturedPage} />
        </div>
      </div>
    </div>
  )

  return isAuthenticated ? <Layout>{content}</Layout> : content
}
