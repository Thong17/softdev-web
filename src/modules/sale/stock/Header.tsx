import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { HeaderButton } from 'components/shared/table/HeaderButton'
import SaleBreadcrumbs from '../components/Breadcrumbs'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { selectListStock, getListStock } from './redux'
import useLanguage from 'hooks/useLanguage'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  changeLayout,
  isGrid,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const { data, status } = useAppSelector(selectListStock)
  const [stocks, setStocks] = useState<any[]>([])
  const [grid, setGrid] = useState(isGrid)
  const dispatch = useAppDispatch()
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    price: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    const { language } = useLanguage()
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} />{language['BY_NAME']}</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} />{language['BY_DATE']}</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'price' })}><SortIcon asc={sortObj.price} />{language['BY_PRICE']}</MenuItem>
    </>
  }

  useEffect(() => {
    setGrid(isGrid)
  }, [isGrid])

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListStock({}))
  }, [status, dispatch])

  useEffect(() => {
    if (status === 'SUCCESS') {
      const mapStocks = data.map((stock: any) => {
        return {
          _id: stock._id,
          cost: stock.cost,
          currency: stock.currency,
          quantity: stock.quantity,
          remain: stock.remain,
          code: stock.code,
          expireAt: stock.expireAt,
          alertAt: stock.alertAt,
          color: JSON.stringify(stock.color)?.replace(/"/g, '""'),
          product: stock.product,
          options: JSON.stringify(stock.options)?.replace(/"/g, '""'),
        }
      })
      setStocks(mapStocks)
    }
  }, [data, status])

  return (
    <DefaultHeader
      exportData={stocks}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<SaleBreadcrumbs page='stock' />}
      filename='product_stock'
      filterOption={<FilterOption />}
    >
      <HeaderButton
        style={{ marginLeft: 10 }}
        onClick={() => {
          return changeLayout()
        }}
      >
        {!grid ? <GridViewRoundedIcon /> : <ViewListRoundedIcon />}
      </HeaderButton>
    </DefaultHeader>
  )
}
