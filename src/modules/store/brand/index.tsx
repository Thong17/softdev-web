import Container from 'components/shared/Container'
import React, { ReactElement, useEffect, useState } from 'react'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { StickyTable } from 'components/shared/table/StickyTable'
import { ITableColumn } from 'components/shared/table/StickyTable'
import Button from 'components/shared/Button'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListBrand, selectListBrand } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import Axios from 'constants/functions/Axios'
import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import { DeleteButton, UpdateButton, ViewButton } from 'components/shared/table/ActionButton'
import { MenuList } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { IThemeStyle } from 'contexts/theme/interface'

const Header = () => {
  const navigate = useNavigate()
    return <><StoreBreadcrumbs page='brand' /><Button onClick={() => navigate('/store/brand/create')}>Create</Button></>
}

declare type ColumnHeader = 'icon' | 'name' | 'status' | 'description' | 'createdBy' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'icon', label: 'Icon' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action', align: 'center' },
]
interface Data {
  id: string
  icon: string
  name: string
  description: string
  createdBy: string
  status: ReactElement
  action: ReactElement
}

const createData = (
  id: string,
  icon: string,
  name: string,
  description: string,
  createdBy: string,
  status: boolean,
  privilege: any,
  device: DeviceOptions,
  theme: IThemeStyle,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: "right" }}>
      {device === "mobile" ? (
        privilege?.brand?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/store/brand/update/${id}`)}
            >
              Edit
            </MenuList>
            <MenuList
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuList>
            <MenuList
              component='div'
              onClick={() => navigate(`/store/brand/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.brand?.update && (
            <UpdateButton
              onClick={() => navigate(`/store/brand/update/${id}`)}
            />
          )}
          {privilege?.brand?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )
  
  const brandStatus = status ? <span style={{ color: theme.color.success }}>Enabled</span> : <span style={{ color: theme.color.error }}>Disabled</span>

  return { id, icon, name, description, createdBy, status: brandStatus, action }
}

export const Brands = () => {
  const dispatch = useAppDispatch()
  const { data: categories, status } = useAppSelector(selectListBrand)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  
  const handleConfirm = (id) => {
    const response = Axios({
      method: "DELETE",
      url: `/store/brand/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListBrand()))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== "INIT") return
    dispatch(getListBrand())
  }, [dispatch, status])

  useEffect(() => {
    const listCategories = categories.map((brand: any) => {
      return createData(
        brand._id,
        brand.icon,
        brand.name?.[lang] || brand.name?.["English"],
        brand.description || "...",
        brand.createdBy || "...",
        brand.status,
        user?.privilege,
        device,
        theme,
        navigate,
        setDialog
      )
    })
    setRowData(listCategories)
  }, [categories, lang, user, device, theme, navigate])

  return (
    <Container header={<Header />}>
      <AlertDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      ></AlertDialog>
      <StickyTable columns={columnData} rows={rowData} />
    </Container>
  )
}

export { CreateBrand } from './Create'
export { UpdateBrand } from './Update'
export { DetailBrand } from './Detail'
