import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { stockSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  SelectField,
  TextField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { currencyOptions } from 'constants/variables'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { updateStock, createStock } from './redux'
import { useAppDispatch } from 'app/hooks'
import { Section } from 'components/shared/Section'
import useLanguage from 'hooks/useLanguage'
import { DialogTitle } from 'components/shared/DialogTitle'
import { getListProduct } from 'modules/organize/product/redux'

export const Form = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
  colors,
  properties,
  options,
}: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(stockSchema), defaultValues })
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { width } = useWeb()
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')
  const { lang } = useLanguage()
  const [optionObj, setOptionObj] = useState(defaultValues?.options || {})
  const [color, setColor] = useState(defaultValues?.color)
  const colorValue = watch('color')

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

  useEffect(() => {
    const selectedColor = colors.find(
      (key) => key._id === colorValue
    )

    setColor(selectedColor?._id || '')
  }, [colorValue, colors])

  useEffect(() => {
    reset(defaultValues)
    let obj = {}
    defaultValues?.options?.forEach((option) => {
      obj = { ...obj, [option?.property?.name?.['English']]: option._id }
    })
    setOptionObj(obj)
  }, [defaultValues, reset])

  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  useEffect(() => {
    const selectedOption = Object.keys(optionObj).map((option) => {
      return optionObj[option]
    })
    setValue('options', selectedOption)
  }, [optionObj, setValue])

  const submit = (data) => {
    Axios({
      method: dialog.stockId ? 'PUT' : 'POST',
      url: dialog.stockId ? `/sale/stock/update/${dialog.stockId}` : `/sale/stock/create`,
      body: {
        ...data,
        product: dialog.productId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.stockId 
          ? dispatch(updateStock(data?.data?.data))
          : dispatch(createStock(data?.data?.data))
        dispatch(getListProduct({}))
        handleCloseDialog()
        setOptionObj({})
        reset()
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleChangeOption = ({ target: { name, value } }) => {
    setOptionObj({ ...optionObj, [name]: value })
  }
  
  const handleChangeColor = ({ target: { value } }) => {
    setValue('color', value)
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <DialogTitle title='Stock Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'cost cost currency'
                            'quantity code code'
                            'expireAt expireAt alertAt'
                            'option option option'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'cost' }}>
          <TextField
            type='number'
            step='any'
            label='Cost'
            err={errors?.cost?.message}
            {...register('cost')}
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
        <div style={{ gridArea: 'quantity' }}>
          <TextField
            type='number'
            step='any'
            label='Quantity'
            err={errors?.quantity?.message}
            {...register('quantity')}
          />
        </div>
        <div style={{ gridArea: 'code' }}>
          <TextField
            type='text'
            label='Code'
            err={errors?.code?.message}
            {...register('code')}
          />
        </div>
        <div style={{ gridArea: 'expireAt' }}>
          <TextField
            type='date'
            label='Expire Date'
            err={errors?.expireAt?.message}
            {...register('expireAt')}
          />
        </div>
        <div style={{ gridArea: 'alertAt' }}>
          <TextField
            type='number'
            step='any'
            label='Alert At'
            err={errors?.alertAt?.message}
            {...register('alertAt')}
          />
        </div>
        <div style={{ gridArea: 'option' }}>
          <Section describe='Option' style={{ marginTop: 20 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
                gridColumnGap: 20,
              }}
            >
              <SelectField
                search={true}
                name='Color'
                value={color}
                options={colors.map((color) => {
                  return { value: color?._id, label: color?.name?.[lang] || color?.name?.['English'] }
                })}
                label='Color'
                onChange={handleChangeColor}
              />              
              {properties?.map((property, index) => {
                let menuItems: any = []

                options.forEach((option) => {
                  if (option.property === property._id) {
                    menuItems = [ ...menuItems, { value: option?._id, label: option?.name?.[lang] || option?.name?.['English'] }]
                  }
                })
                
                return (
                  <SelectField
                    search={true}
                    name={property?.name?.['English']}
                    key={index}
                    value={optionObj[property?.name?.['English']] || ''}
                    options={menuItems}
                    label={property?.name?.[lang] || property?.name?.['English']}
                    onChange={handleChangeOption}
                  />
                )
              })}
            </div>
          </Section>
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end', marginTop: 20 }}>
          <Button
            onClick={handleCloseDialog}
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            { dialog.stockId ? 'Update' : 'Create' }
          </Button>
        </div>
      </form>
    </AlertDialog>
  )
}
