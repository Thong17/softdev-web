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
import { useNavigate } from 'react-router-dom'
import { IImage } from 'components/shared/form/UploadField'
import useTheme from 'hooks/useTheme'

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
  } = useForm({ resolver: yupResolver(productSchema), defaultValues: { ...defaultValues, brand: defaultValues?.brand?._id, category: defaultValues?.category?._id } })
  const navigate = useNavigate()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const { loadify, notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(defaultValues?.status)
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const [categoryOption, setCategoryOption] = useState<IOptions[]>([])
  const [brandOption, setBrandOption] = useState<IOptions[]>([])
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [isStock, setIsStock] = useState(defaultValues?.isStock)
  const [imagesPath, setImagesPath] = useState<IImage[]>(defaultValues?.images || [])
  const currencyValue = watch('currency')
  const statusValue = watch('status')
  const brandId = watch('brand')
  const categoryId = watch('category')
  const isStockCheck = watch('isStock')
  const { theme } = useTheme()

  useEffect(() => {
    setIsStock(isStockCheck)
  }, [isStockCheck])

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

  const handleChangeImages = (event) => {
    const images = event.target.files
    
    const formData = new FormData()
    for (let image = 0; image < images.length; image++) {
      formData.append('images', images[image])
    }

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
      const fileIds = data.data.data.map(file => {
        return file._id
      })
      const files: IImage[] = data.data.data.map(file => {
        return { filename: file.filename, _id: file._id }
      })      
      
      !getValues('profile') && setValue('profile', fileIds[0])
      if (imagesPath.length) {
        setValue('images', [...getValues('images'), ...fileIds])
        setImagesPath([ ...imagesPath, ...files ])
      } else {
        setValue('images', fileIds)
        setImagesPath(files)
      }
    })
  }

  const handleDeleteImage = (id) => {
    const newImages = imagesPath.filter((image) => image._id !== id)
    let hasProfile = false
    newImages.forEach(image => {
      if (image._id === getValues('profile')) {
        hasProfile = true
      }
    })

    !hasProfile && setValue('profile', newImages?.[0]?._id)
    setImagesPath(newImages)
    setValue('images', newImages)
  }

  const handleChangeActive = (active) => {
    setValue('profile', active)
  }

  const handleCheckIsStock = (event) => {
    setValue('isStock', event.target.checked)
  }

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/organize/product/update/${id}` : `/organize/product/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(getListProduct({}))
        !id && navigate(`/organize/product/create/property/${data?.data?.data?._id}`)
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
          device === 'mobile' || device === 'tablet' ? '1fr' : '1fr',
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
            search={true}
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
            search={true}
            value={brand}
            label='Brand'
            options={brandOption}
            err={errors?.brand?.message}
            loading={statusListBrand === 'LOADING' ? true : false}
            {...register('brand')}
          />
        </div>
        <div style={{ gridArea: 'product', marginTop: 20, marginBottom: 20 }}>
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
            step='any'
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
            icon={<CropFreeIcon fontSize='small' />}
            err={errors?.code?.message}
            {...register('code')}
          />
        </div>
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={200}
            images={imagesPath}
            name='profile'
            label='Images'
            accept='image/png, image/jpeg'
            multiple
            err={errors?.profile?.message}
            selected={getValues('profile')}
            onChange={handleChangeImages}
            handleDelete={handleDeleteImage}
            handleChangeActive={handleChangeActive}
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
          <CheckboxField label='Is Stock' err={errors?.isStock?.message} name='isStock' checked={isStock} onChange={handleCheckIsStock} />
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
            { id ? 'Save' : 'Create' }
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid' }}></div>
    </form>
  )
}

export default ProductForm
