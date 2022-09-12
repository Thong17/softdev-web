import Barcode from 'react-barcode-reader'

export const BarcodeReader = ({ onScan, onError }) => {
  const handleScan = (data) => {
    onScan(data)
  }
  const handleError = (err) => {
    onError(err)
  }

  return <Barcode onError={handleError} onScan={handleScan} />
}
