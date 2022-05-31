import AdminBreadcrumbs from "../components/Breadcrumbs"
import Container from "components/shared/Container"
import MenuList from "@mui/material/MenuList"
import { AlertDialog } from "components/shared/table/AlertDialog"
import { Button } from "@mui/material"
import { ITableColumn, StickyTable } from "components/shared/table/StickyTable"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { selectListRole, getListRole } from "./redux"
import { ReactElement, useEffect, useState } from "react"
import { UpdateButton, DeleteButton, ViewButton } from "components/shared/table/ActionButton"
import { DeviceOptions } from "contexts/web/interface"
import { MenuDialog } from "components/shared/MenuDialog"
import { SearchField } from "components/shared/table/SearchField"
import useLanguage from "hooks/useLanguage"
import useAuth from "hooks/useAuth"
import Axios from "constants/functions/Axios"
import useNotify from "hooks/useNotify"
import useWeb from "hooks/useWeb"

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

export const Roles = () => {
  const dispatch = useAppDispatch()
  const { data: roles, status } = useAppSelector(selectListRole)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { loadify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='role' title='Table' />
        <SearchField name='search' />
        <Button onClick={() => navigate("/admin/role/create")}>Create</Button>
      </>
    )
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: "DELETE",
      url: `/admin/role/disable/${id}`,
    })
    loadify(response)
    response.then(() => setRowData(rowData.filter((role) => role.id !== id)))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== "INIT") return
    dispatch(getListRole())
  }, [dispatch, status])

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
    <Container header={<Header />}>
      <AlertDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      ></AlertDialog>
      {status === "SUCCESS" && (
        <StickyTable columns={columnData} rows={rowData} />
      )}
    </Container>
  )
}

export { CreateRole } from "./Create"
export { UpdateRole } from "./Update"
export { DetailRole } from "./Detail"
