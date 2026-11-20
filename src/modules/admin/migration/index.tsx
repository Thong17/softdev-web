import { useState } from 'react'
import Container from 'components/shared/Container'
import { SelectTab } from 'components/shared/form/SelectTab'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import { ProductImport } from './ProductImport'
import { ImageImport } from './ImageImport'
import { StockImport } from './StockImport'

// Admin › Migration: bring products in from Excel (matched by name), add their
// stock from Excel, and attach pictures in bulk by file name
export const Migration = () => {
  const [tab, setTab] = useState<'product' | 'stock' | 'image'>('product')

  return (
    <Container header={<AdminBreadcrumbs page='migration' />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15, paddingBottom: 20 }}>
        <SelectTab
          selected={tab}
          options={[
            { label: 'Products from Excel', value: 'product' },
            { label: 'Stock from Excel', value: 'stock' },
            { label: 'Images', value: 'image' },
          ]}
          onChange={setTab}
        />
        {tab === 'product' ? <ProductImport /> : tab === 'stock' ? <StockImport /> : <ImageImport />}
      </div>
    </Container>
  )
}
