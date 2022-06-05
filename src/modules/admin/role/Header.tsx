import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import { MenuList } from '@mui/material'
import { CustomButton } from 'styles'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { CSVLink } from 'react-csv'

export const Header = ({ data, styled, navigate, handleSearch, handleImport }) => {
    const [roles, setRoles] = useState([])

    useEffect(() => {
        const newRoles = data.map((role) => {
            return { 
              _id: role._id,
              name: JSON.stringify(role.name).replace(/"/g, '""'), 
              description: role.description, 
              privilege: JSON.stringify(role.privilege).replace(/"/g, '""')
            }
          })
      setRoles(newRoles)
    }, [data])
    
    return (
      <>
        <AdminBreadcrumbs page='role' title='Table' />
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
              <CSVLink headers={headerColumns} data={roles} filename={`Roles_${new Date().toDateString()}.csv`} style={{
                color: styled.text.secondary,
                textDecoration: 'none'
              }}>
                Export Data
              </CSVLink>
            </MenuList>
            <MenuList>
              <CSVLink headers={headerColumns} data={[]} filename={`Template.csv`} style={{
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
            onClick={() => navigate('/admin/role/create')}
          >
            Create
          </CustomButton>
        </div>
      </>
    )
  }