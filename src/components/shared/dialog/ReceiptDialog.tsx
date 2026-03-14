import { AlertContainer } from '../container/AlertContainer'
import useLanguage from 'hooks/useLanguage'
import { DialogTitle } from '../DialogTitle'
import { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { storeSchema } from 'modules/organize/store/schema'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'

const fontOption = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Sans Serif', value: 'sans-serif' },
    { label: 'Hanuman', value: 'Hanuman' },
    { label: 'PTSans', value: 'PTSans' },
]

const invoiceOption = [
    { label: 'Invoice', value: 'invoice' },
    { label: 'Delivery Note', value: 'delivery' },
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
    const navigate = useNavigate()
    const { loadify } = useNotify()
    const [loading, setLoading] = useState(false)
    const [iconPath, setIconPath] = useState<IImage>(defaultValues?.logo)
    const [preview, setPreview] = useState({
        ...defaultValues,
        logo: defaultValues?.logo?.filename,
    })
    const name = watch('name')
    const address = watch('address')
    const contact = watch('contact')
    const tax = watch('tax')
    const other = watch('other')

    const [font, setFont] = useState(defaultValues?.font)
    const [invoiceType, setInvoiceType] = useState(defaultValues?.invoiceType)
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

    return (
        <AlertContainer
            justify='start'
            isOpen={dialog.open}
            handleClose={() => setDialog({ open: false })}
        >
            <div
                style={{
                    height: '100vh',
                    width: 'calc(100vw - 64px)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DialogTitle
                    title={language['RECEIPT']}
                    onClose={() => setDialog({ open: false })}
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
                            {...register('invoiceType')}
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
                        />
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                variant='contained'
                                style={{
                                    backgroundColor: `${theme.color.info}22`,
                                    color: theme.color.info,
                                    width: '50%'
                                }}
                            >
                                <PrintRoundedIcon
                                    style={{ fontSize: 19, marginRight: 5 }}
                                />
                                {language['PRINT']}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AlertContainer>
    )
}

export default ReceiptDialog
