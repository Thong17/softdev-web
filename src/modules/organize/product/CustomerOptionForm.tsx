import { CustomButton } from 'styles'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { customerOptionSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import {
  DetailField,
  LocaleField,
  SelectField,
  TextField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { currencyOptions } from 'constants/variables'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { updateCustomerOption, createCustomerOption } from './redux'
import { useAppDispatch } from 'app/hooks'
import { DialogTitle } from 'components/shared/DialogTitle'

export const CustomerOptionForm = ({ dialog, setDialog, defaultValues, theme }: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(customerOptionSchema), defaultValues })
  const { guardClose, trackChanges } = useUnsavedChanges({ isDirty, enabled: !!dialog.open })
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { width, device } = useWeb()
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, customerId: null, open: false })
  }

  const submit = (data) => {
    delete data.imagesPath
    Axios({
      method: dialog.customerId ? 'PUT' : 'POST',
      url: dialog.customerId
        ? `/organize/product/customer/update/${dialog.customerId}`
        : `/organize/product/customer/create`,
      body: {
        ...data,
        product: dialog.productId,
      },
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dialog.customerId
          ? dispatch(updateCustomerOption(data?.data?.data))
          : dispatch(createCustomerOption(data?.data?.data))

        handleCloseDialog()
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

  // ✕, Cancel and the backdrop ask before discarding changes; closing after a save does not
  const handleCancelDialog = guardClose(handleCloseDialog)

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCancelDialog}>
      <DialogTitle title='Customer Option Form' onClose={handleCancelDialog} />
      <form
        {...trackChanges}
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas:
            device === 'mobile'
              ? `
                              'customer customer customer'
                              'price price price'
                              'currency currency currency'
                              'code code code'
                              'profile profile profile'
                              'description description description'
                              'action action action'
                            `
              : `
                              'customer customer customer'
                              'price currency code'
                              'profile profile profile'
                              'description description description'
                              'action action action'
                            `,
        }}
      >
        <div style={{ gridArea: 'customer' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Option'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
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
        <div style={{ gridArea: 'code' }}>
          <TextField
            type='text'
            label='Code'
            err={errors?.code?.message}
            {...register('code')}
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
        <div
          style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}
        >
          <CustomButton
            styled={theme}
            onClick={handleCancelDialog}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            styled={theme}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            {dialog.customerId ? 'Update' : 'Create'}
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
