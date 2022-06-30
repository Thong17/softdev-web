import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { HeaderButton } from 'components/shared/table/HeaderButton'
import SaleBreadcrumbs from '../components/Breadcrumbs'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { selectListStock, getListStock } from './redux'

export const Header = ({
  changeLayout,
  isGrid,
  styled,
  navigate,
  handleSearch,
  handleImport,
}) => {
  const { data, status } = useAppSelector(selectListStock)
  const [stocks, setStocks] = useState<any[]>([])
  const [grid, setGrid] = useState(isGrid)
  const dispatch = useAppDispatch()

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
