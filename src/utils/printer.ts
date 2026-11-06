import * as qz from 'qz-tray'
import Axios from 'constants/functions/Axios'

// The API builds every print job from the store's printer settings. The store's
// print mode decides who sends it to the printer:
// - `api`: the API prints through QZ Tray on its host machine
// - `web`: the API returns the jobs and this browser prints them through the
//   QZ Tray installed on this device

export type LabelData = {
  items: { description: string, hasThermalPrinting: boolean, qty: number, options: { name: string, value: string }[] }[]
  createdAt: string
  invoice: string
}

export type ReceiptTransaction = {
  item?: string;
  qty?: number;
  disc?: string;
  price?: string;
  total?: string;
  options?: { name: string, value: string }[]
};

export type ReceiptData = {
  name?: string;
  invoice?: string;
  cashier?: string;
  createdAt?: string;
  transactions?: ReceiptTransaction[];
  subtotal?: string;
  discount?: string;
  tax?: string;
  voucher?: string;
  total?: string;
  address?: string;
  footer?: string;
  paymentMethod?: string;
  table?: string
};

// `receipt` is the customer receipt printer, `store` the narrow store copy printer
export type ReceiptTarget = 'receipt' | 'store'

type PrintResult = {
  mode: 'web' | 'api'
  printer?: string
  jobs?: string[]
  options?: Record<string, any>
}

let qzConnecting: Promise<void> | null = null

// Certificate and signature come from the API so the private key stays on the server
const connectQzTray = async () => {
  if (qz.websocket.isActive()) return
  if (!qzConnecting) {
    qz.security.setCertificatePromise((resolve, reject) => {
      Axios({ method: 'GET', url: '/sale/print/certificate' })
        .then(res => resolve(res.data.data.certificate))
        .catch(reject)
    })
    qz.security.setSignatureAlgorithm('SHA512')
    qz.security.setSignaturePromise((toSign) => (resolve, reject) => {
      Axios({ method: 'POST', url: '/sale/print/sign', body: { data: toSign } })
        .then(res => resolve(res.data.data.signature))
        .catch(reject)
    })
    qzConnecting = qz.websocket.connect()
      .catch(() => { throw new Error('QZ Tray is not running on this device') })
      .finally(() => { qzConnecting = null })
  }
  await qzConnecting
}

const printOnDevice = async ({ printer, jobs = [], options }: PrintResult) => {
  if (!jobs.length) return
  await connectQzTray()
  const config = qz.configs.create(printer, options)
  for (const job of jobs) {
    await qz.print(config, [job])
  }
}

const print = async (url: string, body: any) => {
  let result: PrintResult
  try {
    const res = await Axios({ method: 'POST', url, body })
    result = res?.data?.data
  } catch (err: any) {
    throw new Error(err?.response?.data?.msg || err.message)
  }
  if (result?.mode === 'web') await printOnDevice(result)
}

export const printLabel = (data: LabelData) =>
  print('/sale/print/label', { data })

export const printReceipt = (data: ReceiptData, target: ReceiptTarget = 'receipt') =>
  print('/sale/print/receipt', { data, target })

export const printGroupReceipt = (data: ReceiptData[], payment: ReceiptData, target: ReceiptTarget = 'receipt') =>
  print('/sale/print/group-receipt', { data, payment, target })
