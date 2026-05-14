import React, { useEffect, useState } from 'react'
import {
  SelectField,
  TextField,
  DetailField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { membershipSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListMembership } from './redux'
import { LocaleDetail } from 'components/shared/form/LocaleField'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { ProductContainer } from 'components/shared/container/ProductContainer'

const typeOption = [
  {
    value: 'PCT',
    label: 'Percent',
  },
  {
    value: 'USD',
    label: 'USD',
  },
  {
    value: 'KHR',
    label: 'KHR',
  },
]

const targetOption = [
  { value: 'product', label: 'Product' },
  { value: 'category', label: 'Category' },
  { value: 'brand', label: 'Brand' },
  { value: 'all', label: 'All Products' },
]

const durationOption = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const MembershipForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(membershipSchema), defaultValues })
  const { device } = useWeb()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(defaultValues?.discount?.type || 'PCT')
  const typeValue = watch('discount.type')
  const [isFixed, setIsFixed] = useState(defaultValues?.discount?.isFixed || false)
  const [selectedProducts, setSelectedProducts] = useState<any>(defaultValues?.target?.products || [])
  const [targetType, setTargetType] = useState(defaultValues?.target?.type || 'product')
  const navigate = useNavigate()

  useEffect(() => {
    const selectedType = typeOption.find((key) => key.value === typeValue)
    setType(selectedType?.value || '')
  }, [typeValue])

  useEffect(() => {
    setValue('discount.type', type)
  }, [type, setValue])

  useEffect(() => {
    setValue('target.type', targetType)
    if (targetType === 'all') {
      setValue('target.products', [])
      setValue('target.categories', [])
      setValue('target.brands', [])
    } else if (targetType === 'product') {
      setValue('target.products', selectedProducts)
      setValue('target.categories', [])
      setValue('target.brands', [])
    } else {
      setValue('target.products', [])
      setValue('target.categories', [])
      setValue('target.brands', [])
    }
  }, [selectedProducts, targetType, setValue])

  const handleChangeName = (name) => {
    setValue('name', name)
  }

  const handleChangeDescription = (description) => {
    setValue('description', description)
  }

  const handleClickProduct = (id) => {
    if (!selectedProducts.includes(id)) return setSelectedProducts(prev => [...prev, id])
    setSelectedProducts(prev => prev.filter(item => item !== id))
  }

  const handleToggleCheck = () => {
    setIsFixed(!isFixed)
    setValue('discount.isFixed', !isFixed)
  }

  const submit = async (data) => {
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/membership/update/${id}` : `/organize/membership/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListMembership({}))
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
      .finally(() => setLoading(false))
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
          height: 'fit-content',
          gridTemplateAreas: `
                              'name name name name'
                              'discountValue discountValue discountType discountType'
                              'startAt startAt expireAt expireAt'
                              'durationValue durationValue durationUnit durationUnit'
                              'targetType targetType targetType targetType'
                              'note note note note'
                              'description description description description'
                              'action action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'name' }}>
          <LocaleDetail
            onChange={handleChangeName}
            err={errors?.name}
            describe='Name'
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'discountValue' }}>
          <TextField
            type='number'
            step='any'
            label='Discount Value'
            err={errors?.discount?.value?.message}
            {...register('discount.value')}
            icon={isFixed ? <CheckBoxRoundedIcon onClick={handleToggleCheck} fontSize='small' /> : <CheckBoxOutlineBlankRoundedIcon style={{ color: theme.text.quaternary }} onClick={handleToggleCheck} fontSize='small' />}
          />
        </div>
        <div style={{ gridArea: 'discountType' }}>
          <SelectField
            value={type}
            options={typeOption}
            label='Discount Type'
            err={errors?.discount?.type?.message}
            {...register('discount.type')}
          />
        </div>
        <div style={{ gridArea: 'startAt' }}>
          <TextField
            type='datetime-local'
            label='Start At'
            err={errors?.startAt?.message}
            {...register('startAt')}
          />
        </div>
        <div style={{ gridArea: 'expireAt' }}>
          <TextField
            type='datetime-local'
            label='Expire At'
            err={errors?.expireAt?.message}
            {...register('expireAt')}
          />
        </div>
        <div style={{ gridArea: 'durationValue' }}>
          <TextField
            type='number'
            step='any'
            label='Duration Value'
            err={errors?.duration?.value?.message}
            {...register('duration.value')}
          />
        </div>
        <div style={{ gridArea: 'durationUnit' }}>
          <SelectField
            value={watch('duration.unit') || 'month'}
            options={durationOption}
            label='Duration Unit'
            err={errors?.duration?.unit?.message}
            {...register('duration.unit')}
          />
        </div>
        <div style={{ gridArea: 'targetType' }}>
          <SelectField
            value={targetType}
            options={targetOption}
            label='Target Type'
            err={errors?.target?.type?.message}
            onChange={(e) => {
              setTargetType(e.target.value)
              setValue('target.type', e.target.value)
            }}
          />
        </div>
        <div style={{ gridArea: 'note', marginTop: 10 }}>
          <DetailField
            label='Note'
            err={errors?.note?.message}
            {...register('note')}
          />
        </div>
        <div style={{ gridArea: 'description', marginTop: 10, marginBottom: 10 }}>
          <LocaleDetail
            onChange={handleChangeDescription}
            err={errors?.description}
            describe='Description'
            name='description'
            defaultValue={getValues('description')}
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
          <Button variant='contained' style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
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
      </div>
      <div style={{ display: 'grid' }}>
        {targetType === 'product' && (
          <ProductContainer onClickProduct={handleClickProduct} filterSelected={true} selectedProducts={selectedProducts} />
        )}
      </div>
    </form>
  )
}

export default MembershipForm