import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import { MenuItem } from '@mui/material'
import { CustomButton } from 'styles'
import useLanguage from 'hooks/useLanguage'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { convertBufferToArrayBuffer, downloadBuffer } from 'utils/index'
import { languages } from 'contexts/language/constant'

export const DefaultHeader = ({ optionAction, exportUrl, styled, navigate, handleSearch, handleImport, breadcrumb, createUrl, filterOption, children }: any) => {    
  const { language } = useLanguage()
  const { notify } = useNotify()
  const handleExport = () => {
    if (!exportUrl) return
    const config = {
      responseType: "arraybuffer",
      body: { languages: Object.keys(languages) },
      headers: {
        Accept: "application/octet-stream",
      },
    }
    Axios({ url: exportUrl, method: 'POST', ...config })
      .then(data => {
        downloadBuffer(convertBufferToArrayBuffer(data?.data?.file?.data), data?.data?.name)
      })
      .catch(err => notify(err?.response?.data?.message, 'error'))
  }

  return (
      <>
        {breadcrumb}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {handleSearch && <SearchField onChange={handleSearch} />}
          {children}
          {filterOption && <FilterButton style={{ marginLeft: 10 }}>
            {filterOption}
          </FilterButton>}
          {optionAction && <OptionButton style={{ marginLeft: 10 }}>
            <MenuItem>
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
            <MenuItem onClick={handleExport}>
              {language['EXPORT_DATA']}
            </MenuItem>
          </OptionButton>}
          { createUrl && <CustomButton
              style={{
                marginLeft: 10,
                backgroundColor: `${styled.color.success}22`,
                color: styled.color.success,
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
