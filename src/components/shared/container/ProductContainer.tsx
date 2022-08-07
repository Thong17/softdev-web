import useTheme from 'hooks/useTheme'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getListBrand, getListCategory, getListProduct, selectListBrand, selectListCategory, selectListProduct } from 'shared/redux'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { CircularProgress, MenuItem, Skeleton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import { currencyFormat, debounce } from 'utils'
import { MiniSelectField } from '../form'
import useWeb from 'hooks/useWeb'
import { MiniSearchField } from '../table/SearchField'
import { MiniFilterButton } from '../table/FilterButton'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { IOptions } from '../form/SelectField'

const mappedProduct = (data, lang) => {
  const action = <AddRoundedIcon />
  return {
    id: data?._id,
    name: data?.name?.[lang] || data?.name?.['English'],
    profile: data?.profile?.filename,
    action,
    status: data?.status,
    price: currencyFormat(data?.price, data?.currency),
    tags: data?.tags,
    createdAt: data?.createdAt,
    brand: data?.brand?._id,
    category: data?.category?._id,
  }
}

export const ProductContainer = () => {
  const dispatch = useAppDispatch()
  const { data, count, status } = useAppSelector(selectListProduct)
  const { data: listBrand, status: brandStatus } = useAppSelector(selectListBrand)
  const { data: listCategory, status: categoryStatus } = useAppSelector(selectListCategory)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [brandOption, setBrandOption] = useState<IOptions[]>([
    {
      value: 'all',
      label: 'Brand'
    }
  ])
  const [categoryOption, setCategoryOption] = useState<IOptions[]>([
    {
      value: 'all',
      label: 'Category',
    }
  ])
  const [brand, setBrand] = useState<any>('all')
  const [category, setCategory] = useState<any>('all')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({ filter: 'createdAt', asc: false })
  const limit = 10

  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    if (count && count > offset + limit) {
      setProducts([])
      setOffset(0)
      return
    }
    
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    setFilterObj({ filter, asc: sortObj[filter] })
  }

  const handleChangeOption = (value, field) => {
    if (count && count > offset + limit) {
      setProducts([])
      setOffset(0)
      return
    }
    if (field === 'brand') {
      setBrand(value)
    }
    if (field === 'category') {
      setCategory(value)
    } 
  }

  const updateQuery = debounce((value) => {
    setSearch(value)
    if (count && count > offset + limit) {
      setProducts([])
      setOffset(0)
      return
    }
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const observer: any = useRef()
  const lastProductElement = useCallback((node) => {
    if (fetching) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && count && count > offset) {
        setOffset(prevOffset => prevOffset + limit)
      }
    })
    if (node) observer.current.observe(node)
  },[fetching, count, offset])

  useEffect(() => {
    dispatch(getListBrand())
    dispatch(getListCategory())
  }, [dispatch])
  
  useEffect(() => {
    if (brandStatus !== 'SUCCESS') return
    const mappedOption = listBrand.map(brand => ({ value: brand._id, label: brand.name[lang] || brand.name['English'], tags: brand.tags }))
    setBrandOption(prevOption => [...prevOption, ...mappedOption])
  }, [listBrand, brandStatus, lang])
  
  useEffect(() => {
    if (categoryStatus !== 'SUCCESS') return
    const mappedOption = listCategory.map(brand => ({ value: brand._id, label: brand.name[lang] || brand.name['English'], tags: brand.tags }))
    setCategoryOption(prevOption => [...prevOption, ...mappedOption])
  }, [listCategory, categoryStatus, lang])
  
  useEffect(() => {
    // Client Side Filtering if all the products is loaded
    if (count && count < offset + limit) {
      const _search = new RegExp(search || '', "i")
      setProducts(prevData => {
        return prevData.map(data => {
          let obj = data

          if (!_search.test(data.tags)) {
            obj['display'] = 'none'
          } else {
            obj['display'] = 'block'
          }

          if (brand !== 'all' && brand !== data.brand) obj['display'] = 'none'
          if (category !== 'all' && category !== data.category) obj['display'] = 'none'

          return obj
        }).sort((a, b) => {
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
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    dispatch(getListProduct(query))
  }, [dispatch, offset, search, filterObj, brand, category, count])

  useEffect(() => {
    if (status !== 'SUCCESS') return

    setTimeout(() => {
      setProducts(prevData => [...prevData, ...data.map((product) => mappedProduct(product, lang))])
      setLoading(false)
      setFetching(false)
    }, 300)
  }, [status, data, lang])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontSize: theme.responsive[device]?.text.h4,
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowRightRoundedIcon fontSize='large' /><span style={{ fontSize: theme.responsive[device]?.text.primary }}>Product</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: 'fit-content' }}>
          <MiniSearchField onChange={handleSearch} />
          <MiniFilterButton>
            <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Name</MenuItem>
            <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date</MenuItem>
          </MiniFilterButton>
          <span style={{ width: 10 }}></span>
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={brandOption}
            value={brand}
            search={true}
            onChange={(event) => handleChangeOption(event.target.value, 'brand')}
          />
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={categoryOption}
            value={category}
            search={true}
            onChange={(event) => handleChangeOption(event.target.value, 'category')}
          />
        </div>
      </div>
      <div style={{ border: theme.border.dashed, borderRadius: theme.radius.primary, borderWidth: 2 }}>
        <GridLayout>
          {!loading
            ? products?.map((product: any, index) => {
                if (products.length === index + 1) {
                  return <GridItem
                    ref={lastProductElement}
                    key={index}
                    title={product.name}
                    picture={product.profile}
                    subLeft={<SellRoundedIcon fontSize='small' />}
                    subRight={product.price}
                    action={product.action}
                    status={product.status}
                    display={product.display}
                  />
                }
                return (
                  <GridItem
                    key={index}
                    title={product.name}
                    picture={product.profile}
                    subLeft={<SellRoundedIcon fontSize='small' />}
                    subRight={product.price}
                    action={product.action}
                    status={product.status}
                    display={product.display}
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
        {fetching && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 10 }}><CircularProgress style={{ width: 30, height: 30 }} /></div>}
      </div>
    </div>
  )
}
