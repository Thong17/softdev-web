import { useEffect, useState } from 'react'
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

export const customerTypeOptions = [
  { label: 'Individual', value: 'INDIVIDUAL' },
  { label: 'Business', value: 'BUSINESS' },
]

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

// Full customer profile: identity, contacts, business terms and location
export const CustomerProfileForm = ({ id, defaultValues }: { id?: string, defaultValues: any }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { notify } = useNotify()
  const navigate = useNavigate()
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
    Axios({ method: 'GET', url: '/organize/customer/options' })
      .then((response) => setOptions(response?.data?.data || { groups: [], sources: [] }))
      .catch(() => {})
  }, [])

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

  const submit = (data) => {
    setLoading(true)
    // The tier is only sent when locked; otherwise it's earned by spending
    const { tier: lockedTier, ...rest } = data
    const body = { ...rest, discount: data.discount ?? 0, tierLocked: !!data.tierLocked, ...(data.tierLocked && { tier: lockedTier }) }
    if (data.tierLocked && !lockedTier) {
      setLoading(false)
      return notify('Choose the tier to lock', 'error')
    }
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/customer/update/${id}` : '/organize/customer/create',
      body,
    })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        markSaved()
        // Back to the list once saved; markSaved lets this navigation through
        setTimeout(() => navigate('/function/customer'))
      })
      .catch((err) => {
        const fieldError = Array.isArray(err?.response?.data) ? err.response.data[0] : null
        if (fieldError?.key) setError(fieldError.key, { message: fieldError.path })
        notify(err?.response?.data?.msg || fieldError?.path, 'error')
      })
      .finally(() => setLoading(false))
  }

  const grid = (areas: string, columns = '1fr 1fr 1fr') => ({
    display: 'grid',
    gridTemplateColumns: narrow ? '1fr' : columns,
    gridColumnGap: 20,
    ...(narrow ? {} : { gridTemplateAreas: areas }),
  })

  return (
    <>
    <QrScanDialog open={scanOpen} title='Scan Contact or Telegram QR' onScan={handleScan} onClose={() => setScanOpen(false)} />
    <form
      {...trackChanges}
      onSubmit={handleSubmit(submit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: -15 }}>
        <span style={{ fontSize: 12, color: theme.text.tertiary }}>Contact card or Telegram QR</span>
        <Button
          style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          onClick={() => setScanOpen(true)}
        >
          <QrCodeScannerRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
          Scan&nbsp;QR
        </Button>
      </div>
      <Section describe='Customer'>
        <div style={grid(`'type displayName fullName' ${isBusiness ? "'companyName contactPerson taxId'" : ''}`)}>
          <div style={{ gridArea: 'type' }}>
            <SelectField label='Type' value={type || 'INDIVIDUAL'} options={customerTypeOptions} {...register('type')} />
          </div>
          <div style={{ gridArea: 'displayName' }}>
            <TextField type='text' label='Phone Number' err={errors?.displayName?.message} {...register('displayName')} />
          </div>
          <div style={{ gridArea: 'fullName' }}>
            <TextField type='text' label='Full Name' err={errors?.fullName?.message} {...register('fullName')} />
          </div>
          {isBusiness && (
            <>
              <div style={{ gridArea: 'companyName' }}>
                <TextField type='text' label='Company Name' err={errors?.companyName?.message} {...register('companyName')} />
              </div>
              <div style={{ gridArea: 'contactPerson' }}>
                <TextField type='text' label='Contact Person' err={errors?.contactPerson?.message} {...register('contactPerson')} />
              </div>
              <div style={{ gridArea: 'taxId' }}>
                <TextField type='text' label='Tax ID (VAT / TIN)' err={errors?.taxId?.message} {...register('taxId')} />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section describe='Contact'>
        <div style={grid(`'contact email telegram' 'dateOfBirth address address'`)}>
          <div style={{ gridArea: 'contact' }}>
            <TextField type='text' label='Second Phone' err={errors?.contact?.message} {...register('contact')} />
          </div>
          <div style={{ gridArea: 'email' }}>
            <TextField type='email' label='Email' err={errors?.email?.message} {...register('email')} />
          </div>
          <div style={{ gridArea: 'telegram' }}>
            <TextField
              type='text'
              label='Telegram'
              err={errors?.telegram?.message}
              icon={(
                <Tooltip title='Scan Telegram or contact QR'>
                  <QrCodeScannerRoundedIcon fontSize='small' onClick={() => setScanOpen(true)} />
                </Tooltip>
              )}
              {...register('telegram')}
            />
          </div>
          <div style={{ gridArea: 'dateOfBirth' }}>
            <TextField type='date' label='Birthday' err={errors?.dateOfBirth?.message} {...register('dateOfBirth')} />
          </div>
          <div style={{ gridArea: 'address' }}>
            <TextField type='text' label='Address' err={errors?.address?.message} {...register('address')} />
          </div>
        </div>
        <MapPicker
          label='Location'
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

      <Section describe='Business'>
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
              label='Own Discount (%)'
              hint=''
              err={errors?.discount?.message}
              {...register('discount')}
            />
            {!errors?.discount && <div style={{ fontSize: 12, color: theme.text.quaternary, marginTop: -18, paddingLeft: 7 }}>Above 0 replaces the tier discount</div>}
          </div>
          <div style={{ gridArea: 'group' }}>
            <TextField type='text' label='Group' list='customer-groups' err={errors?.group?.message} {...register('group')} />
            <datalist id='customer-groups'>
              {merge(options.groups, defaultGroups).map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
          <div style={{ gridArea: 'source' }}>
            <TextField type='text' label='Source (how they found you)' list='customer-sources' err={errors?.source?.message} {...register('source')} />
            <datalist id='customer-sources'>
              {merge(options.sources, defaultSources).map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
          <div style={{ gridArea: 'note' }}>
            <DetailField label='Note' style={{ height: 80 }} {...register('note')} />
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'end', paddingBottom: 20 }}>
        <Button
          variant='contained'
          style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          type='submit'
          variant='contained'
          style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
        >
          {id ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
    </>
  )
}
