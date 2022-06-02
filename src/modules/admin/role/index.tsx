import AdminBreadcrumbs from "../components/Breadcrumbs"
import Container from "components/shared/Container"
import MenuList from "@mui/material/MenuList"
import useLanguage from "hooks/useLanguage"
import useAuth from "hooks/useAuth"
import Axios from "constants/functions/Axios"
import useNotify from "hooks/useNotify"
import useWeb from "hooks/useWeb"
import { AlertDialog } from "components/shared/table/AlertDialog"
import { CustomButton } from "styles"
import { ITableColumn, StickyTable } from "components/shared/table/StickyTable"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { selectListRole, getListRole } from "./redux"
import { ReactElement, useEffect, useState } from "react"
import { UpdateButton, DeleteButton, ViewButton } from "components/shared/table/ActionButton"
import { DeviceOptions } from "contexts/web/interface"
import { MenuDialog } from "components/shared/MenuDialog"
import { SearchField } from "components/shared/table/SearchField"
import { FilterButton } from "components/shared/table/FilterButton"
import { OptionButton } from "components/shared/table/OptionButton"
import { debounce } from "utils"
import { useSearchParams } from "react-router-dom"
import useTheme from "hooks/useTheme"

declare type ColumnHeader = "name" | "description" | "createdBy" | "action"

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "createdBy", label: "Created\u00a0By", align: "right" },
  { id: "action", label: "Action", align: "right" },
]
interface Data {
  id: string
  name: string
  description: string
  createdBy: string
  action: ReactElement
}

const createData = (
  id: string,
  name: string,
  description: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: "right" }}>
      {device === "mobile" ? (
        privilege?.role?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/admin/role/update/${id}`)}
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
              onClick={() => navigate(`/admin/role/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.role?.update && (
            <UpdateButton
              onClick={() => navigate(`/admin/role/update/${id}`)}
            />
          )}
          {privilege?.role?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, name, description, createdBy, action: action }
}

const Header = ({ styled, navigate, handleSearch }) => {
  return (
    <>
      <AdminBreadcrumbs page='role' title='Table' />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={handleSearch} />
        <FilterButton style={{ marginLeft: 10 }} />
        <OptionButton style={{ marginLeft: 10 }} />
        <CustomButton style={{ marginLeft: 10, backgroundColor: `${styled.color.info}22`, color: styled.color.info }} styled={styled} onClick={() => navigate("/admin/role/create")}>Create</CustomButton>
      </div>
    </>
  )
}

export const Roles = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loadify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const [rowData, setRowData] = useState<Data[]>([])
  const [queryParams, setQueryParams] = useSearchParams()
  const { data: roles, status } = useAppSelector(selectListRole)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: "DELETE",
      url: `/admin/role/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListRole({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    dispatch(getListRole({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    if (status !== "INIT") return
    dispatch(getListRole({ query: queryParams }))
  }, [dispatch, status, queryParams])

  useEffect(() => {
    const listRoles = roles.map((role: any) => {
      return createData(
        role._id,
        role.name?.[lang] || role.name?.["English"],
        role.description || "...",
        role.createdBy || "...",
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listRoles)
  }, [roles, lang, user, device, navigate])

  return (
    <Container header={<Header styled={theme} navigate={navigate} handleSearch={handleSearch} />}>
      <AlertDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      ></AlertDialog>
      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { CreateRole } from "./Create"
export { UpdateRole } from "./Update"
export { DetailRole } from "./Detail"
