import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import { getMenu, getBrands, getStoreInfo, getProducts, IMenuCategory, IMenuProduct, IPublicBrand, IPublicStore } from 'api/menu.api'
import { PublicNav } from 'components/shared/PublicNav'
import { SocialNav } from 'components/shared/SocialNav'
import { ProductPriceTag } from 'components/shared/ProductPriceTag'
import { ProductNameClamp } from 'components/shared/ProductNameClamp'
import { PromotionBadge } from 'components/shared/PromotionBadge'
import { Pagination } from 'components/shared/Pagination'
import { ProductFilterSidebar } from 'components/shared/ProductFilterSidebar'
import { IconDropdown } from 'components/shared/IconDropdown'
import { debounce } from 'utils'
import { Skeleton } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SortRoundedIcon from '@mui/icons-material/SortRounded'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS
const PAGE_SIZE = 20

type ISortValue = 'createdAt_desc' | 'price_asc' | 'price_desc'

export const Menu = () => {
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const { device } = useWeb()
  const [categories, setCategories] = useState<IMenuCategory[]>([])
  const [brands, setBrands] = useState<IPublicBrand[]>([])
  const [store, setStore] = useState<IPublicStore | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  const [search, setSearch] = useState('')
  const [sortValue, setSortValue] = useState<ISortValue>('createdAt_desc')
  const [products, setProducts] = useState<IMenuProduct[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE')

  useEffect(() => {
    getMenu().then((res) => setCategories(res.data?.data || [])).catch(() => setCategories([]))
    getBrands().then((res) => setBrands(res.data?.data || [])).catch(() => setBrands([]))
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null))
  }, [])

  useEffect(() => {
    if (store?.name) document.title = `${language['NAV_CATALOG']} - ${store.name}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  const MIN_LOADING_MS = 500

  useEffect(() => {
    const [filter, sort] = sortValue.split('_') as ['createdAt' | 'price', 'asc' | 'desc']
    let cancelled = false
    const startedAt = Date.now()
    setStatus('LOADING')

    const settle = (apply: () => void) => {
      const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt))
      setTimeout(() => {
        if (!cancelled) apply()
      }, wait)
    }

    getProducts({
      page,
      limit: PAGE_SIZE,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      minPrice: priceRange?.[0],
      maxPrice: priceRange?.[1],
      search: search || undefined,
      filter,
      sort,
    })
      .then((res) => {
        settle(() => {
          setProducts(res.data?.data || [])
          setTotalCount(res.data?.length || 0)
          setStatus('SUCCESS')
        })
      })
      .catch(() => settle(() => setStatus('FAILED')))

    return () => {
      cancelled = true
    }
  }, [page, selectedCategory, selectedBrand, priceRange, search, sortValue])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const changeCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setPage(0)
  }

  const changeBrand = (brandId: string | null) => {
    setSelectedBrand(brandId)
    setPage(0)
  }

  const changePriceRange = (range: [number, number] | null) => {
    setPriceRange(range)
    setPage(0)
  }

  const updateSearch = debounce((value: string) => {
    setSearch(value)
    setPage(0)
  }, 300)

  const changeSort = (value: string) => {
    setSortValue(value as ISortValue)
    setPage(0)
  }

  const sortOptions = [
    { value: 'createdAt_desc', label: language['SORT_NEWEST'] },
    { value: 'price_asc', label: language['SORT_PRICE_LOW_HIGH'] },
    { value: 'price_desc', label: language['SORT_PRICE_HIGH_LOW'] },
  ]

  const inputStyle = {
    border: 'none',
    outline: 'none',
    borderRadius: theme.radius.rounded,
    padding: '10px 14px',
    fontSize: 13,
    background: theme.background.secondary,
    color: theme.text.primary,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background.primary,
        color: theme.text.primary,
        fontFamily: theme.font.family,
        boxSizing: 'border-box',
      }}
    >
      <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} />
      <SocialNav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: device === 'mobile' ? '20px 16px 64px' : '32px 24px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <h1 style={{ fontWeight: 300, fontSize: 28, margin: 0 }}>{language['NAV_CATALOG']}</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', height: 38 }}>
              <SearchRoundedIcon
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: theme.text.tertiary }}
              />
              <input
                type='text'
                placeholder={language['TYPE_TO_SEARCH']}
                defaultValue={search}
                onChange={(event) => updateSearch(event.target.value)}
                style={{ ...inputStyle, height: '18px', paddingLeft: 34, minWidth: 200 }}
              />
            </div>
            <div style={{ ...inputStyle, padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
              <IconDropdown
                icon={<SortRoundedIcon fontSize='small' />}
                value={sortValue}
                options={sortOptions}
                onChange={changeSort}
                ariaLabel='sort products'
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: device === 'mobile' || device === 'tablet' ? '1fr' : '260px 1fr', gap: 24 }}>
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
            {status === 'LOADING' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton
                      variant='rectangular'
                      animation='wave'
                      sx={{ bgcolor: 'rgba(0, 0, 0, 0.17)', borderRadius: '8px', width: '100%', paddingTop: '75%' }}
                    />
                    <div style={{ paddingBlock: 10, paddingInline: 4 }}>
                      <Skeleton variant='text' animation='wave' sx={{ bgcolor: 'rgba(0, 0, 0, 0.17)' }} width='80%' height={20} />
                      <Skeleton variant='text' animation='wave' sx={{ bgcolor: 'rgba(0, 0, 0, 0.17)' }} width='40%' height={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {status === 'FAILED' && <p style={{ color: theme.color.error, fontSize: 13 }}>Failed to load products. Please try again.</p>}
            {status === 'SUCCESS' && products.length === 0 && (
              <p style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['NO_PRODUCTS_AVAILABLE']}</p>
            )}

            {status === 'SUCCESS' && products.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {products.map((product) => (
                  <div key={product._id} style={{ display: 'flex', flexDirection: 'column' }}>
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

            <Pagination page={page} limit={PAGE_SIZE} totalCount={totalCount} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
