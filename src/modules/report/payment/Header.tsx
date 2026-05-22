import Breadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'
import { FilterButton } from 'components/shared/table/FilterButton'
import { SearchField } from 'components/shared/table/SearchField'
import useTheme from 'hooks/useTheme'
import { CustomButton } from 'styles/index'
import useAuth from 'hooks/useAuth'
import { ClearPaymentDialog } from './ClearPaymentDialog'


export const Header = ({ handleSearch, handleFilter, queryParams }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { user } = useAuth()
  
  const [sortObj, setSortObj] = useState({
    description: false,
    createdAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return (
      <>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'description' })}>
          <SortIcon asc={sortObj.description} />
          {language['BY_DESCRIPTION']}
        </MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}>
          <SortIcon asc={sortObj.createdAt} />
          {language['BY_DATE']}
        </MenuItem>
      </>
    )
  }

  const [paymentDialog, setPaymentDialog] = useState<any>({
      open: false,
  })

  const handleClearPayment = () => {
    setPaymentDialog({ ...paymentDialog, open: true })
  }

  return (
    <>
      <Breadcrumbs page='payment' />
      <ClearPaymentDialog 
        theme={theme}
        dialog={paymentDialog}
        setDialog={setPaymentDialog} 
        queryParams={queryParams}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={handleSearch} />
        <FilterButton style={{ marginLeft: 10 }}>
          <FilterOption />
        </FilterButton>
        {
        (user?.isDefault && user?.privilege?.payment?.delete) 
          && <CustomButton onClick={handleClearPayment} styled={theme} style={{
            marginLeft: 10,
            backgroundColor: `${theme.color.error}22`,
            color: theme.color.error,
          }}>
            {language['CLEAR_PAYMENT']}
          </CustomButton>
        }
      </div>
    </>
  )
}
