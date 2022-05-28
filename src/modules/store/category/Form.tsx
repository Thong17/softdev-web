import React from 'react'
import {
  LocaleField,
  FileField,
  DetailField,
  SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { categorySchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

const CategoryForm = () => {
  const { loadify } = useNotify()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) })
  const { device } = useWeb()

  const handleChangeCategory = (category) => {
    setValue('name', category)
  }

  const submit = async (data) => {
    const response = Axios({
      method: 'POST',
      url: '/store/category/create',
      body: data,
    })
    loadify(response)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns:
          device === 'mobile' || device === 'tablet' ? '1fr' : '500px 1fr',
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
                              'description description description'
                              'action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'category' }}>
          <LocaleField
            onChange={handleChangeCategory}
            err={errors?.name}
            describe='Category'
            name='name'
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            options={[
              { label: 'Enabled', value: true, selected: true },
              { label: 'Disable', value: false },
            ]}
            label='Status'
            defaultValue={true}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'icon' }}>
          <FileField label='Icon' {...register('icon')} />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
            {...register('description')}
          />
        </div>
        <div
          style={{
            gridArea: 'action',
            marginTop: 10,
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button variant='contained' color='error'>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            style={{ marginLeft: 20 }}
          >
            Submit
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default CategoryForm
