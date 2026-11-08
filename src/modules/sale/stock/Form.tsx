import Button from 'components/shared/ButtonWrapper'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { stockSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
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
import useAuth from 'hooks/useAuth'
import { currencyFormat, timeFormat } from 'utils'
import { HelperText } from './HelperText'

export const Form = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
  colors,
  properties,
  options,
  product,
  stocks,
  onSaved,
}: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(stockSchema), defaultValues })
  const { guardClose, trackChanges } = useUnsavedChanges({ isDirty, enabled: !!dialog.open })
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { width } = useWeb()
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')
  const { lang } = useLanguage()
  const [optionObj, setOptionObj] = useState(defaultValues?.options || {})
  const [color, setColor] = useState(defaultValues?.color)
  const [isLoading, setIsLoading] = useState(false);
  const colorValue = watch('color')
  const { user } = useAuth()
  // Changing the selling price is a product update
  const canChangePrice = !!user?.privilege?.product?.update
  const newPriceCurrencyValue = watch('newPriceCurrency')
  const costValue = watch('cost')
  const newPriceValue = watch('newPrice')
  // New Price below this batch's cost would sell at a loss; compared in USD
  const rate = user?.drawer?.buyRate || 4000
  const toUSD = (value, valueCurrency) => valueCurrency === 'KHR' ? Number(value) / rate : Number(value)
  const belowCostMsg = (() => {
    if (newPriceValue === '' || newPriceValue === null || newPriceValue === undefined) return ''
    if (costValue === '' || costValue === null || costValue === undefined || isNaN(Number(costValue)) || isNaN(Number(newPriceValue))) return ''
    const priceCurrency = newPriceCurrencyValue || product?.currency || 'USD'
    const costCurrency = currencyValue || 'USD'
    if (toUSD(newPriceValue, priceCurrency) >= toUSD(costValue, costCurrency)) return ''
    // Plain text: currencyFormat returns JSX, which can't go in a message string
    const cost = Number(costValue)
    const costText = costCurrency === 'KHR'
      ? `${Math.round(cost).toLocaleString()}៛`
      : `$${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
    return `Below the cost of ${costText}`
  })()
  // Most recent other batch, as a reference while typing the cost
  const previousStock = [...(stocks || [])]
    .filter((stock: any) => stock._id !== dialog.stockId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

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
    // New Price starts blank, in the product's currency
    reset({ ...defaultValues, newPrice: '', newPriceCurrency: product?.currency || 'USD' })
    let obj = {}
    defaultValues?.options?.forEach((option) => {
      obj = { ...obj, [option?.property?.name?.['English']]: option._id }
    })
    setOptionObj(obj)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setIsLoading(true)
    const { newPrice, newPriceCurrency, ...stock } = data
    const priceChange = canChangePrice && newPrice !== null && newPrice !== undefined
    if (priceChange && belowCostMsg) {
      setIsLoading(false)
      return
    }
    Axios({
      method: dialog.stockId ? 'PUT' : 'POST',
      url: dialog.stockId ? `/sale/stock/update/${dialog.stockId}` : `/sale/stock/create`,
      body: {
        ...stock,
        product: dialog.productId,
        ...(priceChange && { newPrice, newPriceCurrency: newPriceCurrency || product?.currency || 'USD' }),
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.stockId 
          ? dispatch(updateStock(data?.data?.data))
          : dispatch(createStock(data?.data?.data))
        dispatch(getListProduct({}))
        onSaved?.({ priceChanged: priceChange })
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
      .finally(() => setIsLoading(false))
  }

  const handleChangeOption = ({ target: { name, value } }) => {
    setOptionObj({ ...optionObj, [name]: value })
  }
  
  const handleChangeColor = ({ target: { value } }) => {
    setValue('color', value)
  }

  // ✕, Cancel and the backdrop ask before discarding changes; closing after a save does not
  const handleCancelDialog = guardClose(handleCloseDialog)

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCancelDialog}
    >
      <DialogTitle title='Stock Form' onClose={handleCancelDialog} />
      <form
        {...trackChanges}
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'cost cost currency'
                            ${canChangePrice ? "'newPrice newPrice newPriceCurrency'" : ''}
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
          {!errors?.cost && previousStock && (
            <HelperText theme={theme}>
              Previous cost: {currencyFormat(previousStock.cost, previousStock.currency)} · added {timeFormat(previousStock.createdAt, 'YYYY-MM-DD')}
            </HelperText>
          )}
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
        {canChangePrice && (
          <>
            <div style={{ gridArea: 'newPrice' }}>
              <TextField
                type='number'
                step='any'
                label='New Price'
                err={belowCostMsg || errors?.newPrice?.message}
                {...register('newPrice')}
              />
              {!errors?.newPrice && !belowCostMsg && (
                <HelperText theme={theme}>
                  Current price: {product ? currencyFormat(product.price, product.currency) : '--'} · leave blank to keep it
                </HelperText>
              )}
            </div>
            <div style={{ gridArea: 'newPriceCurrency' }}>
              <SelectField
                value={newPriceCurrencyValue || product?.currency || 'USD'}
                options={currencyOptions}
                label='Currency'
                {...register('newPriceCurrency')}
              />
            </div>
          </>
        )}
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
            onClick={handleCancelDialog}
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
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
