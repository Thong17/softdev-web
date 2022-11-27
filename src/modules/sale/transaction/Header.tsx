import SaleBreadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { IconButton, MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'
import { FilterButton } from 'components/shared/table/FilterButton'
import { SearchField } from 'components/shared/table/SearchField'
import useTheme from 'hooks/useTheme'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { CustomHeaderButton } from 'styles/index'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { useAppDispatch } from 'app/hooks'
import { getListTransaction } from './redux'

export const Header = ({ handleSearch, handleFilter }) => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()
  const dispatch = useAppDispatch()
  
  const [sortObj, setSortObj] = useState({
    description: false,
    createdAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    const { language } = useLanguage()
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

  const handleReverseAll = () => {
    confirm({
      title: 'Are you sure you want to reverse all transaction?',
      description: 'Reverse all transaction will update all stock product.',
      variant: 'error'
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: '/sale/transaction/reverseAll',
        })
          .then(data => {
            notify(data?.data?.msg, 'success')
            dispatch(getListTransaction({}))
          })
          .catch(err => notify(err?.response?.data?.msg))
      })
      .catch()
  }

  return (
    <>
      <SaleBreadcrumbs page='transaction' />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={handleSearch} />
        <FilterButton style={{ marginLeft: 10 }}>
          <FilterOption />
        </FilterButton>
        <CustomHeaderButton onClick={handleReverseAll} styled={theme} style={{ marginLeft: 10 }}>
          <IconButton><RestartAltRoundedIcon /></IconButton>
        </CustomHeaderButton>
      </div>
    </>
  )
}
