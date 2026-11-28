import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { DetailField, SelectField, TextField } from 'components/shared/form'
import { MapPicker } from 'components/shared/form/MapPicker'
import { QrScanDialog } from 'components/shared/dialog/QrScanDialog'
import { contactFieldLabels, parseContactQr } from 'utils/contactQr'
import { TierPanel } from './TierPanel'
import { Tooltip } from '@mui/material'
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded'
import { Section } from 'components/shared/Section'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useNotify from 'hooks/useNotify'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useOffline from 'hooks/useOffline'
import { IPendingCustomer, listPending, newClientId, savePending } from 'shared/offline/db'
import { isNetworkError } from 'shared/offline/syncCustomers'
import { CustomerPhoto, ICustomerPhoto } from './CustomerPhoto'

const OPTIONS_CACHE_KEY = 'customer-options'

// Suggestions; any other value can be typed
const defaultGroups = ['School', 'Office', 'Shop / Reseller', 'Government', 'Individual']
const defaultSources = ['Walk-in', 'Facebook', 'Telegram', 'Referral', 'Website']

const optionalNumber = yup.number()
  .transform((curr, orig) => (orig === '' || orig === null || orig === undefined ? undefined : curr))
  .typeError('Must be a number')

const schema = yup.object().shape({
  displayName: yup.string().required('Phone number is required'),
  fullName: yup.string().optional(),
  type: yup.string().oneOf(['INDIVIDUAL', 'BUSINESS']).optional(),
  companyName: yup.string().optional(),
  contactPerson: yup.string().optional(),
  taxId: yup.string().optional(),
  contact: yup.string().optional(),
  email: yup.string().email('Invalid email').optional(),
  telegram: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  tierLocked: yup.boolean().optional(),
  tier: yup.string().nullable().optional(),
  discount: optionalNumber.min(0, 'At least 0%').max(100, 'At most 100%').optional(),
  group: yup.string().optional(),
  source: yup.string().optional(),
  note: yup.string().optional(),
  location: yup.mixed().nullable().optional(),
})

export const initCustomer = {
  displayName: '',
  fullName: '',
  type: 'INDIVIDUAL',
  companyName: '',
  contactPerson: '',
  taxId: '',
  contact: '',
  email: '',
  telegram: '',
  dateOfBirth: '',
  address: '',
  tierLocked: false,
  tier: '',
  discount: 0,
  group: '',
  source: '',
  note: '',
  location: null,
}

// The values the form edits, from a saved customer
export const toCustomerForm = (customer) => {
  const values: any = { ...initCustomer }
  Object.keys(initCustomer).forEach((key) => {
    if (customer?.[key] !== undefined && customer?.[key] !== null) values[key] = customer[key]
  })
  values.location = customer?.location?.lat !== undefined ? customer.location : null
  values.tier = customer?.tier?._id || customer?.tier || ''
  values.tierLocked = !!customer?.tierLocked
  return values
}

interface ICustomerProfileForm {
  id?: string
  defaultValues: any
  // The saved photo of the customer being edited
  picture?: { _id: string, filename: string } | null
  // A customer added offline and not synced yet: saving updates it on this device
  offlineRecord?: IPendingCustomer
}

// Full customer profile: identity, contacts, business terms and location.
// A new customer is saved on this device when there's no connection, and
// synced later (shared/offline).
export const CustomerProfileForm = ({ id, defaultValues, picture, offlineRecord }: ICustomerProfileForm) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { online, sync, reportOffline } = useOffline()
  // Sent with a new customer so a retry, or the later sync, can't add it twice
  const clientIdRef = useRef(offlineRecord?.clientId || newClientId())
  const [photo, setPhoto] = useState<ICustomerPhoto>(
    offlineRecord ? { file: offlineRecord.photo || null } : { filename: picture?.filename || null }
  )
  const [photoDirty, setPhotoDirty] = useState(false)
  const customerTypeOptions = [
    { label: language['INDIVIDUAL'], value: 'INDIVIDUAL' },
    { label: language['BUSINESS'], value: 'BUSINESS' },
  ]
  const [loading, setLoading] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)
  const [options, setOptions] = useState<{ groups: string[], sources: string[] }>({ groups: [], sources: [] })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver: yupResolver(schema), defaultValues })
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })
  const type = watch('type')
  const tierLocked = watch('tierLocked')
  const tier = watch('tier')
  const location = watch('location')
  const isBusiness = type === 'BUSINESS'
  const narrow = device === 'mobile' || device === 'tablet'

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    // Kept for the group and source suggestions offline
    try {
      const cached = JSON.parse(localStorage.getItem(OPTIONS_CACHE_KEY) || 'null')
      if (cached) setOptions(cached)
    } catch {}
    Axios({ method: 'GET', url: '/organize/customer/options' })
      .then((response) => {
        const data = response?.data?.data || { groups: [], sources: [] }
        setOptions(data)
        localStorage.setItem(OPTIONS_CACHE_KEY, JSON.stringify(data))
      })
      .catch(() => {})
  }, [])

  // Shows what failed the last sync, so it can be fixed here
  useEffect(() => {
    offlineRecord?.errors?.forEach((error) => error?.key && setError(error.key as any, { message: error.path }))
    if (offlineRecord?.status === 'conflict') setError('displayName', { message: offlineRecord.message || 'Already a customer' })
  }, [offlineRecord, setError])

  // Fills the form from a contact (vCard / MeCard) or Telegram QR. Fields that
  // already have a value are kept and listed, so nothing typed is overwritten.
  const handleScan = (text: string) => {
    setScanOpen(false)
    const scanned = parseContactQr(text)
    const keys = Object.keys(scanned)
    if (!keys.length) return notify('No customer details found in that QR code', 'error')
    const filled: string[] = []
    const kept: string[] = []
    keys.forEach((key) => {
      const value = scanned[key]
      if (key === 'type') {
        if (getValues('type') !== 'BUSINESS') setValue('type', value, { shouldDirty: true })
        return
      }
      // A pin the device filled in for a new customer can be replaced; a
      // saved or hand-picked one is kept
      const current = getValues(key)
      const isEmpty = key === 'location'
        ? !defaultValues?.location && !(dirtyFields as any)?.location
        : current === undefined || current === null || String(current).trim() === ''
      if (isEmpty) {
        setValue(key, value, { shouldDirty: true, shouldValidate: true })
        filled.push(contactFieldLabels[key])
      } else if (String(current) !== String(value)) {
        kept.push(contactFieldLabels[key])
      }
    })
    if (filled.length) notify(`Filled from QR: ${filled.join(', ')}${kept.length ? ` · kept your ${kept.join(', ')}` : ''}`, 'success')
    else notify(kept.length ? `Already filled: ${kept.join(', ')}` : 'Nothing new in that QR code', 'info')
  }

  const merge = (saved: string[], defaults: string[]) => Array.from(new Set([...defaults, ...saved]))

  const changePhoto = (value: ICustomerPhoto) => {
    setPhoto(value)
    setPhotoDirty(true)
  }

  const uploadPhoto = async (file: Blob) => {
    const formData = new FormData()
    formData.append('picture', file, 'customer.jpg')
    const response = await Axios({
      method: 'POST',
      url: '/shared/upload/picture',
      body: formData,
      headers: { 'content-type': 'multipart/form-data' },
    })
    return response?.data?.data?._id as string
  }

  // Keeps the new customer on this device until the sync saves it
  const saveOffline = async (body, pictureId?: string | null) => {
    if (!user?.id) {
      notify('Log in again to add customers offline', 'error')
      return false
    }
    const clientId = clientIdRef.current
    const name = String(body.displayName || '').trim()
    const waiting = await listPending(user.id)
    if (waiting.some((record) => record.clientId !== clientId && String(record.body?.displayName || '').trim() === name)) {
      setError('displayName', { message: 'Already added offline, waiting to sync' })
      return false
    }
    // An uploaded photo is reused unless another one was picked since
    const samePhoto = offlineRecord && !photoDirty
    await savePending({
      clientId,
      ownerUserId: user.id,
      body,
      photo: photo.file || null,
      photoName: 'customer.jpg',
      pictureId: pictureId ?? (samePhoto ? offlineRecord?.pictureId || null : null),
      status: 'pending',
      message: undefined,
      errors: [],
      conflictWith: null,
      capturedAt: offlineRecord?.capturedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attempts: offlineRecord?.attempts || 0,
    })
    return true
  }

  const finishOffline = async (body, pictureId?: string | null) => {
    if (!(await saveOffline(body, pictureId))) return
    markSaved()
    if (offlineRecord) {
      notify('Offline customer updated', 'success')
      // A fixed conflict or invalid detail is tried again right away
      if (online) sync([clientIdRef.current])
    } else {
      notify("Saved on this device. It syncs when you're back online", 'success')
    }
    setTimeout(() => navigate('/function/customer'))
  }

  const submit = async (data) => {
    // The tier is only sent when locked; otherwise it's earned by spending
    const { tier: lockedTier, ...rest } = data
    const body = { ...rest, discount: data.discount ?? 0, tierLocked: !!data.tierLocked, ...(data.tierLocked && { tier: lockedTier }) }
    if (data.tierLocked && !lockedTier) return notify('Choose the tier to lock', 'error')
    if (id && !online && !navigator.onLine) return notify('You are offline. Changing a saved customer needs a connection', 'error')

    setLoading(true)
    // A photo uploaded before the connection dropped is kept for the sync
    let pictureId: string | null | undefined
    try {
      if (!id && (offlineRecord || !online || !navigator.onLine)) return await finishOffline(body)

      if (photo.file && (photoDirty || !id)) pictureId = await uploadPhoto(photo.file)
      else if (photo.keep === false) pictureId = null
      const response = await Axios({
        method: id ? 'PUT' : 'POST',
        url: id ? `/organize/customer/update/${id}` : '/organize/customer/create',
        body: { ...body, ...(pictureId !== undefined && { picture: pictureId }), ...(!id && { clientId: clientIdRef.current }) },
      })
      notify(response?.data?.msg, 'success')
      markSaved()
      // Back to the list once saved; markSaved lets this navigation through
      setTimeout(() => navigate('/function/customer'))
    } catch (err: any) {
      // The connection dropped: a new customer is kept to sync later. If the
      // create did reach the server, the sync finds it by its clientId.
      if (!id && isNetworkError(err)) {
        reportOffline()
        return await finishOffline(body, pictureId)
      }
      const fieldError = Array.isArray(err?.response?.data) ? err.response.data[0] : null
      if (fieldError?.key) setError(fieldError.key, { message: fieldError.path })
      notify(err?.response?.data?.msg || fieldError?.path || (isNetworkError(err) ? 'No connection, try again when online' : undefined), 'error')
    } finally {
      setLoading(false)
    }
  }

  // On small screens every area gets its own row, in the same order. The areas
  // must stay defined: a gridArea name with no matching area sends all the
  // fields into one shared cell outside the grid, where they pile up.
  const grid = (areas: string, columns = '1fr 1fr 1fr') => {
    const names = Array.from(new Set(areas.replace(/'/g, ' ').split(/\s+/).filter(Boolean)))
    return {
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr' : columns,
      gridColumnGap: 20,
      gridTemplateAreas: narrow ? names.map((name) => `'${name}'`).join(' ') : areas,
    }
  }

  return (
    <>
    <QrScanDialog open={scanOpen} title={language['SCAN_CONTACT_OR_TELEGRAM_QR']} onScan={handleScan} onClose={() => setScanOpen(false)} />
    <form
      {...trackChanges}
      onSubmit={handleSubmit(submit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: -15 }}>
        <span style={{ fontSize: 12, color: theme.text.tertiary }}>{language['CONTACT_CARD_OR_TELEGRAM_QR']}</span>
        <Button
          style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          onClick={() => setScanOpen(true)}
        >
          <QrCodeScannerRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
          {language['SCAN_QR']}
        </Button>
      </div>
      {!online && !id && (
        <div style={{ padding: '10px 14px', borderRadius: theme.radius.primary, backgroundColor: `${theme.color.warning || theme.color.error}18`, color: theme.color.warning || theme.color.error, fontSize: 13, marginBottom: -10 }}>
          You're offline. This customer is saved on this device and syncs once you're back online.
        </div>
      )}
      <Section describe={language['CUSTOMER']}>
        <CustomerPhoto value={photo} onChange={changePhoto} />
        <div style={grid(`'type displayName fullName' ${isBusiness ? "'companyName contactPerson taxId'" : ''}`)}>
          <div style={{ gridArea: 'type' }}>
            <SelectField label={language['TYPE']} value={type || 'INDIVIDUAL'} options={customerTypeOptions} {...register('type')} />
          </div>
          <div style={{ gridArea: 'displayName' }}>
            <TextField type='text' label={language['PHONE_NUMBER']} err={errors?.displayName?.message} {...register('displayName')} />
          </div>
          <div style={{ gridArea: 'fullName' }}>
            <TextField type='text' label={language['FULL_NAME']} err={errors?.fullName?.message} {...register('fullName')} />
          </div>
          {isBusiness && (
            <>
              <div style={{ gridArea: 'companyName' }}>
                <TextField type='text' label={language['COMPANY_NAME']} err={errors?.companyName?.message} {...register('companyName')} />
              </div>
              <div style={{ gridArea: 'contactPerson' }}>
                <TextField type='text' label={language['CONTACT_PERSON']} err={errors?.contactPerson?.message} {...register('contactPerson')} />
              </div>
              <div style={{ gridArea: 'taxId' }}>
                <TextField type='text' label={language['TAX_ID']} err={errors?.taxId?.message} {...register('taxId')} />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section describe={language['CONTACT']}>
        <div style={grid(`'contact email telegram' 'dateOfBirth address address'`)}>
          <div style={{ gridArea: 'contact' }}>
            <TextField type='text' label={language['SECOND_PHONE']} err={errors?.contact?.message} {...register('contact')} />
          </div>
          <div style={{ gridArea: 'email' }}>
            <TextField type='email' label={language['EMAIL']} err={errors?.email?.message} {...register('email')} />
          </div>
          <div style={{ gridArea: 'telegram' }}>
            <TextField
              type='text'
              label={language['TELEGRAM']}
              err={errors?.telegram?.message}
              icon={(
                <Tooltip title={language['SCAN_CONTACT_OR_TELEGRAM_QR']}>
                  <QrCodeScannerRoundedIcon fontSize='small' onClick={() => setScanOpen(true)} />
                </Tooltip>
              )}
              {...register('telegram')}
            />
          </div>
          <div style={{ gridArea: 'dateOfBirth' }}>
            <TextField type='date' label={language['BIRTHDAY']} err={errors?.dateOfBirth?.message} {...register('dateOfBirth')} />
          </div>
          <div style={{ gridArea: 'address' }}>
            <TextField type='text' label={language['ADDRESS']} err={errors?.address?.message} {...register('address')} />
          </div>
        </div>
        <MapPicker
          label={language['LOCATION']}
          value={location}
          height={260}
          // A picked pin is a change; the device location filled in for a new
          // customer is not, so it doesn't trigger the unsaved prompt
          onChange={(value) => setValue('location', value, { shouldDirty: true })}
          onDefault={(value) => setValue('location', value)}
          onPlace={(place) => {
            if (!String(getValues('address') || '').trim()) setValue('address', place.label, { shouldDirty: true })
          }}
        />
      </Section>

      <Section describe={language['BUSINESS']}>
        <TierPanel
          customerId={id}
          locked={!!tierLocked}
          tierId={tier || undefined}
          onChangeLocked={(value) => setValue('tierLocked', value, { shouldDirty: true })}
          onChangeTier={(value) => setValue('tier', value, { shouldDirty: true })}
        />
        <div style={grid(`'discount group group' 'source source source' 'note note note'`)}>
          <div style={{ gridArea: 'discount' }}>
            <TextField
              type='number'
              step='any'
              min='0'
              max='100'
              label={language['OWN_DISCOUNT']}
              hint=''
              err={errors?.discount?.message}
              {...register('discount')}
            />
            {!errors?.discount && <div style={{ fontSize: 12, color: theme.text.quaternary, marginTop: -18, paddingLeft: 7 }}>{language['ABOVE_ZERO_REPLACES_TIER']}</div>}
          </div>
          <div style={{ gridArea: 'group' }}>
            <TextField type='text' label={language['GROUP']} list='customer-groups' err={errors?.group?.message} {...register('group')} />
            <datalist id='customer-groups'>
              {merge(options.groups, defaultGroups).map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
          <div style={{ gridArea: 'source' }}>
            <TextField type='text' label={language['SOURCE']} list='customer-sources' err={errors?.source?.message} {...register('source')} />
            <datalist id='customer-sources'>
              {merge(options.sources, defaultSources).map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
          <div style={{ gridArea: 'note' }}>
            <DetailField label={language['NOTE']} style={{ height: 80 }} {...register('note')} />
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'end', paddingBottom: 20 }}>
        <Button
          variant='contained'
          style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          onClick={() => navigate(-1)}
        >
          {language['CANCEL']}
        </Button>
        <Button
          loading={loading}
          type='submit'
          variant='contained'
          style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
        >
          {id || offlineRecord ? language['SAVE'] : !online ? 'Save offline' : language['CREATE']}
        </Button>
      </div>
    </form>
    </>
  )
}
