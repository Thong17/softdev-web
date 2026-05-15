import React, { useEffect, useState } from 'react'
import {
  SelectField,
  TextField,
  DetailField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import { useForm } from 'react-hook-form'
import { membershipSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListMembership } from './redux'
import { LocaleField } from 'components/shared/form/LocaleField'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { useNavigate } from 'react-router-dom'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { getListBrand, selectListBrand } from '../brand/redux'
import { getListCategory, selectListCategory } from '../category/redux'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useWeb from 'hooks/useWeb'

const discountTypeOption = [
  {
    value: 'percentage',
    label: 'Percentage',
  },
  {
    value: 'fixed',
    label: 'Fixed',
  },
]

const targetOption = [
  { value: 'product', label: 'Product' },
  { value: 'category', label: 'Category' },
  { value: 'brand', label: 'Brand' },
]

const getLegacyTargets = (targetFromLegacy: any) => {
  if (!targetFromLegacy) return []

  switch (targetFromLegacy.type) {
    case 'product':
      return targetFromLegacy.products || []
    case 'category':
      return targetFromLegacy.categories || []
    case 'brand':
      return targetFromLegacy.brands || []
    default:
      return []
  }
}

const normalizeDefaultValues = (values: any = {}) => {
  const rawDiscounts = values?.discounts
  let discount = {} as any

  if (rawDiscounts && typeof rawDiscounts === 'object') {
    if (rawDiscounts.type || rawDiscounts.discountType || rawDiscounts.value !== undefined) {
      discount = rawDiscounts
    } else {
      const firstKey = Object.keys(rawDiscounts)[0]
      discount = firstKey ? rawDiscounts[firstKey] : {}
    }
  }

  const targetFromLegacy = values?.target
  let targets: string[] = []

  if (Array.isArray(discount?.target)) {
    targets = discount.target
  } else if (typeof discount?.target === 'string' && discount.target) {
    targets = [discount.target]
  } else {
    targets = getLegacyTargets(targetFromLegacy)
  }

  return {
    description: values?.description || {},
    discounts: {
      0: {
        type: discount?.type || targetFromLegacy?.type || 'product',
        target: targets,
        discountType: discount?.discountType || 'percentage',
        value: discount?.value ?? 0,
      },
    },
    note: values?.note || '',
    startAt: values?.startAt || '',
    expireAt: values?.expireAt || '',
    isActive: values?.isActive ?? true,
  }
}

const MembershipForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const normalizedDefaultValues = normalizeDefaultValues(defaultValues)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<any>({ resolver: yupResolver(membershipSchema), defaultValues: normalizedDefaultValues })
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const { width } = useWeb()
  const { data: listBrand } = useAppSelector(selectListBrand)
  const { data: listCategory } = useAppSelector(selectListCategory)
  const [loading, setLoading] = useState(false)
  const [targetType, setTargetType] = useState(normalizedDefaultValues.discounts?.[0]?.type || 'product')
  const [discountType, setDiscountType] = useState(normalizedDefaultValues.discounts?.[0]?.discountType || 'percentage')
  const [selectedTarget, setSelectedTarget] = useState<string[]>(normalizedDefaultValues.discounts?.[0]?.target || [])
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [brandOptions, setBrandOptions] = useState<any[]>([])
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    register('discounts.0.type')
    register('discounts.0.discountType')
    register('discounts.0.target')
  }, [register])

  useEffect(() => {
    setValue('discounts.0.type', targetType)
    setValue('discounts.0.discountType', discountType)
    setValue('discounts.0.target', selectedTarget)
  }, [targetType, discountType, selectedTarget, setValue])

  useEffect(() => {
    dispatch(getListBrand({}))
      .catch(console.error)

    dispatch(getListCategory({}))
      .catch(console.error)
  }, [dispatch])

  useEffect(() => {
    setBrandOptions(
      listBrand?.map((item: any) => ({
        label: item.name?.[lang] || item.name?.['English'],
        value: item._id,
      })) || []
    )
  }, [listBrand, lang])

  useEffect(() => {
    setCategoryOptions(
      listCategory?.map((item: any) => ({
        label: item.name?.[lang] || item.name?.['English'],
        value: item._id,
      })) || []
    )
  }, [listCategory, lang])

  const handleChangeTargetType = (e) => {
    const value = e.target.value
    setTargetType(value)
    setSelectedTarget([])
    setProductDialogOpen(value === 'product')
  }

  const handleChangeCategory = (e) => {
    const value = e.target.value
    setSelectedTarget(value ? [value] : [])
  }

  const handleChangeBrand = (e) => {
    const value = e.target.value
    setSelectedTarget(value ? [value] : [])
  }

  const handleChangeDescription = (description) => {
    setValue('description', description)
  }

  const handleClickProduct = (id) => {
    setSelectedTarget((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
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
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridColumnGap: 20,
          height: 'fit-content',
          marginTop: 20,
          gridTemplateAreas: `
                              'description description description description'
                              'discountType discountValue startAt expireAt'
                              'targetType targetSelector targetSelector targetSelector'
                              'note note note note'
                              'action action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'description', marginTop: 20, marginBottom: 20 }}>
          <LocaleField
            onChange={handleChangeDescription}
            err={errors?.description}
            describe='Description'
            name='description'
            defaultValue={getValues('description')}
          />
        </div>
        <div style={{ gridArea: 'discountValue' }}>
          <TextField
            type='number'
            step='any'
            label='Discount Value'
            err={errors?.discounts?.[0]?.value?.message}
            {...register('discounts.0.value')}
          />
        </div>
        <div style={{ gridArea: 'discountType' }}>
          <SelectField
            value={discountType}
            options={discountTypeOption}
            label='Discount Mode'
            err={errors?.discounts?.[0]?.discountType?.message}
            onChange={(e) => setDiscountType(e.target.value)}
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
        <div style={{ gridArea: 'targetType' }}>
          <SelectField
            value={targetType}
            options={targetOption}
            label='Target Type'
            err={errors?.discounts?.[0]?.type?.message}
            onChange={handleChangeTargetType}
          />
        </div>
        {targetType === 'category' && (
          <div style={{ gridArea: 'targetSelector' }}>
            <SelectField
              value={selectedTarget}
              options={categoryOptions}
              label='Category'
              err={errors?.discounts?.[0]?.target?.message}
              onChange={handleChangeCategory}
            />
          </div>
        )}
        {targetType === 'brand' && (
          <div style={{ gridArea: 'targetSelector' }}>
            <SelectField
              value={selectedTarget}
              options={brandOptions}
              label='Brand'
              err={errors?.discounts?.[0]?.target?.message}
              onChange={handleChangeBrand}
            />
          </div>
        )}
        {targetType === 'product' && (
          <div style={{ gridArea: 'targetSelector', marginTop: 30, marginBottom: 20 }}>
            <Button variant='outlined' style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => setProductDialogOpen(true)}>
              {selectedTarget.length ? `${selectedTarget.length} selected` : 'Choose products'}
            </Button>
            {errors?.discounts?.[0]?.target?.message && (
              <div style={{ color: theme.color.error, fontSize: 12, marginTop: 6 }}>
                {errors?.discounts?.[0]?.target?.message}
              </div>
            )}
          </div>
        )}
        <div style={{ gridArea: 'note' }}>
          <DetailField
            label='Note'
            err={errors?.note?.message}
            style={{ height: 70 }}
            {...register('note')}
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
      <AlertDialog isOpen={productDialogOpen} handleClose={() => setProductDialogOpen(false)}>
        <DialogTitle title="Select Product" onClose={() => setProductDialogOpen(false)} />
        <DialogContent style={{ width: width < 1024 ? '80vw' : '70vw', height: '70vh' }}>
          <ProductContainer onClickProduct={handleClickProduct} filterSelected={true} selectedProducts={selectedTarget} />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' style={{ marginRight: 10 }} onClick={() => setProductDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </AlertDialog>
    </form>
  )
}

export default MembershipForm