import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import Container from 'components/shared/Container'
import Breadcrumb from 'components/shared/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Section } from 'components/shared/Section'
import { TextField } from 'components/shared/form'
import { HintBox } from 'components/shared/HintBox'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useStoreFeatures from 'hooks/useStoreFeatures'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { SoftInvoiceSetting, ISoftInvoiceSetting } from 'modules/config/SoftInvoiceSetting'
import { storeStages } from './stages'
import { responsiveGrid } from 'utils'

const printerFields = {
  receiptPrinterName: '',
  receiptPrinterCharPerLine: '',
  storePrinterName: '',
  storePrinterCharPerLine: '',
  thermalPrinterName: '',
  thermalPrinterWidth: '',
  thermalPrinterHeight: '',
  thermalPrinterGap: '',
}
type PrinterSetting = typeof printerFields

const numberFields = ['receiptPrinterCharPerLine', 'storePrinterCharPerLine', 'thermalPrinterWidth', 'thermalPrinterHeight', 'thermalPrinterGap']

// Store › Printing: receipt, store-copy and label printers, and A4 / A5 soft invoices
export const PrintingStore = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const features = useStoreFeatures()
  const [value, setValue] = useState<PrinterSetting>(printerFields)
  const [saved, setSaved] = useState<PrinterSetting>(printerFields)
  const [softInvoice, setSoftInvoice] = useState<Partial<ISoftInvoiceSetting> | null>(null)
  const [saving, setSaving] = useState(false)
  const isDirty = JSON.stringify(value) !== JSON.stringify(saved)
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })

  useEffect(() => {
    Axios({ method: 'GET', url: '/organize/store/getTelegramSetting' })
      .then((response) => {
        const data = response?.data?.data || {}
        const loaded = { ...printerFields }
        Object.keys(printerFields).forEach((key) => {
          if (data[key] !== undefined && data[key] !== null) loaded[key] = String(data[key])
        })
        setValue(loaded)
        setSaved(loaded)
        setSoftInvoice(data.softInvoice || {})
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const change = (key: keyof PrinterSetting) => (event) => setValue((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSave = () => {
    const body: any = {}
    Object.keys(value).forEach((key) => {
      body[key] = numberFields.includes(key) ? (value[key] === '' ? 0 : Number(value[key])) : value[key]
    })
    setSaving(true)
    Axios({ method: 'PUT', url: '/organize/store/printing-setting', body })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        setSaved(value)
        markSaved()
      })
      .catch((err) => notify(err?.response?.data?.msg || language['COULD_NOT_SAVE'], 'error'))
      .finally(() => setSaving(false))
  }

  const field = (key: keyof PrinterSetting, label: string, type = 'text') => (
    <div style={{ gridArea: key }}>
      <TextField type={type} label={label} value={value[key]} onChange={change(key)} />
    </div>
  )

  return (
    <Container header={<Breadcrumb stages={storeStages(language, id, 'printing')} title={<StorefrontRoundedIcon />} />}>
      <div style={{ paddingTop: 20 }}>
        <div {...trackChanges}>
          <Section describe={language['PRINTERS']} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <HintBox>{language['PRINTERS_HINT']}</HintBox>
              <div
                style={{
                  display: 'grid',
                  gridColumnGap: 20,
                  ...responsiveGrid(device === 'mobile', '1fr 200px', `
                    'receiptPrinterName receiptPrinterCharPerLine'
                    'storePrinterName storePrinterCharPerLine'
                  `),
                }}
              >
                {field('receiptPrinterName', language['RECEIPT_PRINTER_NAME'])}
                {field('receiptPrinterCharPerLine', language['CHARS_PER_LINE'], 'number')}
                {field('storePrinterName', language['STORE_PRINTER_NAME'])}
                {field('storePrinterCharPerLine', language['CHARS_PER_LINE'], 'number')}
              </div>
              {features.labelPrinting ? (
                <div
                  style={{
                    display: 'grid',
                    gridColumnGap: 20,
                    ...responsiveGrid(device === 'mobile', '1fr 160px 160px 160px', `'thermalPrinterName thermalPrinterWidth thermalPrinterHeight thermalPrinterGap'`),
                  }}
                >
                  {field('thermalPrinterName', language['LABEL_PRINTER_NAME'])}
                  {field('thermalPrinterWidth', language['PAPER_WIDTH_MM'], 'number')}
                  {field('thermalPrinterHeight', language['PAPER_HEIGHT_MM'], 'number')}
                  {field('thermalPrinterGap', language['PAPER_GAP_MM'], 'number')}
                </div>
              ) : (
                <span style={{ color: theme.text.tertiary, fontSize: 13 }}>{language['LABEL_PRINTING_OFF_HINT']}</span>
              )}
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  variant='contained'
                  disabled={saving || !isDirty}
                  onClick={handleSave}
                  style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, opacity: saving || !isDirty ? 0.6 : 1 }}
                >
                  {language['SAVE']}
                </Button>
              </div>
            </div>
          </Section>
        </div>
        <SoftInvoiceSetting initial={softInvoice} />
      </div>
    </Container>
  )
}
