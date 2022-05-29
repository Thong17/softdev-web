import { CustomPrivilege } from "styles"
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { getPreRole, selectPreRole } from 'modules/admin/role/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from "react"
import { CheckboxField } from "./CheckField"

export const PrivilegeBox = ({ privilegeValue, setPrivilegeValue }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preRole } = useAppSelector(selectPreRole)
  const [checkAll, setCheckAll] = useState({})

  const handleChangePrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    let privilege = privilegeValue
    const [route, action] = names
    privilege[route][action] = checked

    Object.keys(privilege[route]).find(action => !privilege[route][action]) 
      ? setCheckAll({ ...checkAll, [route]: false }) 
      : setCheckAll({ ...checkAll, [route]: true })
    
    return setPrivilegeValue(privilege)
  }

  const handleChangeAllPrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    let privilege = privilegeValue
    const [route] = names
    Object.keys(preRole[route]).forEach((action) => {
      privilege[route][action] = checked
    })
    setCheckAll({ ...checkAll, [route]: checked })
    return setPrivilegeValue(privilege)
  }

  useEffect(() => {
    dispatch(getPreRole())
  }, [dispatch])

  return <CustomPrivilege styled={theme} device={device}>
    <span className='label'>Privilege</span>
    {Object.keys(preRole).map((role, i) => {
      return <div key={i} className='privilege-container'>
        <CheckboxField label={role} name={role} defaultChecked={checkAll[role] || false} onChange={handleChangeAllPrivilege} />
        <div>
          {
            Object.keys(preRole[role]).map((action, j) => {
              return <CheckboxField key={j} label={action} name={`${role}.${action}`} defaultChecked={privilegeValue?.[role]?.[action]} onChange={handleChangePrivilege} />
            })
          }
        </div>
      </div>
    })}
  </CustomPrivilege>
}