import { useEffect, useState } from 'react'
import { Slider } from '@mui/material'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { IMenuCategory, IPublicBrand, getProductPriceRange } from 'api/menu.api'

interface IProductFilterSidebar {
  categories: IMenuCategory[]
  brands: IPublicBrand[]
  selectedCategory: string | null
  selectedBrand: string | null
  priceRange: [number, number] | null
  onChangeCategory: (categoryId: string | null) => void
  onChangeBrand: (brandId: string | null) => void
  onChangePriceRange: (range: [number, number] | null) => void
}

export const ProductFilterSidebar = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  onChangeCategory,
  onChangeBrand,
  onChangePriceRange,
}: IProductFilterSidebar) => {
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const [bounds, setBounds] = useState<[number, number]>([0, 0])
  const [draft, setDraft] = useState<[number, number]>([0, 0])

  useEffect(() => {
    getProductPriceRange()
      .then((res) => {
        const min = res.data?.data?.min || 0
        const max = res.data?.data?.max || 0
        setBounds([min, max])
        setDraft(priceRange || [min, max])
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const listItemStyle = (active: boolean) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 0',
    fontSize: 13,
    color: active ? theme.color.info : theme.text.secondary,
    fontWeight: active ? 600 : 400,
  })

  return (
    <div
      style={{
        background: theme.background.secondary,
        border: `1px solid ${theme.background.tertiary}`,
        borderRadius: 12,
        padding: 20,
        height: 'fit-content',
      }}
    >
      {/* Price range */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{language['PRICE']}</div>
        {bounds[1] > bounds[0] ? (
          <>
            <Slider
              value={draft}
              min={bounds[0]}
              max={bounds[1]}
              onChange={(_, value) => setDraft(value as [number, number])}
              onChangeCommitted={(_, value) => onChangePriceRange(value as [number, number])}
              valueLabelDisplay='auto'
              sx={{ color: theme.color.info }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: theme.text.tertiary }}>
              <span>{draft[0].toFixed(2)}</span>
              <span>{draft[1].toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: theme.text.tertiary }}>{language['NO_PRODUCTS_AVAILABLE']}</div>
        )}
      </div>

      {/* Brands */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{language['OUR_BRANDS']}</div>
        {brands.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.text.tertiary }}>{language['NO_BRANDS_AVAILABLE']}</div>
        ) : (
          <>
            <button style={listItemStyle(!selectedBrand)} onClick={() => onChangeBrand(null)}>
              {language['ALL']}
            </button>
            {brands.map((brand) => (
              <button
                key={brand._id}
                style={listItemStyle(selectedBrand === brand._id)}
                onClick={() => onChangeBrand(selectedBrand === brand._id ? null : brand._id)}
              >
                {localize(brand.name)}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Categories */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{language['OUR_CATEGORIES']}</div>
        {categories.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.text.tertiary }}>{language['NO_CATEGORIES_AVAILABLE']}</div>
        ) : (
          <>
            <button style={listItemStyle(!selectedCategory)} onClick={() => onChangeCategory(null)}>
              {language['ALL']}
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                style={listItemStyle(selectedCategory === category._id)}
                onClick={() => onChangeCategory(selectedCategory === category._id ? null : category._id)}
              >
                {localize(category.name)}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
