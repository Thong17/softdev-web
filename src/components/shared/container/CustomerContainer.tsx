import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomCustomerContainer } from 'styles'
import { RankStatus } from '../RankStatus'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getListBrand,
  getListCategory,
  getListCustomer,
  selectListCustomer,
} from 'shared/redux'
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
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { CustomerLayout, CustomerItem } from 'components/layouts/CustomerLayout'
import useAlert from 'hooks/useAlert'

export const CustomerStatistic = ({ phone, point = 0, ...props }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  
  return (
    <CustomCustomerContainer device={device} styled={theme} {...props}>
      <RankStatus text={typeof point === 'string' ? parseInt(point) : point.toFixed(0)} color={theme.color.info} />
      <div style={{ display: 'flex', alignItems: 'start', marginLeft: 7 }}>
        <p style={{ fontSize: 15 }}>{phone}</p>
      </div>
    </CustomCustomerContainer>
  )
}

const mappedCustomer = (data) => {
  return {
    ...data,
  }
}

export const CustomerContainer = ({
  onClickCustomer,
  onEditCustomer,
  actions,
  filterSelected,
  filterPromotion,
  promotionId,
  toggleReload,
  height,
}: any) => {
  const dispatch = useAppDispatch()
  const [count, setCount] = useState(0)
  const {
    data,
    count: countCustomer,
    hasMore: hasMoreCustomer,
    status,
  } = useAppSelector(selectListCustomer)
  const { theme } = useTheme()
  const confirm = useAlert()
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang, language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [selected, setSelected] = useState(false)
  const [promotion, setPromotion] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({
    filter: 'createdAt',
    asc: false,
  })
  const limit = 20

  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
  })

  const handleToggleFavorite = () => {
    setCustomers([])
    setOffset(0)
    setFavorite(!favorite)
  }

  const handleToggleSelected = () => {
    setCustomers([])
    setOffset(0)
    setSelected(!selected)
  }

  const handleTogglePromotion = () => {
    setCustomers([])
    setOffset(0)
    setPromotion(!promotion)
  }

  const handleClickCustomer = (data) => {
    onClickCustomer && onClickCustomer(data)
  }

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    setFilterObj({ filter, asc: sortObj[filter] })
    setCustomers([])
    setOffset(0)
  }

  const updateQuery = debounce((value) => {
    setSearch(value)
    setCustomers([])
    setOffset(0)
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const observer: any = useRef()
  const lastCustomerElement = useCallback(
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
  }, [dispatch, offset, search, favorite, promotionId, filterObj, selected])

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
        setCustomers((prevData) => [
          ...prevData,
          ...data.map((customer) => mappedCustomer(customer)),
        ])
        setLoading(false)
        setFetching(false)
      }
    }, 300)
    return () => {
      unmounted = true
    }
  }, [status, data, lang, countCustomer, hasMoreCustomer])

  useEffect(() => {
    if (customers.length < 1 && hasMore) return
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('limit', limit.toString())
    query.append('offset', '0')
    query.append('filter', filterObj.filter)
    query.append('favorite', favorite ? 'on' : 'off')
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    if (selected && promotionId) query.append('promotion', promotionId)

    Axios({
      method: 'GET',
      url: '/shared/customer/list',
      params: query,
    })
      .then((data) => {
        setCustomers(
          data?.data?.data.map((customer) => mappedCustomer(customer))
        )
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleReload])

  const handleEditCustomer = (id) => {
    const customer = customers.find(item => item._id === id)
    onEditCustomer(customer)
  }

  const handleDeleteCustomer = (id) => {
    confirm({
      title: language['CONFIRM_DELETE_CUSTOMER'],
      description: language['DESCRIPTION_DELETE_CUSTOMER'],
      variant: 'error'
    })
      .then(() => {
        Axios({
          url: `/organize/customer/disable/${id}`,
          method: 'DELETE',
        }).then(data => {
          notify(data?.data?.msg, 'success')
          setCustomers(prev => prev.filter(item => item._id !== id))
        }).catch(err => notify(err?.response?.data?.msg, 'error'))
      })
      .catch(() => {})
  }

  return (
    <div
      style={{ height: '100%', boxSizing: 'border-box', position: 'relative' }}
    >
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
            {language['CUSTOMER']}
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
          </MiniFilterButton>
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
          position: 'relative',
          height: 'calc(100% - 40px)',
          border: theme.border.dashed,
          borderRadius: theme.radius.quaternary,
          borderWidth: 2,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            height: height,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          <CustomerLayout>
            {!loading
              ? customers?.map((customer: any, index) => {
                  if (customers.length === index + 1) {
                    return (
                      <CustomerItem
                        id={customer._id}
                        ref={lastCustomerElement}
                        key={index}
                        name={customer.displayName}
                        contact={customer.contact}
                        address={customer.address}
                        display={customer.display}
                        point={customer.point}
                        onClick={() =>
                          handleClickCustomer({
                            id: customer._id,
                            displayName: customer.displayName,
                            point: customer.point?.toFixed(0),
                          })
                        }
                        onEdit={handleEditCustomer}
                        onDelete={handleDeleteCustomer}
                        picture={customer.picture?.filename}
                      />
                    )
                  }
                  return (
                    <CustomerItem
                      id={customer._id}
                      key={index}
                      name={customer.displayName}
                      contact={customer.contact}
                      address={customer.address}
                      display={customer.display}
                      point={customer.point}
                      onClick={() =>
                        handleClickCustomer({
                          id: customer._id,
                          displayName: customer.displayName,
                          point: customer.point?.toFixed(0),
                        })
                      }
                      onEdit={handleEditCustomer}
                      onDelete={handleDeleteCustomer}
                      picture={customer.picture?.filename}
                    />
                  )
                })
              : Array.apply(null, Array(5)).map((index, key) => {
                  return (
                    <div key={key}>
                      <Skeleton
                        variant='rectangular'
                        height={30}
                        width={100}
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
    </div>
  )
}
