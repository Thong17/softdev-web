import { useAppDispatch, useAppSelector } from 'app/hooks'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { getDetailProduct, selectDetailProduct } from 'modules/organize/product/redux'
import { useEffect } from 'react'

export const ProductForm = ({
  dialog,
  setDialog,
}: any) => {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectDetailProduct)

  useEffect(() => {
    if (!dialog.productId) return

    dispatch(getDetailProduct({ id: dialog.productId }))
  }, [dispatch, dialog.productId])
  
  console.log(data);
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false, productId: null })
  }
  
  return (
    <AlertContainer
      justify='start'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div style={{ width: 'calc(100vw - 552px)', height: '100vh' }}>

      </div>
    </AlertContainer>
  )
}
