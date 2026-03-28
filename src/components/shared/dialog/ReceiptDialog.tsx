import { AlertContainer } from '../container/AlertContainer'
import useLanguage from 'hooks/useLanguage'
import { DialogTitle } from '../DialogTitle'
import { useEffect, useRef, useState } from 'react'
import {
    TextField,
    FileField,
    DetailField,
    SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { IImage } from 'components/shared/form/UploadField'
import { InvoiceContainer } from 'components/shared/container/InvoiceContainer'
import useTheme from 'hooks/useTheme'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import { storeSchema } from 'modules/organize/store/schema'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import { PaymentReceipt } from '../invoice/PaymentReceipt'
import { useReactToPrint } from 'react-to-print'
import { networkPrinting } from 'api/receipt.api'
import { fontOption } from 'modules/organize/store/Form'
import { currencyFormat, timeFormat } from 'utils/index'
import { CustomButton } from 'styles/index'


const invoiceOption = [
    { label: 'Receipt', value: 'receipt' },
    { label: 'Delivery', value: 'delivery' },
]

const printOption = [
    { label: 'Web Printing', value: 'web_printing' },
    { label: 'Direct Printing', value: 'direct_printing' },
]

const ReceiptDialog = ({ dialog, setDialog, defaultValues }: any) => {
    const { language } = useLanguage()
    const {
        watch,
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({ resolver: yupResolver(storeSchema), defaultValues })
    const { theme } = useTheme()
    const { loadify } = useNotify()
    const [iconPath, setIconPath] = useState<IImage>(defaultValues?.logo)
    const [preview, setPreview] = useState({
        ...defaultValues,
        logo: defaultValues?.logo?.filename,
    })
    const [isLoading, setIsLoading] = useState(false);
    const name = watch('name')
    const address = watch('address')
    const contact = watch('contact')
    const tax = watch('tax')
    const other = watch('other')

    const [font, setFont] = useState(defaultValues?.font)
    const [invoiceType, setInvoiceType] = useState<any>('receipt')
    const [printType, setPrintType] = useState<any>('direct_printing')
    const fontValue = watch('font')

    useEffect(() => {
        const selectedStatus: any = fontOption.find(
            (key) => key.value === fontValue,
        )
        setPreview((prev) => ({ ...prev, font: selectedStatus?.value }))
        setFont(selectedStatus?.value)
    }, [fontValue])

    useEffect(() => {
        setPreview((prev) => ({ ...prev, name, address, contact, tax, other }))
    }, [name, address, contact, tax, other])

    const handleChangeFile = (event) => {
        const image = event.target.files[0]
        const formData = new FormData()
        formData.append('icon', image)
        const response = Axios({
            method: 'POST',
            url: `/shared/upload/icon`,
            body: formData,
            headers: {
                'content-type': 'multipart/form-data',
            },
        })
        loadify(response)
        response.then((data) => {
            const file: IImage = data.data.data as IImage
            const fileId = data.data.data._id
            setValue('logo', fileId)
            setIconPath(file)
            setPreview((prev) => ({ ...prev, logo: file?.filename }))
        })
    }

    const invoiceRef = useRef(document.createElement('div'))
    const handlePrintInvoice = useReactToPrint({
        content: () => invoiceRef?.current,
        documentTitle: 'Invoice',
    })

    const handlePrint = () => {
        if (printType === 'direct_printing') {
            setIsLoading(true)
            networkPrinting({
                name: name,
                invoice: dialog.payment?.invoice,
                cashier: dialog.payment?.createdBy?.username,
                createdAt: timeFormat(dialog.payment?.createdAt),
                transactions: dialog.payment?.transactions?.map(item => ({
                    item: item.description,
                    qty: item.quantity,
                    disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
                    price: currencyFormat(item.price, item.currency, 0, true),
                })),
                subtotal: currencyFormat(dialog.payment?.subtotal?.USD, 'USD', 0, true),
                discount: currencyFormat(dialog.payment?.discounts[0]?.value, dialog.payment?.discounts[0]?.type, 0, true) + (dialog.payment?.discounts[0]?.isFixed ? ' Fixed' : ''),
                tax: currencyFormat(dialog.payment?.services[0]?.value, dialog.payment?.services[0]?.type, 0, true),
                total: currencyFormat(dialog.payment?.total?.value, dialog.payment?.total?.currency, 0, true),
                address: address,
                footer: other
            })
                .then(console.log)
                .catch(handlePrintInvoice)
                .finally(() => setIsLoading(false))
        } else {
            handlePrintInvoice()
        }
    }

    return (
        <AlertContainer
            justify='center'
            isOpen={dialog.open}
            handleClose={() => setDialog({ ...dialog, open: false })}
            overflow='hidden'
        >
            <div
                style={{
                    width: 'calc(70vw - 64px)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DialogTitle
                    title={language['RECEIPT']}
                    onClose={() => setDialog({ ...dialog, open: false })}
                />
                <div
                    style={{
                        padding: '10px 20px 20px 20px',
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        gap: 30,
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        <form
                            onSubmit={handleSubmit((data) => console.log(data))}
                            style={{
                                height: 'fit-content',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gridColumnGap: 20,
                                    gridTemplateAreas: `
                                        'name name contact'
                                        'type logo logo'
                                        'font font tax'
                                        'address address address'
                                        'other other other'
                                        'action action action'
                                        `,
                                }}
                            >
                                <div style={{ gridArea: 'name' }}>
                                    <TextField
                                        type='text'
                                        label='Name'
                                        err={errors?.name?.message}
                                        {...register('name')}
                                    />
                                </div>
                                <div style={{ gridArea: 'contact' }}>
                                    <TextField
                                        type='text'
                                        label='Contact'
                                        err={errors?.contact?.message}
                                        {...register('contact')}
                                    />
                                </div>
                                <div style={{ gridArea: 'type' }}>
                                    <TextField
                                        type='text'
                                        label='Type'
                                        err={errors?.type?.message}
                                        {...register('type')}
                                    />
                                </div>
                                <div style={{ gridArea: 'logo' }}>
                                    <FileField
                                        images={iconPath && [iconPath]}
                                        selected={getValues('logo')?._id}
                                        name='logo'
                                        label='Logo'
                                        accept='image/png, image/jpeg'
                                        onChange={handleChangeFile}
                                    />
                                </div>
                                <div style={{ gridArea: 'font' }}>
                                    <SelectField
                                        value={font}
                                        options={fontOption}
                                        label='Font'
                                        err={errors?.font?.message}
                                        {...register('font')}
                                    />
                                </div>
                                <div style={{ gridArea: 'tax' }}>
                                    <TextField
                                        icon={
                                            <PercentRoundedIcon fontSize='small' />
                                        }
                                        min={0}
                                        max={100}
                                        type='number'
                                        label='Tax'
                                        err={errors?.tax?.message}
                                        {...register('tax')}
                                    />
                                </div>
                                <div style={{ gridArea: 'address' }}>
                                    <DetailField
                                        type='text'
                                        label='Address'
                                        style={{ height: 70 }}
                                        {...register('address')}
                                    />
                                </div>
                                <div style={{ gridArea: 'other' }}>
                                    <DetailField
                                        type='text'
                                        label='Footer'
                                        style={{ height: 70 }}
                                        {...register('other')}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div
                        style={{
                            height: '100%',
                            minWidth: '5 00px',
                            position: 'relative',
                        }}
                    >
                        <SelectField
                            value={invoiceType}
                            options={invoiceOption}
                            label='Invoice Type'
                            err={errors?.invoiceType?.message}
                            onChange={(e) => {
                                setInvoiceType(e.target.value)
                            }}
                        />
                        <InvoiceContainer
                            name={preview?.name}
                            address={preview?.address}
                            contact={preview?.contact}
                            logo={preview?.logo || 'default.png'}
                            tax={preview?.tax}
                            font={preview?.font}
                            footer={preview?.other}
                            hasThermalBorder={false}
                            padding='0 0 20px 0'
                            rows={dialog.listTransactions}
                            subtotal={dialog.payment?.subtotal}
                            invoice={dialog.payment?.invoice}
                            createdBy={dialog.payment?.createdBy?.username}
                            createdAt={dialog.payment?.createdAt}
                        />
                        <div style={{ display: 'flex', gap: 10, height: 36, justifyContent: 'end', width: '100%', position: 'relative' }}>
                            <SelectField
                                value={printType}
                                options={printOption}
                                err={errors?.printType?.message}
                                onChange={(e) => {
                                    setPrintType(e.target.value)
                                }}
                                style={{ width: '200px', position: 'absolute', top: 0, right: 0 }}
                            />
                            <CustomButton
                                isLoading={isLoading}
                                variant='contained'
                                style={{
                                    backgroundColor: `${theme.color.info}22`,
                                    color: theme.color.info,
                                }}
                                styled={theme}
                                onClick={handlePrint}
                            >
                                <PrintRoundedIcon
                                    style={{ fontSize: 19, marginRight: 5 }}
                                />
                                {language['PRINT']}
                            </CustomButton>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'absolute', top: '200%', width: '100%' }}>
                    <div ref={invoiceRef}>
                        {dialog.payment && <PaymentReceipt payment={dialog.payment} />}
                    </div>
                </div>
            </div>
        </AlertContainer>
    )
}

export default ReceiptDialog
