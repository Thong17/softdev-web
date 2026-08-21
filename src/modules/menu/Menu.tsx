import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { getMenu, getStoreInfo, getProducts, IMenuCategory, IMenuProduct, IPublicStore } from 'api/menu.api'
import { PublicNav } from 'components/shared/PublicNav'
import { ProductPriceTag } from 'components/shared/ProductPriceTag'
import { Pagination } from 'components/shared/Pagination'

const PAGE_SIZE = 12

export const Menu = () => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [categories, setCategories] = useState<IMenuCategory[]>([])
  const [store, setStore] = useState<IPublicStore | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<IMenuProduct[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE')

  useEffect(() => {
    getMenu().then((res) => setCategories(res.data?.data || [])).catch(() => setCategories([]))
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null))
  }, [])

  useEffect(() => {
    setStatus('LOADING')
    getProducts({ page, limit: PAGE_SIZE, category: selectedCategory || undefined })
      .then((res) => {
        setProducts(res.data?.data || [])
        setTotalCount(res.data?.length || 0)
        setStatus('SUCCESS')
      })
      .catch(() => setStatus('FAILED'))
  }, [page, selectedCategory])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const selectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setPage(0)
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
      <div style={{ padding: '20px 16px 80px' }}>
        <h1 style={{ fontWeight: 300, marginBottom: 20 }}>Menu</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => selectCategory(null)}
            style={{
              border: 'none',
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
              background: !selectedCategory ? theme.color.info : theme.background.secondary,
              color: !selectedCategory ? theme.background.secondary : theme.text.primary,
            }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => selectCategory(category._id)}
              style={{
                border: 'none',
                borderRadius: 16,
                padding: '6px 14px',
                fontSize: 13,
                cursor: 'pointer',
                background: selectedCategory === category._id ? theme.color.info : theme.background.secondary,
                color: selectedCategory === category._id ? theme.background.secondary : theme.text.primary,
              }}
            >
              {localize(category.name)}
            </button>
          ))}
        </div>

        {status === 'LOADING' && <p style={{ color: theme.text.tertiary }}>Loading products...</p>}
        {status === 'FAILED' && <p style={{ color: theme.color.error }}>Failed to load products. Please try again.</p>}
        {status === 'SUCCESS' && products.length === 0 && (
          <p style={{ color: theme.text.tertiary }}>No items available right now.</p>
        )}

        {products.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
            }}
          >
            {products.map((product) => (
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
                  <ProductPriceTag product={product} />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} limit={PAGE_SIZE} totalCount={totalCount} onChange={setPage} />
      </div>
    </div>
  )
}
