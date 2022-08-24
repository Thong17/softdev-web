import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomCustomerContainer } from 'styles'
import { RankStatus } from '../RankStatus'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getListBrand, getListCategory, getListCustomer, selectListCustomer } from 'shared/redux'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { CircularProgress, MenuItem, Skeleton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import { debounce } from 'utils'
import { MiniSearchField } from '../table/SearchField'
import { MiniFilterButton } from '../table/FilterButton'
import { SortIcon } from 'components/shared/icons/SortIcon'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded'
import DiscountIcon from '@mui/icons-material/Discount'
import { IconButton } from '@mui/material'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { CustomerLayout, CustomerItem } from 'components/layouts/CustomerLayout'

export const CustomerStatistic = ({ ...props }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomCustomerContainer device={device} styled={theme} {...props}>
      <LocalPhoneRoundedIcon style={{ marginRight: 5, fontSize: 15 }} />
      <div style={{ display: 'flex', alignItems: 'start', marginRight: 7 }}>
        <p style={{ fontSize: 15 }}>+855 12 345 678</p>
      </div>
      <RankStatus text='250' color={theme.color.info} />
    </CustomCustomerContainer>
  )
}

const mappedCustomer = (data, lang) => {  
  return {
    ...data
  }
}

export const CustomerContainer = ({ onClickCustomer, actions, filterSelected, filterPromotion, selectedCustomers, promotionId, activeId, toggleReload }: any) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(0)
  const { data, count: countCustomer, hasMore: hasMoreCustomer, status } = useAppSelector(selectListCustomer)
  const { theme } = useTheme()
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [selected, setSelected] = useState(false)
  const [promotion, setPromotion] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({ filter: 'createdAt', asc: false })
  const limit = 20

  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
  })

  const handleToggleFavorite = () => {
    if (hasMore) {
      setCustomers([])
      setOffset(0)
    }
    setFavorite(!favorite)
  }

  const handleToggleSelected = () => {
    if (hasMore) {
      setCustomers([])
      setOffset(0)
    }
    setSelected(!selected)
  }

  const handleTogglePromotion = () => {
    if (hasMore) {
      setCustomers([])
      setOffset(0)
    }
    setPromotion(!promotion)
  }

  const handleClickCustomer = (id) => {
    onClickCustomer && onClickCustomer(id)
  }

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    setFilterObj({ filter, asc: sortObj[filter] })
    if (hasMore) {
      setCustomers([])
      setOffset(0)
    }
  }

  const updateQuery = debounce((value) => {
    setSearch(value)
    if (hasMore) {
      setCustomers([])
      setOffset(0)
    }
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const observer: any = useRef()
  const lastCustomerElement = useCallback((node) => {
    if (fetching) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && count && count > offset + limit) {
        setOffset(prevOffset => prevOffset + limit)
      }
    })
    if (node) observer.current.observe(node)
  },[fetching, count, offset])

  useEffect(() => {
    if (customers.length < 1) return
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('limit', limit.toString())
    query.append('offset', offset.toString())
    query.append('filter', filterObj.filter)
    query.append('favorite', favorite ? 'on' : 'off')
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    if (selected && promotionId) query.append('promotion', promotionId)
    Axios({
      method: 'GET',
      url: '/shared/customer/list',
      params: query
    }).then(data => {
      setCustomers(data?.data?.data.map((customer) => mappedCustomer(customer, lang)))
    }).catch(err => {
      notify(err?.response?.data?.msg, 'error')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleReload])
  
  useEffect(() => {
    // Client Side Filtering if all the customers is loaded
    if (!hasMore) {
      const _search = new RegExp(search || '', "i")
      setCustomers(prevData => {
        return prevData.map(data => {
          let obj = data

          if (!_search.test(data.tags)) {
            obj['display'] = 'none'
          } else {
            obj['display'] = 'block'
          }
          
          if (selected && !selectedCustomers?.includes(data.id)) obj['display'] = 'none'
          if (favorite && !user?.favorites?.includes(data.id)) obj['display'] = 'none'
          if (promotion && !data.promotion) obj['display'] = 'none'
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
    query.append('favorite', favorite ? 'on' : 'off')
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    if (selected && promotionId) query.append('promotion', promotionId)
    dispatch(getListCustomer(query))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offset, search, favorite, promotion, filterObj, selected])

  useEffect(() => {
    dispatch(getListBrand())
    dispatch(getListCategory())
  }, [dispatch])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    let unmounted = false
    setHasMore(hasMoreCustomer || false)
    setCount(countCustomer || 0)
    setTimeout(() => {
      if (!unmounted) {
        setCustomers(prevData => [...prevData, ...data.map((customer) => mappedCustomer(customer, lang))])
        setLoading(false)
        setFetching(false)
      }
    }, 300)
    return () => {
      unmounted = true
    }
  }, [status, data, lang, hasMoreCustomer, countCustomer])

  console.log(customers);
  

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
          <ArrowRightRoundedIcon fontSize='large' /><span style={{ fontSize: theme.responsive[device]?.text.primary }}>Customer</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: 'fit-content' }}>
          <MiniSearchField onChange={handleSearch} />
          <MiniFilterButton>
            <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Name</MenuItem>
            <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date</MenuItem>
          </MiniFilterButton>
          <IconButton onClick={handleToggleFavorite} style={{ color: favorite ? theme.color.info : theme.text.secondary, width: 30, height: 30, marginRight: 10 }}><BookmarksRoundedIcon style={{ fontSize: 17 }} /></IconButton>
          {filterSelected && <IconButton onClick={handleToggleSelected} style={{ color: selected ? theme.color.info : theme.text.secondary, width: 30, height: 30, marginRight: 10 }}><DoneAllRoundedIcon fontSize='small' /></IconButton>}
          {filterPromotion && <IconButton onClick={handleTogglePromotion} style={{ color: promotion ? theme.color.info : theme.text.secondary, width: 30, height: 30, marginRight: 10 }}><DiscountIcon style={{ fontSize: 17 }} /></IconButton>}
          {actions}
        </div>
      </div>
      <div style={{ border: theme.border.dashed, borderRadius: theme.radius.quaternary, borderWidth: 2, padding: '0 10px' }}>
        <CustomerLayout>
          {!loading
            ? customers?.map((customer: any, index) => {
                if (customers.length === index + 1) {
                  return <CustomerItem
                    id={customer._id}
                    ref={lastCustomerElement}
                    key={index}
                    name={`${customer.lastName}\u00a0${customer.firstName}`}
                    phone={customer.phone}
                    address={customer.address}
                    action={customer.action}
                    display={customer.dateOfBirth}
                    onClick={() => handleClickCustomer(customer.id)}
                    selected={selectedCustomers?.includes(customer.id)}
                    favorite={user?.favorites?.includes(customer.id)}
                    promotion={customer.promotion}
                    active={customer.id === activeId}
                  />
                }
                return (
                  <CustomerItem
                    id={customer.id}
                    key={index}
                    name={`${customer.lastName}\u00a0${customer.firstName}`}
                    phone={customer.phone}
                    address={customer.address}
                    action={customer.action}
                    display={customer.dateOfBirth}
                    onClick={() => handleClickCustomer(customer.id)}
                    selected={selectedCustomers?.includes(customer.id)}
                    favorite={user?.favorites?.includes(customer.id)}
                    promotion={customer.promotion}
                    active={customer.id === activeId}
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
        </CustomerLayout>
        {fetching && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 10 }}><CircularProgress style={{ width: 30, height: 30 }} /></div>}
      </div>
    </div>
  )
}
