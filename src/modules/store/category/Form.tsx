import React from 'react'
import {
  LocaleInput,
  FileInput,
  DetailInput,
  SelectInput,
} from 'components/shared/form'
import useWeb from 'hooks/useWeb'

const CategoryForm = () => {
  const { device } = useWeb()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: device === 'mobile' ? '1fr' : '500px 1fr',
        gridGap: 20,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: `
                              'category category category'
                              'status icon icon'
                              'select select select'
                              `,
        }}
      >
        <div style={{ gridArea: 'category' }}>
          <LocaleInput name='category' describe='Category' />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectInput
            options={[
              { label: 'Enabled', value: true, selected: true },
              { label: 'Disable', value: false },
            ]}
            label='Status'
            defaultValue=''
            value={true}
          />
        </div>
        <div style={{ gridArea: 'icon' }}>
          <FileInput name='icon' label='Icon' />
        </div>
        <div style={{ gridArea: 'select' }}>
          <DetailInput type='text' name='description' label='Description' style={{ height: 70 }} />
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </div>
  )
}

export default CategoryForm
