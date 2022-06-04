import AdminBreadcrumbs from '../components/Breadcrumbs'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import { CustomButton } from 'styles'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import { MenuList } from '@mui/material'
import { headerColumns } from './constant'

export const Header = ({
    data,
    styled,
    navigate,
    handleSearch,
    handleImport,
  }) => {
    const [users, setUsers] = useState([])
  
    useEffect(() => {
      const newUsers = data.map((user) => {
        return { 
          username: user.username, 
          email: user.email, 
          role: user.role._id }
      })
      setUsers(newUsers)
    }, [data])
  
    return (
      <>
        <AdminBreadcrumbs page='user' title='Table' />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchField onChange={handleSearch} />
          <FilterButton style={{ marginLeft: 10 }}>
            <MenuList>Sort By Name</MenuList>
            <MenuList>Sort By Date</MenuList>
          </FilterButton>
          <OptionButton style={{ marginLeft: 10 }}>
            <MenuList>
              <label htmlFor='file-upload' style={{ cursor: 'pointer' }}>
                Import Data
              </label>
              <input
                id='file-upload'
                type='file'
                onChange={handleImport}
                style={{ display: 'none' }}
                accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              />
            </MenuList>
            <MenuList>
              <CSVLink headers={headerColumns} data={users} filename={`Users_${new Date().toDateString()}.csv`} style={{
                color: styled.text.secondary,
                textDecoration: 'none'
              }}>
                Export Data
              </CSVLink>
            </MenuList>
            <MenuList>
              <CSVLink headers={headerColumns} data={[]} filename={`Template_${new Date().toDateString()}.csv`} style={{
                color: styled.text.secondary,
                textDecoration: 'none'
              }}>
                Download Template
              </CSVLink>
            </MenuList>
          </OptionButton>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: styled.background.secondary,
              color: styled.text.secondary,
            }}
            styled={styled}
            onClick={() => navigate('/admin/user/create')}
          >
            Create
          </CustomButton>
        </div>
      </>
    )
  }