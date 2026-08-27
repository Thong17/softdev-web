import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PublicNav } from 'components/shared/PublicNav'
import { getStoreInfo, IPublicStore } from 'api/menu.api'
import useAuth from 'hooks/useAuth'

export interface IPublicLayoutContext {
  store: IPublicStore | null
}

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth()
  const [store, setStore] = useState<IPublicStore | null>(null)
  const [storeLoading, setStoreLoading] = useState(true)

  useEffect(() => {
    getStoreInfo().then((res) => setStore(res.data?.data || null)).catch(() => setStore(null)).finally(() => setStoreLoading(false))
  }, [])

  return (
    <>
      {!isAuthenticated && (
        <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} storeAddress={store?.address} storeLoading={storeLoading} />
      )}
      <Outlet context={{ store } as IPublicLayoutContext} />
    </>
  )
}
