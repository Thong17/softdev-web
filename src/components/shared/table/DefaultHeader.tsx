import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import { MenuItem } from '@mui/material'
import { CustomButton } from 'styles'
import { CSVLink } from 'react-csv'
import useLanguage from 'hooks/useLanguage'

export const DefaultHeader = ({ exportComponent, importComponent, downloadComponent, exportData, styled, navigate, handleSearch, handleImport, breadcrumb, filename, createUrl, excelHeader, filterOption, children }: any) => {    
  const { language } = useLanguage()
  return (
      <>
        {breadcrumb}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchField onChange={handleSearch} />
          {children}
          <FilterButton style={{ marginLeft: 10 }}>
            {filterOption}
          </FilterButton>
          <OptionButton style={{ marginLeft: 10 }}>
            {
              importComponent
                ? importComponent
                : <MenuItem>
                  <label htmlFor='file-upload' style={{ cursor: 'pointer' }}>
                    {language['IMPORT_DATA']}
                  </label>
                  <input
                    id='file-upload'
                    type='file'
                    onChange={handleImport}
                    style={{ display: 'none' }}
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  />
                </MenuItem>
            }
            {
              exportComponent 
                ? exportComponent 
                : excelHeader && <MenuItem>
                  <CSVLink headers={excelHeader} data={exportData} filename={`${filename}_${new Date().toDateString()}.csv`} style={{
                    color: styled.text.secondary,
                    textDecoration: 'none'
                  }}>
                    {language['EXPORT_DATA']}
                  </CSVLink>
                </MenuItem>
            }
            {
              downloadComponent 
                ? downloadComponent
                : excelHeader && <MenuItem>
                  <CSVLink headers={excelHeader} data={[]} filename={`${filename}_template.csv`} style={{
                    color: styled.text.secondary,
                    textDecoration: 'none'
                  }}>
                    {language['DOWNLOAD_TEMPLATE']}
                  </CSVLink>
                </MenuItem>
            }
          </OptionButton>
          { createUrl && <CustomButton
              style={{
                marginLeft: 10,
                backgroundColor: styled.background.secondary,
                color: styled.text.secondary,
              }}
              styled={styled}
              onClick={() => navigate(createUrl)}
            >
              {language['CREATE']}
            </CustomButton>
          }
        </div>
      </>
    )
  }
