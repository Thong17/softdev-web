import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import Container from 'components/shared/Container'
import Button from 'components/shared/Button'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { timeFormat } from 'utils'
import Breadcrumbs from '../components/Breadcrumbs'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { HintBox } from 'components/shared/HintBox'
import { MiniSelectField } from 'components/shared/form'
import { TierIcon, tierIconOptions } from 'components/shared/TierBadge'

interface ITierRow {
  _id?: string
  key: string
  name: string
  minSpent: string
  discount: string
  color: string
  icon: string
  // Uploaded image; replaces the medal when set
  iconImage?: { _id: string, filename: string } | null
  customers?: number
}

const newKey = () => Math.random().toString(36).slice(2)
declare type TierColumn = 'icon' | 'color' | 'name' | 'minSpent' | 'discount' | 'customers' | 'action'

const columnData: ITableColumn<TierColumn>[] = [
  { id: 'icon', label: 'Icon', minWidth: 150 },
  { id: 'color', label: 'Color', minWidth: 60 },
  { id: 'name', label: 'Tier', minWidth: 160 },
  { id: 'minSpent', label: 'Minimum Spend (USD)', minWidth: 150 },
  { id: 'discount', label: 'Discount (%)', minWidth: 110 },
  { id: 'customers', label: 'Customers', minWidth: 80 },
  { id: 'action', label: 'Action', minWidth: 60, align: 'right' },
]

const PALETTE = ['#cd7f32', '#9ea7b3', '#e6b422', '#4fc3f7', '#ab47bc', '#ef5350']

// Customer tiers: each has a minimum spend over the last N months and a
// discount %. Customers move up right after a payment and are re-checked monthly.
export const CustomerTiers = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { notify, loadify } = useNotify()
  const confirm = useAlert()
  const navigate = useNavigate()
  const [rows, setRows] = useState<ITierRow[]>([])
  const [months, setMonths] = useState('12')
  const [checkedAt, setCheckedAt] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const canEdit = !!user?.privilege?.customer?.update
  // One hidden file input; `uploadFor` is the row being given an image
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadFor, setUploadFor] = useState<string | null>(null)
  const { markSaved, trackChanges } = useUnsavedChanges({ enabled: loaded && canEdit })

  const load = () => Axios({ method: 'GET', url: '/organize/customer/tier' })
    .then((response) => {
      const data = response?.data?.data
      setRows((data?.tiers || []).map((tier) => ({
        _id: tier._id,
        key: tier._id,
        name: tier.name,
        minSpent: String(tier.minSpent ?? 0),
        discount: String(tier.discount ?? 0),
        color: tier.color || '#9e9e9e',
        icon: tier.icon || '',
        iconImage: tier.iconImage?._id ? tier.iconImage : null,
        customers: tier.customers || 0,
      })))
      setMonths(String(data?.months || 12))
      setCheckedAt(data?.checkedAt || null)
      setLoaded(true)
    })
    .catch((err) => notify(err?.response?.data?.msg, 'error'))

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = (key: string, field: keyof ITierRow, value: string) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)))
    setErrors((prev) => ({ ...prev, [`${key}.${field}`]: '' }))
  }

  const setRowIcon = (key: string, patch: Partial<ITierRow>) =>
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)))

  const chooseIcon = (key: string, value: string) => {
    if (value === 'custom') {
      setUploadFor(key)
      fileRef.current?.click()
      return
    }
    setRowIcon(key, { icon: value, iconImage: null })
  }

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    const key = uploadFor
    setUploadFor(null)
    if (!file || !key) return
    if (!file.type.startsWith('image/')) return notify('Choose an image file', 'error')
    const formData = new FormData()
    formData.append('icon', file)
    const response = Axios({ method: 'POST', url: '/shared/upload/icon', body: formData, headers: { 'content-type': 'multipart/form-data' } })
    loadify(response)
    response.then((result) => {
      const image = result?.data?.data
      if (image?._id) setRowIcon(key, { icon: '', iconImage: { _id: image._id, filename: image.filename } })
    })
  }

  const addTier = () => {
    const highest = rows.reduce((max, row) => Math.max(max, Number(row.minSpent) || 0), 0)
    setRows((prev) => [...prev, {
      key: newKey(),
      name: '',
      minSpent: String(highest ? highest * 2 : 0),
      discount: '0',
      color: PALETTE[prev.length % PALETTE.length],
      icon: '',
      customers: 0,
    }])
  }

  const removeTier = (row: ITierRow) => {
    const remove = () => setRows((prev) => prev.filter((item) => item.key !== row.key))
    if (!row.customers) return remove()
    confirm({
      title: `Remove ${row.name}?`,
      description: `${row.customers} customer${row.customers === 1 ? ' is' : 's are'} in this tier. When you save, they move to the tier their spending earns.`,
      variant: 'warning',
    })
      .then(remove)
      .catch(() => {})
  }

  const validate = () => {
    const err: Record<string, string> = {}
    const names = new Map<string, string>()
    const amounts = new Map<number, string>()
    rows.forEach((row) => {
      const name = row.name.trim().toLowerCase()
      if (!name) err[`${row.key}.name`] = 'Required'
      else if (names.has(name)) err[`${row.key}.name`] = 'Already used'
      names.set(name, row.key)
      const amount = Number(row.minSpent)
      if (row.minSpent === '' || !(amount >= 0)) err[`${row.key}.minSpent`] = '0 or more'
      else if (amounts.has(amount)) err[`${row.key}.minSpent`] = 'Same as another tier'
      amounts.set(amount, row.key)
      const discount = Number(row.discount)
      if (row.discount === '' || !(discount >= 0 && discount <= 100)) err[`${row.key}.discount`] = '0 – 100'
    })
    if (rows.length && !rows.some((row) => Number(row.minSpent) === 0)) err.general = 'The lowest tier must start at $0 so every customer has a tier.'
    if (!rows.length) err.general = 'Add at least one tier.'
    const monthsValue = Number(months)
    if (!Number.isInteger(monthsValue) || monthsValue < 1 || monthsValue > 120) err.months = '1 – 120'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    Axios({
      method: 'PUT',
      url: '/organize/customer/tier',
      body: {
        months: Number(months),
        tiers: rows.map((row) => ({
          ...(row._id && { _id: row._id }),
          name: row.name.trim(),
          minSpent: Number(row.minSpent),
          discount: Number(row.discount),
          color: row.color,
          icon: row.iconImage ? '' : row.icon,
          iconImage: row.iconImage?._id || '',
        })),
      },
    })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        markSaved()
        load()
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Could not save the tiers', 'error'))
      .finally(() => setSaving(false))
  }

  const handleRecheck = () => {
    const response = Axios({ method: 'POST', url: '/organize/customer/tier/recalculate' })
    loadify(response)
    response.then(() => load())
  }

  const input = (hasError: boolean) => ({
    width: '100%',
    boxSizing: 'border-box' as const,
    height: 34,
    padding: '0 10px',
    background: 'transparent',
    color: theme.text.primary,
    border: hasError ? `1px solid ${theme.color.error}` : theme.border.quaternary,
    borderRadius: theme.radius.primary,
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  })
  const errorText = (key: string) => errors[key] && <div style={{ color: theme.color.error, fontSize: 12, marginTop: 3 }}>{errors[key]}</div>

  // Icon choices with their medal; "Custom" shows the uploaded image when set
  // (the select hides an empty value, so "None" is 'none')
  const iconOptions = (row: ITierRow) => tierIconOptions.map((option) => {
    const value = option.value || 'none'
    const preview = option.value === 'custom'
      ? row.iconImage && <TierIcon image={row.iconImage.filename} size={18} />
      : option.value && <TierIcon icon={option.value} size={18} />
    return {
      value,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {preview}
          {option.label}
        </span>
      ),
    }
  })

  // Rows for the shared table; rows keep their order while typing
  const tableRows = rows.map((row) => ({
    id: row.key,
    icon: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* The medal once, beside the dropdown; the dropdown shows only the name */}
        <span style={{ width: 24, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {row.icon || row.iconImage
            ? <TierIcon icon={row.icon} image={row.iconImage?.filename} size={24} />
            : <span style={{ color: theme.text.quaternary }}>--</span>}
        </span>
        <div style={{ ...input(false), display: 'flex', alignItems: 'center', flex: 1, padding: 0 }}>
          <MiniSelectField
            name={`icon-${row.key}`}
            disabled={!canEdit}
            value={row.iconImage ? 'custom' : row.icon || 'none'}
            options={iconOptions(row)}
            onChange={(event) => chooseIcon(row.key, event.target.value === 'none' ? '' : (event.target.value as string))}
            containerStyle={{ width: '100%', minWidth: 0 }}
            // Name only in the box; the open menu still shows each medal
            renderValue={(value) => tierIconOptions.find((option) => (option.value || 'none') === value)?.label || ''}
            sx={{ width: '100%', height: 32, '& .MuiSelect-select': { paddingLeft: '8px !important' } }}
          />
        </div>
        {row.iconImage && canEdit && (
          <Tooltip title='Upload a different image'>
            <IconButton size='small' onClick={() => chooseIcon(row.key, 'custom')} style={{ color: theme.text.secondary }}>
              <FileUploadRoundedIcon style={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
    color: (
      // Round swatch: the native picker is enlarged and clipped by the circle
      <label
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 28,
          height: 28,
          borderRadius: '50%',
          overflow: 'hidden',
          border: theme.border.quaternary,
          cursor: canEdit ? 'pointer' : 'default',
        }}
      >
        <input
          type='color'
          value={row.color}
          disabled={!canEdit}
          onChange={(event) => update(row.key, 'color', event.target.value)}
          style={{ position: 'absolute', top: -10, left: -10, width: 48, height: 48, padding: 0, border: 'none', background: 'transparent', cursor: 'inherit' }}
        />
      </label>
    ),
    name: (
      <div>
        <input type='text' value={row.name} disabled={!canEdit} placeholder='e.g. Gold' onChange={(event) => update(row.key, 'name', event.target.value)} style={input(!!errors[`${row.key}.name`])} />
        {errorText(`${row.key}.name`)}
      </div>
    ),
    minSpent: (
      <div>
        <input type='number' min='0' step='any' value={row.minSpent} disabled={!canEdit} onChange={(event) => update(row.key, 'minSpent', event.target.value)} style={input(!!errors[`${row.key}.minSpent`])} />
        {errorText(`${row.key}.minSpent`)}
      </div>
    ),
    discount: (
      <div>
        <input type='number' min='0' max='100' step='any' value={row.discount} disabled={!canEdit} onChange={(event) => update(row.key, 'discount', event.target.value)} style={input(!!errors[`${row.key}.discount`])} />
        {errorText(`${row.key}.discount`)}
      </div>
    ),
    customers: row._id ? row.customers : '--',
    action: canEdit ? (
      <Tooltip title='Remove tier'>
        <IconButton size='small' onClick={() => removeTier(row)} style={{ color: theme.color.error }}>
          <DeleteOutlineRoundedIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    ) : null,
  }))

  return (
    <Container
      header={
        <>
          <Breadcrumbs page='customerTier' />
          {canEdit && (
            <CustomButton
              styled={theme}
              onClick={handleRecheck}
              style={{ backgroundColor: `${theme.text.secondary}22`, color: theme.text.secondary }}
            >
              Re-check&nbsp;now
            </CustomButton>
          )}
        </>
      }
    >
      <div {...trackChanges} style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
        <HintBox>
        <div>
          <div>
            Customers earn a tier from what they paid over the last
            <input
              type='text'
              inputMode='numeric'
              value={months}
              disabled={!canEdit}
              onChange={(event) => /^\d*$/.test(event.target.value) && setMonths(event.target.value)}
              style={{ ...input(!!errors.months), width: 56, height: 30, margin: '0 8px', textAlign: 'center', display: 'inline-block', backgroundColor: theme.background.primary }}
            />
            months. They move up right after a payment, and all tiers are re-checked on the 1st of each month.
            {checkedAt && <span style={{ color: theme.text.tertiary }}> Last re-check: {timeFormat(checkedAt, 'YYYY-MM-DD HH:mm')}.</span>}
          </div>
          {errorText('months')}
          <div style={{ color: theme.text.tertiary, fontSize: 13, marginTop: 4 }}>
            Saving re-places every customer by their spending, except those locked on a tier. A customer's own discount wins over the tier discount.
          </div>
        </div>
        </HintBox>

        <StickyTable columns={columnData} rows={tableRows} loading={!loaded} pagination={false} />
        {errors.general && <div style={{ color: theme.color.error, fontSize: 13 }}>{errors.general}</div>}
        <input ref={fileRef} type='file' accept='image/png, image/jpeg, image/svg+xml, image/webp' onChange={handleUpload} style={{ display: 'none' }} />

        {canEdit && (
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 20 }}>
            <Button style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }} onClick={addTier}>
              <AddRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              Add tier
            </Button>
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              <Button style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                loading={saving}
                style={{ marginLeft: 10, backgroundColor: `${theme.color.success}22`, color: theme.color.success }}
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
