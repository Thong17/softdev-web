import React, { useEffect, useState } from 'react'
import {
  SelectField,
  TextField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { promotionSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useAppDispatch } from 'app/hooks'
import { getListPromotion } from './redux'
import { LocaleDetail } from 'components/shared/form/LocaleField'
import { currencyOptions } from 'constants/variables'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import useTheme from 'hooks/useTheme'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { useNavigate } from 'react-router-dom'

const typeOption = [
  ...currencyOptions,
  {
    value: 'PCT',
    label: 'Percent',
  },
]

const PromotionForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(promotionSchema), defaultValues })
  const { device } = useWeb()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(defaultValues?.type || '')
  const typeValue = watch('type')
  const [isFixed, setIsFixed] = useState(defaultValues?.isFixed || false)
  const [selectedProducts, setSelectedProducts] = useState<any>(defaultValues.products || [])
  const navigate = useNavigate()

  useEffect(() => {
    const selectedType = typeOption.find((key) => key.value === typeValue)
    setType(selectedType?.value || '')
  }, [typeValue])

  useEffect(() => {
    setValue('products', selectedProducts)
  }, [selectedProducts, setValue])

  const handleChangePromotion = (promotion) => {
    setValue('description', promotion)
  }

  const handleClickProduct = (id) => {
    if (!selectedProducts.includes(id)) return setSelectedProducts(prev => [...prev, id])
    setSelectedProducts(prev => prev.filter(item => item !== id))
  }

  const handleToggleCheck = () => {
    setIsFixed(!isFixed)
    setValue('isFixed', !isFixed)
  }

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/function/promotion/update/${id}` : `/function/promotion/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListPromotion({}))
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
                              'value value value type'
                              'startAt startAt expireAt expireAt'
                              'description description description description'
                              'action action action action'
                              `,
        }}
      >
        <div style={{ gridArea: 'value' }}>
          <TextField
            type='number'
            step='any'
            label='Value'
            err={errors?.value?.message}
            {...register('value')}
            icon={ isFixed ? <CheckBoxRoundedIcon onClick={handleToggleCheck} fontSize='small' /> : <CheckBoxOutlineBlankRoundedIcon style={{ color: theme.text.quaternary }} onClick={handleToggleCheck} fontSize='small' />}
          />
        </div>
        <div style={{ gridArea: 'type' }}>
          <SelectField
            value={type}
            options={typeOption}
            label='Type'
            err={errors?.type?.message}
            {...register('type')}
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
        <div style={{ gridArea: 'description', marginTop: 30, marginBottom: 20 }}>
          <LocaleDetail
            onChange={handleChangePromotion}
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
        <ProductContainer onClickProduct={handleClickProduct} filterSelected={true} selectedProducts={selectedProducts} promotionId={id} />
      </div>
    </form>
  )
}

export default PromotionForm
