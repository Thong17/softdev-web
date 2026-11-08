import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PublicNav, PublicNavbarLinks } from 'components/shared/PublicNav'
import { Layout } from 'components/layouts/Layout'
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

  const page = <Outlet context={{ store } as IPublicLayoutContext} />

  // Signed-in users keep the admin sidebar, with the public pages' links in the
  // top bar like any other section
  if (isAuthenticated) return <Layout navbar={<PublicNavbarLinks />}>{page}</Layout>

  return (
    <>
      <PublicNav storeName={store?.name} storeLogo={store?.logo?.filename} storeAddress={store?.address} storeLoading={storeLoading} />
      {page}
    </>
  )
}
