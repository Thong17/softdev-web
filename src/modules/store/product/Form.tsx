import React, { useEffect, useState } from 'react'
import {
  LocaleField,
  FileField,
  DetailField,
  SelectField,
  TextField,
  CheckboxField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { productSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { IOptions } from 'components/shared/form/SelectField'
import { getListCategory, selectListCategory } from '../category/redux'
import { getListBrand, selectListBrand } from '../brand/redux'
import useLanguage from 'hooks/useLanguage'
import { currencyOptions } from 'constants/variables'
import CropFreeIcon from '@mui/icons-material/CropFree'
import { getListProduct } from './redux'

const statusOptions = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const ProductForm = ({ defaultValues, id }: any) => {
  const { data: listBrand, status: statusListBrand } = useAppSelector(selectListBrand)
  const { data: listCategory, status: statusListCategory } = useAppSelector(selectListCategory)

  const dispatch = useAppDispatch()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(productSchema), defaultValues })
  const { device } = useWeb()
  const { lang } = useLanguage()
  const { loadify, notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(defaultValues.status)
  const [currency, setCurrency] = useState(defaultValues.currency)
  const [categoryOption, setCategoryOption] = useState<IOptions[]>([])
  const [brandOption, setBrandOption] = useState<IOptions[]>([])
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [iconPath, setIconPath] = useState(null)
  const currencyValue = watch('currency')
  const statusValue = watch('status')
  const brandId = watch('brand')
  const categoryId = watch('category')

  useEffect(() => {
    const brand: any = listBrand.find((value: any) => value._id === brandId)
    setBrand(brand?._id || '')
  }, [brandId, listBrand])

  useEffect(() => {
    const category: any = listCategory.find((value: any) => value._id === categoryId)
    setCategory(category?._id || '')
  }, [categoryId, listCategory])

  useEffect(() => {
    const selectedStatus = statusOptions.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  useEffect(() => {
    const selectedCurrency = currencyOptions.find((key) => key.value === currencyValue)
    setCurrency(selectedCurrency?.value)
  }, [currencyValue])

  useEffect(() => {
    if (statusListBrand !== 'INIT') return
    dispatch(getListBrand({}))
  }, [dispatch, statusListBrand])

  useEffect(() => {
    if (statusListCategory !== 'INIT') return
    dispatch(getListCategory({}))
  }, [dispatch, statusListCategory])

  useEffect(() => {
    let brandOptions: IOptions[] = []
    listBrand.forEach((key: any) => {
      brandOptions = [...brandOptions, { label: key.name?.[lang] || key.name?.['English'], value: key._id }]
    })

    setBrandOption(brandOptions)
  }, [listBrand, lang])

  useEffect(() => {
    let categoryOptions: IOptions[] = []
    listCategory.forEach((key: any) => {
      categoryOptions = [...categoryOptions, { label: key.name?.[lang] || key.name?.['English'], value: key._id }]
    })

    setCategoryOption(categoryOptions)
  }, [listCategory, lang])

  const handleChangeProduct = (product) => {
    setValue('name', product)
  }

  const handleChangeProfile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('image', image)
    const response = Axios({
      method: 'POST',
      url: `/shared/upload/image`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    loadify(response)
    response.then((data) => {
      const filename = data.data.data.filename
      const fileId = data.data.data._id
      setValue('profile', fileId)
      setIconPath(filename)
    })
  }

  const handleCheckIsStock = (event) => {
    setValue('isStock', event.target.checked)
  }

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/store/product/update/${id}` : `/store/product/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListProduct({}))
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => {
        console.log(err);
        
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
          device === 'mobile' || device === 'tablet' ? '1fr' : '700px 1fr',
        gridGap: 20,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: `
                              'category category brand brand'
                              'product product product product'
                              'price price price currency'
                              'status code code code'
                              'profile profile profile profile'
                              'description description description description'
                              'isStock isStock isStock isStock'
                              'action action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'category' }}>
          <SelectField
            value={category}
            label='Category'
            options={categoryOption}
            err={errors?.category?.message}
            loading={statusListCategory === 'LOADING' ? true : false}
            {...register('category')}
          />
        </div>
        <div style={{ gridArea: 'brand' }}>
          <SelectField
            value={brand}
            label='Brand'
            options={brandOption}
            err={errors?.brand?.message}
            loading={statusListBrand === 'LOADING' ? true : false}
            {...register('brand')}
          />
        </div>
        <div style={{ gridArea: 'product' }}>
          <LocaleField
            onChange={handleChangeProduct}
            err={errors?.name}
            describe='Product'
            name='name'
            defaultValue={getValues('name')}
          />
        </div>
        <div style={{ gridArea: 'price' }}>
          <TextField
            type='number'
            label='Price'
            err={errors?.price?.message}
            {...register('price')}
          />
        </div>
        <div style={{ gridArea: 'currency' }}>
          <SelectField
            value={currency}
            options={currencyOptions}
            label='Currency'
            err={errors?.currency?.message}
            {...register('currency')}
          />
        </div>
        <div style={{ gridArea: 'status' }}>
          <SelectField
            value={status}
            options={statusOptions}
            label='Status'
            err={errors?.status?.message}
            {...register('status')}
          />
        </div>
        <div style={{ gridArea: 'code' }}>
          <TextField
            type='text'
            label='Code'
            icon={<CropFreeIcon />}
            err={errors?.code?.message}
            {...register('code')}
          />
        </div>
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={200}
            path={iconPath}
            name='profile'
            label='Profile'
            accept='image/png, image/jpeg'
            onChange={handleChangeProfile}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
            {...register('description')}
          />
        </div>
        
        <div style={{ gridArea: 'isStock' }}>
          <CheckboxField label='Is Stock' err={errors?.isStock} name='isStock' value={getValues('isStock')} onChange={handleCheckIsStock} />
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
            {id ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default ProductForm
