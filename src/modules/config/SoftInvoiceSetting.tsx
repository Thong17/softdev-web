import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Section } from 'components/shared/Section'
import { CheckboxField, DetailField, SelectField } from 'components/shared/form'
import { HintBox } from 'components/shared/HintBox'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useUnsavedChanges from 'hooks/useUnsavedChanges'

export interface ISoftInvoiceSetting {
  enabled: boolean
  paperSize: 'A4' | 'A5'
  showLogo: boolean
  footer: string
}

export const defaultSoftInvoice: ISoftInvoiceSetting = { enabled: false, paperSize: 'A4', showLogo: true, footer: '' }

const paperOptions = [
  { label: 'A4 (210 × 297 mm)', value: 'A4' },
  { label: 'A5 (148 × 210 mm)', value: 'A5' },
]

// Store Config › Soft Invoice: A4 / A5 invoices that can be printed or saved
// as PDF from Cashing, Report › Payment and Group payment
export const SoftInvoiceSetting = ({ initial }: { initial?: Partial<ISoftInvoiceSetting> | null }) => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [value, setValue] = useState<ISoftInvoiceSetting>(defaultSoftInvoice)
  const [saved, setSaved] = useState<ISoftInvoiceSetting>(defaultSoftInvoice)
  const [saving, setSaving] = useState(false)
  const isDirty = JSON.stringify(value) !== JSON.stringify(saved)
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })

  useEffect(() => {
    const loaded = { ...defaultSoftInvoice, ...(initial || {}) }
    setValue(loaded)
    setSaved(loaded)
  }, [initial])

  const change = (patch: Partial<ISoftInvoiceSetting>) => setValue((prev) => ({ ...prev, ...patch }))

  const handleSave = () => {
    setSaving(true)
    Axios({ method: 'PUT', url: '/organize/store/invoice-setting', body: value })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        setSaved(value)
        markSaved()
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Could not save', 'error'))
      .finally(() => setSaving(false))
  }

  return (
    <div {...trackChanges}>
      <Section describe='Soft Invoice' style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <HintBox>
            Print A4 or A5 invoices, or save them as PDF, from Cashing after checkout, Report › Payment and Group payment.
            Labels print in Khmer and English.
          </HintBox>
          <CheckboxField
            name='softInvoice.enabled'
            label='Support Soft Invoice'
            checked={value.enabled}
            onChange={(event) => change({ enabled: event.target.checked })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gridColumnGap: 20, opacity: value.enabled ? 1 : 0.5 }}>
            <SelectField
              name='softInvoice.paperSize'
              label='Default Paper Size'
              value={value.paperSize}
              disabled={!value.enabled}
              options={paperOptions}
              onChange={(event) => change({ paperSize: event.target.value as 'A4' | 'A5' })}
            />
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 20 }}>
              <CheckboxField
                name='softInvoice.showLogo'
                label='Show store logo'
                checked={value.showLogo}
                disabled={!value.enabled}
                onChange={(event) => change({ showLogo: event.target.checked })}
              />
            </div>
          </div>
          <div style={{ opacity: value.enabled ? 1 : 0.5 }}>
            <DetailField
              label='Footer (e.g. bank account, return policy)'
              value={value.footer}
              disabled={!value.enabled}
              maxLength={500}
              style={{ height: 70 }}
              onChange={(event) => change({ footer: event.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant='contained'
              disabled={saving || !isDirty}
              onClick={handleSave}
              style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, opacity: saving || !isDirty ? 0.6 : 1 }}
            >
              Save
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
