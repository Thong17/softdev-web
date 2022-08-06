import useTheme from 'hooks/useTheme'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getListProduct, selectListProduct } from 'shared/redux'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { MenuItem, Skeleton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import { currencyFormat } from 'utils'
import { MiniSelectField } from '../form'
import useWeb from 'hooks/useWeb'
import { MiniSearchField } from '../table/SearchField'
import { MiniFilterButton } from '../table/FilterButton'

const mappedProduct = (data, lang) => {
  const action = <AddRoundedIcon />
  return {
    name: data?.name?.[lang] || data?.name?.['English'],
    profile: data?.profile?.filename,
    action,
    status: data?.status,
    price: currencyFormat(data?.price, data?.currency),
  }
}

const brandOption = [
  {
    value: 'all',
    label: 'Brand'
  }
]

const categoryOption = [
  {
    value: 'all',
    label: 'Category',
  }
]

export const ProductContainer = () => {
  const dispatch = useAppDispatch()
  const { data, hasMore, status } = useAppSelector(selectListProduct)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const limit = 10

  const handleSearch = (value) => {
    console.log(value)
  }

  const observer: any = useRef()
  const lastProductElement = useCallback((node) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + limit)
      }
    })
    if (node) observer.current.observe(node)
  },[hasMore])

  useEffect(() => {
    const query = new URLSearchParams()
    query.append('limit', limit.toString())
    query.append('offset', offset.toString())
    dispatch(getListProduct(query))
  }, [dispatch, offset])

  useEffect(() => {
    if (status !== 'SUCCESS') return

    setProducts(prevData => [...prevData, ...data.map((product) => mappedProduct(product, lang))])
    setTimeout(() => {
      setLoading(false)
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
          <ArrowRightRoundedIcon fontSize='large' /><span style={{ fontSize: theme.responsive[device]?.text.primary }}>Promotion Product</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: 'fit-content' }}>
          <MiniSearchField onChange={handleSearch} />
          <MiniFilterButton>
            <MenuItem>Price</MenuItem>
            <MenuItem>Date</MenuItem>
            <MenuItem>Name</MenuItem>
          </MiniFilterButton>
          <span style={{ width: 10 }}></span>
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={brandOption}
            value='all'
            search={true}
          />
          <MiniSelectField
            style={{ minWidth: 70 }}
            options={categoryOption}
            value='all'
            search={true}
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
      </div>
    </div>
  )
}
