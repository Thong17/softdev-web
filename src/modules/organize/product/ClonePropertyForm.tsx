import { CustomButton, CustomPrivilege } from 'styles'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Axios from 'constants/functions/Axios';
import React, { useEffect, useState } from 'react';
import { CheckboxField } from 'components/shared/form/CheckField'
import useWeb from 'hooks/useWeb'

export const ClonePropertyForm = ({
  dialog,
  setDialog,
  theme,
}: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const { device } = useWeb()
  const [selections, setSelections] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    Axios({
      method: 'GET',
      url: `/organize/product/property/list`
    }).then((response) => {
        const data = response.data?.data || []
        setProducts(data);
        const mapSelections = {}
        const properties = data.flatMap(item => item.properties)
        properties.forEach(item => {
            mapSelections[item._id] = {}
            item.options?.forEach(opt => {
                mapSelections[item._id][opt._id] = false
            })
        });
        setSelections(mapSelections)
    }).catch(console.error)
  }, []);
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

    const getPropertyValues = (id) => {
        const values = Object.values(selections?.[`${id}`] ?? {})
        return values
    }
  
  return (
      <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
          <DialogTitle
              title='Clone Property Form'
              onClose={handleCloseDialog}
          />
          <div
              style={{
                  width: '80vw',
                  padding: '10px 20px 20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
              }}
          >
              {/* Render products using CustomPrivilege and CheckboxField styling */}
              {products.map((product) => (
                  <CustomPrivilege
                      key={product._id}
                      styled={theme}
                      device={device}
                  >
                      <span className='label'>
                          {product.product_name?.English || 'Product'}
                      </span>
                      <br />
                      {(product.properties || []).map((prop: any) => {
                          const values = getPropertyValues(prop._id)
                          const allTrue = values.length > 0 && values.every((v) => v === true)
                          const someTrue = values.some((v) => v === true) && !allTrue

                          return (
                              <div key={prop._id} className='privilege-container'>
                                  <CheckboxField
                                      label={prop.name?.English}
                                      name={prop._id}
                                      checked={allTrue}
                                      indeterminate={someTrue}
                                      onChange={(e) => {
                                          const checked = e.target.checked
                                          const pId = prop._id
                                          setSelections((prev) => {
                                              const nextMap: Record<
                                                  string,
                                                  boolean
                                              > = {}
                                              ;(prop.options || []).forEach(
                                                  (o: any) => {
                                                      nextMap[o._id] = checked
                                                  },
                                              )
                                              const next = {
                                                  ...prev,
                                                  [pId]: nextMap,
                                              }
                                              return next
                                          })
                                      }}
                                  />
                                  <div>
                                      {(prop.options || []).map(
                                          (opt: any, idx: number) => (
                                              <CheckboxField
                                                  key={opt._id || idx}
                                                  label={`${opt.name?.English}${opt.price ? ` (+${opt.price}${opt.currency || ''})` : ''}`}
                                                  name={`${prop._id}.${opt._id}`}
                                                  checked={
                                                      !!selections[prop._id]?.[
                                                          opt._id
                                                      ]
                                                  }
                                                  onChange={(e) => {
                                                      const checked =
                                                          e.target.checked
                                                      const names = (
                                                          e.target.name || ''
                                                      ).split('.')
                                                      const [pId, oId] = names
                                                      setSelections((prev) => {
                                                          const prevMap =
                                                              prev[pId] || {}
                                                          const nextMap = {
                                                              ...prevMap,
                                                              [oId]: checked,
                                                          }
                                                          const next = {
                                                              ...prev,
                                                              [pId]: nextMap,
                                                          }
                                                          return next
                                                      })
                                                  }}
                                              />
                                          ),
                                      )}
                                  </div>
                              </div>
                          )
                      })}
                  </CustomPrivilege>
              ))}
              <div
                  style={{
                      gridArea: 'action',
                      display: 'flex',
                      justifyContent: 'end',
                  }}
              >
                  <CustomButton
                      onClick={handleCloseDialog}
                      styled={theme}
                      style={{
                          backgroundColor: `${theme.color.error}22`,
                          color: theme.color.error,
                      }}
                  >
                      Cancel
                  </CustomButton>
                  <CustomButton
                      type='submit'
                      style={{
                          marginLeft: 10,
                          backgroundColor: `${theme.color.info}22`,
                          color: theme.color.info,
                      }}
                      styled={theme}
                      autoFocus
                  >
                      Clone
                  </CustomButton>
              </div>
          </div>
      </AlertDialog>
  )
}
