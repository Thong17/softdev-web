import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import { MenuList } from '@mui/material'
import { CustomButton } from 'styles'
import { CSVLink } from 'react-csv'

export const DefaultHeader = ({ importData, styled, navigate, handleSearch, handleImport, breadcrumb, filename, createUrl, excelHeader, children }: any) => {    
    return (
      <>
        {breadcrumb}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchField onChange={handleSearch} />
          {children}
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
              <CSVLink headers={excelHeader} data={importData} filename={`${filename}_${new Date().toDateString()}.csv`} style={{
                color: styled.text.secondary,
                textDecoration: 'none'
              }}>
                Export Data
              </CSVLink>
            </MenuList>
            <MenuList>
              <CSVLink headers={excelHeader} data={[]} filename={`${filename}_template.csv`} style={{
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
            onClick={() => navigate(createUrl)}
          >
            Create
          </CustomButton>
        </div>
      </>
    )
  }
