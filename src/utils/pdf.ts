import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export type PaperSize = 'A4' | 'A5'

// Page width in CSS pixels (96 dpi) for laying out a document at its paper size
export const paperWidthPx: Record<PaperSize, number> = { A4: 794, A5: 559 }
export const paperHeightPx: Record<PaperSize, number> = { A4: 1123, A5: 794 }

// Captures an element and saves it as a PDF on A4 or A5 paper. The browser
// draws the text (Khmer included), so the PDF looks exactly like the screen.
// Long documents continue on extra pages.
export const exportElementPdf = async (element: HTMLElement, filename: string, paperSize: PaperSize = 'A4') => {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
  const pdf = new jsPDF('p', 'mm', paperSize.toLowerCase())
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imageHeight = (canvas.height * pageWidth) / canvas.width
  const image = canvas.toDataURL('image/jpeg', 0.95)

  let position = 0
  pdf.addImage(image, 'JPEG', 0, position, pageWidth, imageHeight)
  while (imageHeight + position > pageHeight + 1) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(image, 'JPEG', 0, position, pageWidth, imageHeight)
  }
  pdf.save(filename)
}

// Resolves once every image inside the element has loaded (or failed), so a
// capture or print includes the logo
export const waitForImages = (element: HTMLElement) => Promise.all(
  Array.from(element.querySelectorAll('img')).map((img) => (img.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
      img.onload = resolve
      img.onerror = resolve
    }))),
)
