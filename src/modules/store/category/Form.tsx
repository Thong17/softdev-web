import React, { useState } from 'react'
import Axios from 'constants/functions/Axios'
import {
  LocaleInput,
  FileInput,
  DetailInput,
  SelectInput,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { categorySchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useNotify from 'hooks/useNotify'

const CategoryForm = () => {
  const [loading, setLoading] = useState(false)
  const { notify } = useNotify()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) })
  const { device } = useWeb()

  const handleChangeCategory = (category) => {
    setValue('category', category)
  }

  const submit = async (data) => {
    setLoading(true)
    try {
      const response = await Axios({ method: 'POST', url: '/store/category/create', body: data })
    
      setLoading(false)
      notify(response?.data?.msg, 'success')
    } catch (err: any) {
      setLoading(false)
      notify(err?.response?.data?.msg, 'error')
    }
    
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
          <LocaleInput
            onChange={handleChangeCategory}
            err={errors?.category}
            describe='Category'
            name='category'
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectInput
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
          <FileInput label='Icon' {...register('icon')} />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailInput
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
            loading={loading}
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
