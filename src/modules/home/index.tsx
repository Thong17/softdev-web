import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import { Layout } from 'components/layouts/Layout'
import { PublicNav } from 'components/shared/PublicNav'
import { SocialNav } from 'components/shared/SocialNav'
import { ProductPriceTag } from 'components/shared/ProductPriceTag'
import { ProductNameClamp } from 'components/shared/ProductNameClamp'
import { PromotionBadge } from 'components/shared/PromotionBadge'
import { AnnouncementCarousel } from 'components/shared/AnnouncementCarousel'
import { Pagination } from 'components/shared/Pagination'
import { ProductFilterSidebar } from 'components/shared/ProductFilterSidebar'
import { getMenu, getBrands, getProducts, IMenuCategory, IMenuProduct, IPublicBrand, getStoreInfo, IPublicStore, getAnnouncements, IPublicAnnouncement } from 'api/menu.api'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS
const FEATURED_PAGE_SIZE = 15

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
  const productCardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = Math.min(Number(el.dataset.index || 0) * 0.05, 0.5)
          el.style.animation = `fadeInUp 0.5s ease-out ${delay}s forwards`
          obs.unobserve(el)
        })
      },
      { threshold: 0.15 }
    )
    productCardRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [featuredProducts])

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
      {!isAuthenticated && <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} storeAddress={store?.address} />}
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
              opacity: 0,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            {language['HERO_BADGE']}
          </div>
          <h1
            style={{
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.15,
              marginBottom: 16,
              opacity: 0,
              animation: 'fadeInUp 0.6s ease-out 0.15s forwards',
            }}
          >
            {store?.name ? (
              <>
                {language['WELCOME_TO']}{' '}
                <span style={{ color: theme.color.info }}>{store.name}</span>
              </>
            ) : (
              language['HOMEPAGE_TITLE']
            )}
          </h1>
          <p
            style={{
              color: theme.text.tertiary,
              maxWidth: 460,
              marginBottom: 28,
              opacity: 0,
              animation: 'fadeInUp 0.6s ease-out 0.3s forwards',
            }}
          >
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
                opacity: 0,
                animation: 'fadeInUp 0.6s ease-out 0.45s forwards',
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
                opacity: 0,
                animation: 'fadeInUp 0.6s ease-out 0.55s forwards',
              }}
            >
              {language['EXPLORE_DEALS']}
            </a>
          </div>
        </div>

        <div style={{ height: 380, opacity: 0, animation: 'fadeInRight 0.6s ease-out 0.2s forwards' }}>
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
        <div style={{ opacity: 0, animation: 'fadeInLeft 0.6s ease-out forwards' }}>
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
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'bottom', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 500 }}>
              {language['FEATURED_PRODUCTS']}
            </h2>
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
              {language['SHOW_ALL']}
            </Link>
          </div>
          {featuredProducts.length === 0 ? (
            <p style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['NO_PRODUCTS_AVAILABLE']}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  ref={(el) => {
                    if (el) productCardRefs.current.set(product._id, el)
                    else productCardRefs.current.delete(product._id)
                  }}
                  data-index={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: 0,
                  }}
                >
                  <div style={{ borderRadius: 8, overflow: 'hidden', width: '100%', paddingTop: '75%', position: 'relative' }}>
                    <img
                      src={`${IMAGE_HOST}${product.profile?.filename || 'default.png'}`}
                      alt={localize(product.name)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <PromotionBadge product={product} />
                  </div>
                  <div style={{ paddingBlock: 10, paddingInline: 4 }}>
                    <ProductNameClamp>{localize(product.name)}</ProductNameClamp>
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
