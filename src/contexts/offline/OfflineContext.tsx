import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { IPendingCustomer, listPending, onPendingChange, resetStaleSyncing } from 'shared/offline/db'
import { ISyncResult, syncCustomers } from 'shared/offline/syncCustomers'

const PING_EVERY = 20 * 1000
const AUTO_SYNC_EVERY = 60 * 1000
const LAST_SYNCED_KEY = 'offline-last-synced-at'

interface IOfflineContext {
  // The API can be reached: the browser is online and the server answers
  online: boolean
  pending: IPendingCustomer[]
  syncing: boolean
  lastSyncedAt: string | null
  // The last sync stopped because the login expired
  authExpired: boolean
  sync: (clientIds?: string[]) => Promise<ISyncResult | null>
  // A request failed with no response: show offline until the next ping
  reportOffline: () => void
}

export const OfflineContext = createContext<IOfflineContext>({
  online: true,
  pending: [],
  syncing: false,
  lastSyncedAt: null,
  authExpired: false,
  sync: () => Promise.resolve(null),
  reportOffline: () => {},
})

// navigator.onLine is true on Wi-Fi or mobile data with no internet, so the
// API is also pinged. Any answer, even an error page, means it's reachable.
const pingApi = async () => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/`, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: controller.signal })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

const summary = (result: ISyncResult) => {
  const parts: string[] = []
  if (result.synced) parts.push(`${result.synced} synced`)
  if (result.conflict) parts.push(`${result.conflict} name conflict${result.conflict > 1 ? 's' : ''}`)
  if (result.invalid) parts.push(`${result.invalid} invalid`)
  if (result.failed) parts.push(`${result.failed} failed`)
  return parts.join(', ')
}

const OfflineProvider = ({ children }) => {
  const { user } = useAuth()
  const { notify } = useNotify()
  const userId: string | undefined = user?.id
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine)
  const [reachable, setReachable] = useState(true)
  const [pending, setPending] = useState<IPendingCustomer[]>([])
  const [syncing, setSyncing] = useState(false)
  const [authExpired, setAuthExpired] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(localStorage.getItem(LAST_SYNCED_KEY))
  const online = browserOnline && reachable
  const syncingRef = useRef(false)

  const checkReachable = useCallback(async () => {
    if (!navigator.onLine) return setReachable(false)
    setReachable(await pingApi())
  }, [])

  useEffect(() => {
    const handleOnline = () => { setBrowserOnline(true); checkReachable() }
    const handleOffline = () => setBrowserOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    checkReachable()
    const timer = setInterval(checkReachable, PING_EVERY)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(timer)
    }
  }, [checkReachable])

  const loadPending = useCallback(async () => {
    if (!userId) return setPending([])
    try {
      setPending(await listPending(userId))
    } catch {
      setPending([])
    }
  }, [userId])

  useEffect(() => {
    if (userId) resetStaleSyncing(userId).catch(() => {})
  }, [userId])

  useEffect(() => {
    loadPending()
    return onPendingChange(loadPending)
  }, [loadPending])

  const sync = useCallback(async (clientIds?: string[], manual = true) => {
    if (!userId || syncingRef.current) return null
    syncingRef.current = true
    setSyncing(true)
    try {
      const result = await syncCustomers(userId, clientIds)
      setAuthExpired(result.authExpired)
      if (result.offline) setReachable(false)
      if (result.synced || result.conflict || result.invalid || result.failed) {
        const now = new Date().toISOString()
        localStorage.setItem(LAST_SYNCED_KEY, now)
        setLastSyncedAt(now)
      }
      const text = summary(result)
      if (result.authExpired) notify('Your login has expired. Log in again to sync offline customers', 'error')
      else if (result.offline && manual) notify(`Connection lost${text ? `: ${text}` : ''}. The rest will sync when you're back online`, 'warning')
      else if (text) notify(`Offline customers: ${text}`, result.conflict || result.invalid || result.failed ? 'warning' : 'success')
      else if (manual) notify('Nothing to sync', 'info')
      return result
    } catch (err: any) {
      if (manual) notify(err?.message || 'Sync failed', 'error')
      return null
    } finally {
      syncingRef.current = false
      setSyncing(false)
    }
  }, [userId, notify])

  // Automatic sync: when the connection comes back, on start, and every
  // minute while some customers are waiting. "Sync now" covers the rest.
  const waiting = pending.filter((record) => record.status === 'pending' || record.status === 'failed' || record.status === 'syncing').length
  useEffect(() => {
    if (!online || !waiting || authExpired) return
    sync(undefined, false)
    const timer = setInterval(() => sync(undefined, false), AUTO_SYNC_EVERY)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, waiting > 0, authExpired, userId])

  // A new login clears the expired state
  useEffect(() => { setAuthExpired(false) }, [userId])

  const reportOffline = useCallback(() => setReachable(false), [])

  return (
    <OfflineContext.Provider value={{ online, pending, syncing, lastSyncedAt, authExpired, sync: (clientIds) => sync(clientIds, true), reportOffline }}>
      {children}
    </OfflineContext.Provider>
  )
}

export default OfflineProvider
