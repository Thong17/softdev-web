import { useEffect, useState } from 'react'
import { Skeleton, Slider } from '@mui/material'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { IMenuCategory, IPublicBrand, getProductPriceRange } from 'api/menu.api'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS

interface IProductFilterSidebar {
  categories: IMenuCategory[]
  categoriesLoading?: boolean
  brands: IPublicBrand[]
  brandsLoading?: boolean
  selectedCategory: string | null
  selectedBrand: string | null
  priceRange: [number, number] | null
  onChangeCategory: (categoryId: string | null) => void
  onChangeBrand: (brandId: string | null) => void
  onChangePriceRange: (range: [number, number] | null) => void
}

export const ProductFilterSidebar = ({
  categories,
  categoriesLoading = false,
  brands,
  brandsLoading = false,
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
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [priceRangeLoading, setPriceRangeLoading] = useState(true)

  const VISIBLE_LIMIT = 5

  useEffect(() => {
    getProductPriceRange()
      .then((res) => {
        const min = res.data?.data?.min || 0
        const max = res.data?.data?.max || 0
        setBounds([min, max])
        setDraft(priceRange || [min, max])
      })
      .catch(() => {})
      .finally(() => setPriceRangeLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    textAlign: 'left' as const,
    background: 'transparent',
    border: 'none',
    borderRadius: theme.radius.rounded,
    cursor: 'pointer',
    padding: '6px 10px',
    fontSize: 13,
    fontWeight: 400,
    color: theme.text.secondary,
  }

  const fadeInLeftStyle = (index: number) => ({
    opacity: 0,
    animation: `fadeInLeft 0.4s ease-out ${Math.min(index * 0.06, 0.6)}s forwards`,
  })

  const iconSlot = (filename: string | undefined, alt: string) => {
    const size = 30
    return (
      <img
        src={`${IMAGE_HOST}${filename || 'default.png'}`}
        alt={alt}
        style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
      />
    )
  }

  const checkSlot = (active: boolean) =>
    active && <DoneAllRoundedIcon style={{ fontSize: 18, color: theme.color.info, marginLeft: 'auto', flexShrink: 0 }} />

  const skeletonListItems = (count: number) =>
    Array.apply(null, Array(count)).map((_, index) => (
      <div key={index} style={{ ...listItemStyle, cursor: 'default' }}>
        <Skeleton variant='circular' width={30} height={30} />
        <Skeleton variant='text' width='60%' height={20} />
      </div>
    ))

  const showAllButton = (expanded: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 10px',
        fontSize: 12,
        color: theme.color.info,
      }}
    >
      {expanded ? language['SHOW_LESS'] : language['SHOW_ALL']}
    </button>
  )

  return (
    <div
      style={{
        background: theme.background.secondary,
        boxShadow: theme.shadow.container,
        borderRadius: 12,
        padding: 20,
        height: 'fit-content',
      }}
    >
      {/* Price range */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{language['PRICE']}</div>
        {priceRangeLoading ? (
          <>
            <Skeleton variant='rectangular' height={6} width='100%' style={{ borderRadius: theme.radius.rounded }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Skeleton variant='text' width={40} height={16} />
              <Skeleton variant='text' width={40} height={16} />
            </div>
          </>
        ) : bounds[1] > bounds[0] ? (
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
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{language['OUR_BRANDS']}</div>
        {brandsLoading ? (
          skeletonListItems(VISIBLE_LIMIT)
        ) : brands.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.text.tertiary }}>{language['NO_BRANDS_AVAILABLE']}</div>
        ) : (
          <>
            <button style={{ ...listItemStyle, ...fadeInLeftStyle(0) }} onClick={() => onChangeBrand(null)}>
              {iconSlot(undefined, language['ALL'])}
              {language['ALL']}
              {checkSlot(!selectedBrand)}
            </button>
            {(showAllBrands ? brands : brands.slice(0, VISIBLE_LIMIT)).map((brand, index) => (
              <button
                key={brand._id}
                style={{ ...listItemStyle, ...fadeInLeftStyle(index + 1) }}
                onClick={() => onChangeBrand(selectedBrand === brand._id ? null : brand._id)}
              >
                {iconSlot(brand.icon?.filename, localize(brand.name))}
                {localize(brand.name)}
                {checkSlot(selectedBrand === brand._id)}
              </button>
            ))}
            {brands.length > VISIBLE_LIMIT && showAllButton(showAllBrands, () => setShowAllBrands(!showAllBrands))}
          </>
        )}
      </div>

      {/* Categories */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{language['OUR_CATEGORIES']}</div>
        {categoriesLoading ? (
          skeletonListItems(VISIBLE_LIMIT)
        ) : categories.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.text.tertiary }}>{language['NO_CATEGORIES_AVAILABLE']}</div>
        ) : (
          <>
            <button style={{ ...listItemStyle, ...fadeInLeftStyle(0) }} onClick={() => onChangeCategory(null)}>
              {iconSlot(undefined, language['ALL'])}
              {language['ALL']}
              {checkSlot(!selectedCategory)}
            </button>
            {(showAllCategories ? categories : categories.slice(0, VISIBLE_LIMIT)).map((category, index) => (
              <button
                key={category._id}
                style={{ ...listItemStyle, ...fadeInLeftStyle(index + 1) }}
                onClick={() => onChangeCategory(selectedCategory === category._id ? null : category._id)}
              >
                {iconSlot(category.icon?.filename, localize(category.name))}
                {localize(category.name)}
                {checkSlot(selectedCategory === category._id)}
              </button>
            ))}
            {categories.length > VISIBLE_LIMIT && showAllButton(showAllCategories, () => setShowAllCategories(!showAllCategories))}
          </>
        )}
      </div>
    </div>
  )
}
