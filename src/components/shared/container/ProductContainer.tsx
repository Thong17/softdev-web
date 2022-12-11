import useTheme from 'hooks/useTheme'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getListBrand,
  getListCategory,
  getListProduct,
  selectListBrand,
  selectListCategory,
  selectListProduct,
} from 'shared/redux'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { CircularProgress, MenuItem, Skeleton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import { calculateDay, currencyFormat, debounce } from 'utils'
import { MiniSelectField } from '../form'
import useWeb from 'hooks/useWeb'
import { MiniSearchField } from '../table/SearchField'
import { MiniFilterButton } from '../table/FilterButton'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { IOptions } from '../form/SelectField'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded'
import DiscountIcon from '@mui/icons-material/Discount'
import { IconButton } from '@mui/material'
import { QuantityStatus } from '../QuantityStatus'
import useAuth from 'hooks/useAuth'
import { CircleIcon } from '../table/CustomIcon'

const mappedProduct = (data, lang, rate) => {
  let stock = 0
  let alertAt = 0
  let expireAt: any = null
  data.stocks?.forEach((item) => {
    if (item.expireAt) {
      const stockExpire = calculateDay(new Date(item.expireAt), Date.now())
      if (expireAt && stockExpire < expireAt) expireAt = stockExpire
      else expireAt = stockExpire
    }
    stock += item.quantity
    alertAt += item.alertAt
  })
  const buyRate = rate || 4000

  return {
    id: data?._id,
    name: data?.name?.[lang] || data?.name?.['English'],
    profile: data?.profile?.filename,
    status: data?.status,
    priceTag: currencyFormat(data?.price, data?.currency),
    price: data?.currency === 'USD' ? data?.price : data?.price / buyRate,
    tags: data?.tags,
    createdAt: data?.createdAt,
    brand: data?.brand?._id,
    category: data?.category?._id,
    stock,
    alertAt,
    promotion: data?.promotion,
    isStock: data.isStock,
    expireAt
  }
}

export const ProductContainer = ({
  onClickProduct,
  actions,
  filterSelected,
  filterPromotion,
  selectedProducts,
  promotionId,
  activeId,
  toggleReload,
  updateStocks,
  isDisabled,
}: any) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(0)
  const {
    data,
    count: countProduct,
    hasMore: hasMoreProduct,
    status,
  } = useAppSelector(selectListProduct)
  const { data: listBrand, status: brandStatus } =
    useAppSelector(selectListBrand)
  const { data: listCategory, status: categoryStatus } =
    useAppSelector(selectListCategory)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang, language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [selected, setSelected] = useState(false)
  const [promotion, setPromotion] = useState(false)
  const [disabled, setDisabled] = useState(isDisabled)
  const [brandOption, setBrandOption] = useState<IOptions[]>([
    {
      value: 'all',
      label: 'Brand',
    },
  ])
  const [categoryOption, setCategoryOption] = useState<IOptions[]>([
    {
      value: 'all',
      label: 'Category',
    },
  ])
  const [brand, setBrand] = useState<any>('all')
  const [category, setCategory] = useState<any>('all')
  const [favorite, setFavorite] = useState(false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({
    filter: 'createdAt',
    asc: false,
  })
  const limit = 30

  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    price: false
  })

  useEffect(() => {
    if (!updateStocks) return
    const { productId, totalAllStock: stock } = updateStocks
    setProducts(prev => prev.map(data => data.id === productId ? { ...data, stock } : data))
  }, [updateStocks])  

  useEffect(() => {
    setDisabled(isDisabled)
  }, [isDisabled])

  const handleToggleFavorite = () => {
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
    setFavorite(!favorite)
  }

  const handleToggleSelected = () => {
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
    setSelected(!selected)
  }

  const handleTogglePromotion = () => {
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
    setPromotion(!promotion)
  }

  const handleClickProduct = (id) => {
    onClickProduct && onClickProduct(id)
  }

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    setFilterObj({ filter, asc: sortObj[filter] })
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
  }

  const handleChangeOption = (value, field) => {
    if (field === 'brand') {
      setBrand(value)
    }
    if (field === 'category') {
      setCategory(value)
    }
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
  }

  const updateQuery = debounce((value) => {
    if (hasMore) {
      setProducts([])
      setOffset(0)
    }
    setSearch(value)
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const observer: any = useRef()
  const lastProductElement = useCallback(
    (node) => {
      if (fetching) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && count && count > offset + limit) {
          setOffset((prevOffset) => prevOffset + limit)
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetching, count, offset]
  )

  useEffect(() => {    
    if (products.length < 1) return
    setHasMore(true)
    setProducts([])
    setOffset(0)
    setFetching(true)
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('limit', limit.toString())
    query.append('offset', offset.toString())
    query.append('filter', filterObj.filter)
    query.append('brand', brand)
    query.append('category', category)
    query.append('favorite', favorite ? 'on' : 'off')
    query.append('promotions', promotion ? 'on' : 'off')
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    if (selected && promotionId) query.append('promotion', promotionId)
    dispatch(getListProduct(query))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleReload])

  useEffect(() => {
    if (brandStatus !== 'SUCCESS') return
    const mappedOption = listBrand.map((brand) => ({
      value: brand._id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircleIcon width={23} height={23} icon={brand.icon?.filename} />
          <span style={{ marginLeft: 10 }}>
            {brand.name[lang] || brand.name['English']}
          </span>
        </div>
      ),
      tags: brand.tags,
    }))
    setBrandOption([{ label: 'Brand', value: 'all' }, ...mappedOption])
  }, [listBrand, brandStatus, lang])

  useEffect(() => {
    if (categoryStatus !== 'SUCCESS') return
    const mappedOption = listCategory.map((brand) => ({
      value: brand._id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircleIcon width={23} height={23} icon={brand.icon?.filename} />
          <span style={{ marginLeft: 10 }}>
            {brand.name[lang] || brand.name['English']}
          </span>
        </div>
      ),
      tags: brand.tags,
    }))
    setCategoryOption([{ label: 'Category', value: 'all' }, ...mappedOption])
  }, [listCategory, categoryStatus, lang])

  useEffect(() => {
    // Client Side Filtering if all the products is loaded
    if (!hasMore) {
      const _search = new RegExp(search || '', 'i')
      setProducts((prevData) => {
        return prevData
          .map((data) => {
            let obj = data            
            if (!_search.test(data.tags)) {
              obj['display'] = 'none'
            } else {
              obj['display'] = 'block'
            }

            if (brand !== 'all' && brand !== data.brand) obj['display'] = 'none'
            if (category !== 'all' && category !== data.category)
              obj['display'] = 'none'

            if (selected && !selectedProducts?.includes(data.id))
              obj['display'] = 'none'
            if (favorite && !user?.favorites?.includes(data.id))
              obj['display'] = 'none'
            if (promotion && !data.promotion) obj['display'] = 'none'
            return obj
          })
          .sort((a, b) => {
            if (!filterObj.asc) {
              if (b[filterObj.filter] < a[filterObj.filter]) return -1
              if (b[filterObj.filter] > a[filterObj.filter]) return 1
              return 0
            } else {
              if (a[filterObj.filter] < b[filterObj.filter]) return -1
              if (a[filterObj.filter] > b[filterObj.filter]) return 1
              return 0
            }
          })
      })

      return
    }
    setFetching(true)
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('limit', limit.toString())
    query.append('offset', offset.toString())
    query.append('filter', filterObj.filter)
    query.append('brand', brand)
    query.append('category', category)
    query.append('favorite', favorite ? 'on' : 'off')
    query.append('promotions', promotion ? 'on' : 'off')
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    if (selected && promotionId) query.append('promotion', promotionId)
    dispatch(getListProduct(query))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    offset,
    search,
    favorite,
    promotion,
    filterObj,
    brand,
    category,
    selected,
  ])

  useEffect(() => {
    dispatch(getListBrand())
    dispatch(getListCategory())
  }, [dispatch])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    let unmounted = false
    setHasMore(hasMoreProduct || false)
    setCount(countProduct || 0)
    setTimeout(() => {
      if (!unmounted) {
        setProducts((prevData) => [
          ...prevData,
          ...data.map((product) => mappedProduct(product, lang, user?.drawer?.buyRate)),
        ])
        setLoading(false)
        setFetching(false)
      }
    }, 300)
    return () => {
      unmounted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data, lang, hasMoreProduct, countProduct])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: theme.responsive[device]?.text.h4,
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowRightRoundedIcon fontSize='large' />
          <span style={{ fontSize: theme.responsive[device]?.text.primary }}>
            {language['PRODUCT']}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          <MiniSearchField onChange={handleSearch} />
          <MiniFilterButton>
            <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}>
              <SortIcon asc={sortObj.name} /> {language['BY_NAME']}
            </MenuItem>
            <MenuItem
              onClick={() => handleChangeFilter({ filter: 'createdAt' })}
            >
              <SortIcon asc={sortObj.createdAt} /> {language['BY_DATE']}
            </MenuItem>
            <MenuItem
              onClick={() => handleChangeFilter({ filter: 'price' })}
            >
              <SortIcon asc={sortObj.price} /> {language['BY_PRICE']}
            </MenuItem>
          </MiniFilterButton>
          <span style={{ width: 10 }}></span>
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={brandOption}
            value={brand}
            search={true}
            onChange={(event) =>
              handleChangeOption(event.target.value, 'brand')
            }
          />
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={categoryOption}
            value={category}
            search={true}
            onChange={(event) =>
              handleChangeOption(event.target.value, 'category')
            }
          />
          <IconButton
            onClick={handleToggleFavorite}
            style={{
              color: favorite ? theme.color.info : theme.text.secondary,
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          >
            <BookmarksRoundedIcon style={{ fontSize: 17 }} />
          </IconButton>
          {filterSelected && (
            <IconButton
              onClick={handleToggleSelected}
              style={{
                color: selected ? theme.color.info : theme.text.secondary,
                width: 30,
                height: 30,
                marginRight: 10,
              }}
            >
              <DoneAllRoundedIcon fontSize='small' />
            </IconButton>
          )}
          {filterPromotion && (
            <IconButton
              onClick={handleTogglePromotion}
              style={{
                color: promotion ? theme.color.info : theme.text.secondary,
                width: 30,
                height: 30,
                marginRight: 10,
              }}
            >
              <DiscountIcon style={{ fontSize: 17 }} />
            </IconButton>
          )}
          {actions}
        </div>
      </div>
      <div
        style={{
          border: theme.border.dashed,
          borderRadius: theme.radius.quaternary,
          borderWidth: 2,
          padding: '0 10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {disabled && (
          <div
            style={{
              backgroundColor: `${theme.background.primary}cc`,
              zIndex: 100,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          ></div>
        )}
        <GridLayout>
          {!loading
            ? products?.map((product: any, index) => {
                if (products.length === index + 1) {
                  return (
                    <GridItem
                      id={product.id}
                      ref={lastProductElement}
                      key={index}
                      title={product.name}
                      picture={product.profile}
                      subLeft={product.priceTag}
                      subRight={
                        product.isStock ? (
                          <QuantityStatus
                            qty={product.stock}
                            min={product.alertAt}
                          />
                        ) : (
                          <span style={{ color: theme.color.success }}>{language['AVAILABLE']}</span>
                        )
                      }
                      action={product.action}
                      display={product.display}
                      onClick={() => handleClickProduct(product.id)}
                      selected={selectedProducts?.includes(product.id)}
                      favorite={user?.favorites?.includes(product.id)}
                      promotion={product.promotion}
                      active={product.id === activeId}
                      expireAt={product.expireAt}
                    />
                  )
                }
                return (
                  <GridItem
                    id={product.id}
                    key={index}
                    title={product.name}
                    picture={product.profile}
                    subLeft={product.priceTag}
                    subRight={
                      product.isStock ? (
                        <QuantityStatus
                          qty={product.stock}
                          min={product.alertAt}
                        />
                      ) : (
                        <span style={{ color: theme.color.success }}>{language['AVAILABLE']}</span>
                      )
                    }
                    action={product.action}
                    display={product.display}
                    onClick={() => handleClickProduct(product.id)}
                    selected={selectedProducts?.includes(product.id)}
                    favorite={user?.favorites?.includes(product.id)}
                    promotion={product.promotion}
                    active={product.id === activeId}
                    expireAt={product.expireAt}
                  />
                )
              })
            : Array.apply(null, Array(25)).map((index, key) => {
                return (
                  <div key={key}>
                    <Skeleton
                      variant='rectangular'
                      height={130}
                      width={150}
                      style={{ borderRadius: theme.radius.secondary }}
                    />
                    <div
                      className='content'
                      style={{ padding: '7px 0', boxSizing: 'border-box' }}
                    >
                      <Skeleton
                        variant='rectangular'
                        height={30}
                        width='100%'
                        style={{ borderRadius: theme.radius.secondary }}
                      />
                      <Skeleton
                        variant='text'
                        height={30}
                        width={70}
                        style={{ borderRadius: theme.radius.secondary }}
                      />
                    </div>
                  </div>
                )
              })}
        </GridLayout>
        {fetching && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: 10,
            }}
          >
            <CircularProgress style={{ width: 30, height: 30 }} />
          </div>
        )}
      </div>
    </div>
  )
}
