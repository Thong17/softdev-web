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
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
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
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const { width } = useWeb()
  const { data: listBrand } = useAppSelector(selectListBrand)
  const { data: listCategory } = useAppSelector(selectListCategory)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(defaultValues?.discounts?.type || 'PCT')
  const typeValue = watch('discounts.type')
  const [isFixed, setIsFixed] = useState(defaultValues?.discounts?.isFixed || false)
  const [selectedProducts, setSelectedProducts] = useState<any>(defaultValues?.target?.products || [])
  const [targetType, setTargetType] = useState(defaultValues?.target?.type || 'product')
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(defaultValues?.target?.brands?.[0] || '')
  const [selectedCategory, setSelectedCategory] = useState(defaultValues?.target?.categories?.[0] || '')
  const [brandOptions, setBrandOptions] = useState<any[]>([])
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
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
    } else if (targetType === 'category') {
      setValue('target.products', [])
      setValue('target.categories', selectedCategory ? [selectedCategory] : [])
      setValue('target.brands', [])
    } else if (targetType === 'brand') {
      setValue('target.products', [])
      setValue('target.categories', [])
      setValue('target.brands', selectedBrand ? [selectedBrand] : [])
    }
  }, [selectedProducts, selectedCategory, selectedBrand, targetType, setValue])

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
    setValue('target.type', value)

    if (value === 'product') {
      setProductDialogOpen(true)
    } else {
      setProductDialogOpen(false)
    }
  }

  const handleChangeCategory = (e) => {
    const value = e.target.value
    setSelectedCategory(value)
    setValue('target.categories', value ? [value] : [])
  }

  const handleChangeBrand = (e) => {
    const value = e.target.value
    setSelectedBrand(value)
    setValue('target.brands', value ? [value] : [])
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
            err={errors?.discounts?.value?.message}
            {...register('discounts.value')}
            icon={isFixed ? <CheckBoxRoundedIcon onClick={handleToggleCheck} fontSize='small' /> : <CheckBoxOutlineBlankRoundedIcon style={{ color: theme.text.quaternary }} onClick={handleToggleCheck} fontSize='small' />}
          />
        </div>
        <div style={{ gridArea: 'discountType' }}>
          <SelectField
            value={type}
            options={typeOption}
            label='Discount Type'
            err={errors?.discounts?.type?.message}
            {...register('discounts.type')}
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
            err={errors?.target?.type?.message}
            onChange={handleChangeTargetType}
          />
        </div>
        {targetType === 'category' && (
          <div style={{ gridArea: 'targetSelector' }}>
            <SelectField
              value={selectedCategory}
              options={categoryOptions}
              label='Category'
              err={errors?.target?.categories?.message}
              onChange={handleChangeCategory}
            />
          </div>
        )}
        {targetType === 'brand' && (
          <div style={{ gridArea: 'targetSelector' }}>
            <SelectField
              value={selectedBrand}
              options={brandOptions}
              label='Brand'
              err={errors?.target?.brands?.message}
              onChange={handleChangeBrand}
            />
          </div>
        )}
        {targetType === 'product' && (
          <div style={{ gridArea: 'targetSelector', marginTop: 30, marginBottom: 20 }}>
            <Button variant='outlined' style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => setProductDialogOpen(true)}>
              {selectedProducts.length ? `${selectedProducts.length} selected` : 'Choose products'}
            </Button>
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
          <ProductContainer onClickProduct={handleClickProduct} filterSelected={true} selectedProducts={selectedProducts} />
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