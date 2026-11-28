import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Customers added with no connection, kept in the browser until the sync
// saves them. A record is removed once the server has it.
export type PendingStatus = 'pending' | 'syncing' | 'conflict' | 'invalid' | 'failed'

export interface IPendingCustomer {
  // Made on this device; the server uses it to tell a retry from a new customer
  clientId: string
  // Only the user who added a customer syncs it
  ownerUserId: string
  // The form's values, as the create endpoint takes them
  body: any
  photo?: Blob | null
  photoName?: string
  // The photo's id once uploaded, so a retry doesn't upload it again
  pictureId?: string | null
  status: PendingStatus
  // What the server said about a conflict or invalid record
  message?: string
  errors?: { key: string, path: string }[]
  conflictWith?: { id: string, displayName: string, fullName?: string, contact?: string, isDeleted?: boolean } | null
  capturedAt: string
  updatedAt: string
  attempts: number
}

interface OfflineDB extends DBSchema {
  pendingCustomers: {
    key: string
    value: IPendingCustomer
    indexes: { byOwner: string }
  }
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>('softdev-offline', 1, {
      upgrade(db) {
        const store = db.createObjectStore('pendingCustomers', { keyPath: 'clientId' })
        store.createIndex('byOwner', 'ownerUserId')
      },
    })
    // Ask the browser not to clear this data when space runs low
    navigator.storage?.persist?.().catch(() => {})
  }
  return dbPromise
}

// Lets the list, the navbar and the sync see each change at once, in this
// tab and in the user's other tabs
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('softdev-offline') : null
const listeners = new Set<() => void>()
const emit = () => {
  listeners.forEach((listener) => listener())
  channel?.postMessage('changed')
}
if (channel) channel.onmessage = () => listeners.forEach((listener) => listener())

export const onPendingChange = (listener: () => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export const newClientId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Older browsers: a random version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export const listPending = async (ownerUserId: string) => {
  const db = await getDB()
  const records = await db.getAllFromIndex('pendingCustomers', 'byOwner', ownerUserId)
  return records.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt))
}

export const getPending = async (clientId: string) => (await getDB()).get('pendingCustomers', clientId)

export const savePending = async (record: IPendingCustomer) => {
  const db = await getDB()
  await db.put('pendingCustomers', { ...record, updatedAt: new Date().toISOString() })
  emit()
}

export const updatePending = async (clientId: string, changes: Partial<IPendingCustomer>) => {
  const db = await getDB()
  const record = await db.get('pendingCustomers', clientId)
  if (!record) return
  await db.put('pendingCustomers', { ...record, ...changes, updatedAt: new Date().toISOString() })
  emit()
}

// A sync cut off by a closed tab or reload leaves records 'syncing': they
// go back in the queue when the app opens
export const resetStaleSyncing = async (ownerUserId: string) => {
  const db = await getDB()
  const records = await db.getAllFromIndex('pendingCustomers', 'byOwner', ownerUserId)
  const stale = records.filter((record) => record.status === 'syncing')
  for (const record of stale) await db.put('pendingCustomers', { ...record, status: 'pending' })
  if (stale.length) emit()
}

export const removePending = async (clientId: string) => {
  const db = await getDB()
  await db.delete('pendingCustomers', clientId)
  emit()
}
