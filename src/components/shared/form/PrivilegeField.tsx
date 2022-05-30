import { CustomPrivilege } from "styles"
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { FC, useEffect, useState } from "react"
import { CheckboxField } from "./CheckField"

interface IPrivilegeField {
  preValue: Object,
  value: Object,
  returnValue: (value) => void,
  isReadOnly?: boolean
}

export const PrivilegeField: FC<IPrivilegeField> = ({ preValue, value, returnValue, isReadOnly }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [checkAll, setCheckAll] = useState({})
  const [privilege, setPrivilege] = useState({ ...preValue, ...value })

  const handleChangePrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [route, action] = names

    const newPrivilege = Object.assign({}, { ...privilege, [route]: { ...privilege[route], [action]: checked } })
    
    Object.keys(newPrivilege[route]).find(action => !newPrivilege[route][action]) 
      ? setCheckAll({ ...checkAll, [route]: false }) 
      : setCheckAll({ ...checkAll, [route]: true })
    setPrivilege(newPrivilege)
    return returnValue(newPrivilege)
  }

  const handleChangeAllPrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [route] = names
    let newPrivilege = Object.assign({}, privilege)

    Object.keys(preValue[route]).forEach((action) => {
      newPrivilege = {
        ...newPrivilege,
        [route]: {
          ...newPrivilege[route],
          [action]: checked
        }
      }
    })
    setCheckAll({ ...checkAll, [route]: checked })
    setPrivilege(newPrivilege)
    return returnValue(newPrivilege)
  }

  useEffect(() => {
      // Check Parent if all value is checked
    let checkedAll = {}
    Object.keys(privilege).forEach((route) => {
      Object.keys(privilege[route]).find(action => !privilege[route][action]) 
        ? checkedAll = { ...checkedAll, [route]: false }
        : checkedAll = { ...checkedAll, [route]: true }
    })

    setCheckAll(checkedAll)
  }, [privilege])

  return <CustomPrivilege styled={theme} device={device}>
    <span className='label'>Privilege</span>
    {Object.keys(preValue).map((role, i) => {
      return <div key={i} className='privilege-container'>
        <CheckboxField readOnly={isReadOnly} label={role} name={role} defaultChecked={checkAll[role] || false} onChange={handleChangeAllPrivilege} />
        <div>
          {
            Object.keys(preValue[role]).map((action, j) => {
              return <CheckboxField readOnly={isReadOnly} key={j} label={action} name={`${role}.${action}`} defaultChecked={privilege?.[role]?.[action]} onChange={handleChangePrivilege} />
            })
          }
        </div>
      </div>
    })}
  </CustomPrivilege>
}