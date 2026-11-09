import { ReactNode, useEffect, useState } from 'react'
import Axios from 'constants/functions/Axios'

export interface IStoreFeatures {
  labelPrinting: boolean
  tables: boolean
  reservation: boolean
  queue: boolean
}

export type StoreFeature = keyof IStoreFeatures

// Everything on until the store says otherwise, so nothing disappears while
// loading or for stores that never changed the switches
const allOn: IStoreFeatures = { labelPrinting: true, tables: true, reservation: true, queue: true }

// One shared copy for the whole app, loaded once
let current: IStoreFeatures = allOn
let request: Promise<void> | null = null
const listeners = new Set<(features: IStoreFeatures) => void>()

const publish = (features: IStoreFeatures) => {
  current = { ...allOn, ...features }
  listeners.forEach((listener) => listener(current))
}

// Reloads the switches (after Store › Features is saved, or a new sign-in)
export const refreshStoreFeatures = () => {
  request = Axios({ method: 'GET', url: '/shared/store/features' })
    .then((response) => publish(response?.data?.data || allOn))
    // e.g. not signed in yet: try again next time a screen asks
    .catch(() => { request = null })
  return request
}

// Which optional parts of the app this store uses (Store › Features)
const useStoreFeatures = () => {
  const [features, setFeatures] = useState<IStoreFeatures>(current)

  useEffect(() => {
    listeners.add(setFeatures)
    if (!request) refreshStoreFeatures()
    else setFeatures(current)
    return () => {
      listeners.delete(setFeatures)
    }
  }, [])

  return features
}

// Renders its children only while the feature is on
export const FeatureGate = ({ feature, children }: { feature: StoreFeature, children: ReactNode }) => {
  const features = useStoreFeatures()
  return features[feature] ? <>{children}</> : null
}

export default useStoreFeatures
