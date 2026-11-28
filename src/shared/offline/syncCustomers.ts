import Axios from 'constants/functions/Axios'
import { IPendingCustomer, listPending, removePending, updatePending } from './db'

const BATCH_SIZE = 50

export interface ISyncResult {
  synced: number
  conflict: number
  invalid: number
  failed: number
  // The connection dropped part way; what's left syncs next time
  offline: boolean
  // The login expired; nothing more syncs until the user logs in again
  authExpired: boolean
}

// No response at all: no connection, or the server can't be reached
export const isNetworkError = (err: any) => !!err && !err.response

const isAuthError = (err: any) => err?.response?.status === 401

class SyncStop extends Error {
  constructor(public reason: 'offline' | 'authExpired') { super(reason) }
}

const stopFor = (err: any) => {
  if (isNetworkError(err)) return new SyncStop('offline')
  if (isAuthError(err)) return new SyncStop('authExpired')
  return null
}

const uploadPhoto = async (record: IPendingCustomer) => {
  if (!record.photo || record.pictureId) return record.pictureId || null
  const formData = new FormData()
  formData.append('picture', record.photo, record.photoName || 'customer.jpg')
  const response = await Axios({
    method: 'POST',
    url: '/shared/upload/picture',
    body: formData,
    headers: { 'content-type': 'multipart/form-data' },
  })
  const pictureId = response?.data?.data?._id || null
  // Kept so a retry after a dropped sync doesn't upload the photo twice
  await updatePending(record.clientId, { pictureId })
  return pictureId
}

const toSyncBody = (record: IPendingCustomer, pictureId: string | null) => ({
  ...record.body,
  clientId: record.clientId,
  capturedAt: record.capturedAt,
  ...(pictureId && { picture: pictureId }),
})

let running: Promise<ISyncResult> | null = null

// Sends the user's offline customers to the server. Only one sync runs at a
// time, in this tab and across the user's tabs. Records with a conflict or
// invalid data wait to be fixed, unless `clientIds` names them.
export const syncCustomers = (userId: string, clientIds?: string[]): Promise<ISyncResult> => {
  if (running) return running
  const run = () => syncNow(userId, clientIds)
  const locks = (navigator as any).locks
  running = (locks?.request ? locks.request('softdev-sync-customers', run) : run())
    .finally(() => { running = null })
  return running as Promise<ISyncResult>
}

const syncNow = async (userId: string, clientIds?: string[]): Promise<ISyncResult> => {
  const result: ISyncResult = { synced: 0, conflict: 0, invalid: 0, failed: 0, offline: false, authExpired: false }
  const all = await listPending(userId)
  const records = clientIds
    ? all.filter((record) => clientIds.includes(record.clientId))
    // 'syncing' left over from a sync that was cut off is sent again
    : all.filter((record) => record.status === 'pending' || record.status === 'failed' || record.status === 'syncing')
  if (!records.length) return result

  try {
    for (let start = 0; start < records.length; start += BATCH_SIZE) {
      const batch = records.slice(start, start + BATCH_SIZE)
      const customers: any[] = []
      for (const record of batch) {
        await updatePending(record.clientId, { status: 'syncing' })
        try {
          customers.push(toSyncBody(record, await uploadPhoto(record)))
        } catch (err) {
          const stop = stopFor(err)
          if (stop) throw stop
          const reason = (err as any)?.response?.data?.msg
          await updatePending(record.clientId, { status: 'failed', message: `The photo could not be uploaded${reason ? ` (${reason})` : ''}. Will retry`, attempts: record.attempts + 1 })
          result.failed += 1
        }
      }
      if (!customers.length) continue

      let answers: any[] = []
      try {
        const response = await Axios({ method: 'POST', url: '/organize/customer/sync', body: { customers } })
        answers = response?.data?.data || []
      } catch (err) {
        const stop = stopFor(err)
        if (stop) throw stop
        const message = (err as any)?.response?.data?.msg || 'The server could not save these customers'
        for (const customer of customers) {
          const record = batch.find((item) => item.clientId === customer.clientId)
          await updatePending(customer.clientId, { status: 'failed', message, attempts: (record?.attempts || 0) + 1 })
          result.failed += 1
        }
        continue
      }

      for (const answer of answers) {
        const record = batch.find((item) => item.clientId === answer.clientId)
        if (!record) continue
        switch (answer.status) {
          case 'created':
          case 'exists':
            await removePending(record.clientId)
            result.synced += 1
            break
          case 'conflict':
            await updatePending(record.clientId, { status: 'conflict', message: answer.msg, conflictWith: answer.existing || null, errors: [] })
            result.conflict += 1
            break
          case 'invalid':
            await updatePending(record.clientId, {
              status: 'invalid',
              errors: answer.errors || [],
              message: (answer.errors || []).map((error) => error.path).join(', ') || 'Some details are not valid',
            })
            result.invalid += 1
            break
          default:
            await updatePending(record.clientId, { status: 'failed', message: answer.msg || 'Not saved, will retry', attempts: record.attempts + 1 })
            result.failed += 1
        }
      }
    }
  } catch (err) {
    if (!(err instanceof SyncStop)) throw err
    result[err.reason] = true
    // Whatever wasn't answered goes back in the queue unchanged
    const left = await listPending(userId)
    for (const record of left) {
      if (record.status === 'syncing') await updatePending(record.clientId, { status: 'pending' })
    }
  }
  return result
}
