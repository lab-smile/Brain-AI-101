import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

const PDF_TEMPLATE_PATH = path.join(
  process.cwd(),
  'certificate',
  'BrainxAI_101_Certificate_Template.pdf',
)

const TEXT_COLOR = rgb(0.13, 0.11, 0.09)
const WHITE = rgb(1, 1, 1)

const RECIPIENT_RECT = {
  x: 238,
  y: 356,
  width: 320,
  height: 44,
}

const ISSUE_MONTH_RECT = {
  x: 108,
  y: 147,
  width: 78,
  height: 15,
}

const ISSUE_YEAR_RECT = {
  x: 114,
  y: 135,
  width: 64,
  height: 15,
}

const ISSUE_MONTH_TEXT_RECT = {
  x: 82,
  y: 144,
  width: 132,
  height: 22,
}

const ISSUE_YEAR_TEXT_RECT = {
  x: 82,
  y: 131,
  width: 132,
  height: 24,
}

export interface CertificateTemplateValues {
  recipientName: string
  issueMonth: string
  issueYear: string
}

export function normalizeRecipientName(value: string) {
  return value.trim().replace(/\s+/g, ' ').replace(/\{\{[^}]*\}\}/g, '')
}

function fitFontSize(font: PDFFont, text: string, maxWidth: number, preferredSize: number, minSize: number) {
  let fontSize = preferredSize

  while (fontSize > minSize && font.widthOfTextAtSize(text, fontSize) > maxWidth) {
    fontSize -= 1
  }

  return fontSize
}

function clearPlaceholder(page: PDFPage, rect: typeof RECIPIENT_RECT) {
  page.drawRectangle({
    ...rect,
    color: WHITE,
    borderWidth: 0,
  })
}

function drawCenteredText({
  page,
  text,
  font,
  rect,
  preferredSize,
  minSize,
}: {
  page: PDFPage
  text: string
  font: PDFFont
  rect: typeof RECIPIENT_RECT
  preferredSize: number
  minSize: number
}) {
  const fontSize = fitFontSize(font, text, rect.width - 12, preferredSize, minSize)
  const textWidth = font.widthOfTextAtSize(text, fontSize)
  const textHeight = font.heightAtSize(fontSize)

  page.drawText(text, {
    x: rect.x + (rect.width - textWidth) / 2,
    y: rect.y + (rect.height - textHeight) / 2 + 1,
    size: fontSize,
    font,
    color: TEXT_COLOR,
  })
}

export async function generateCertificateDocument(values: CertificateTemplateValues): Promise<{
  buffer: Buffer
  mimeType: string
  extension: 'pdf'
}> {
  const templateBytes = await readFile(PDF_TEMPLATE_PATH)
  const pdfDoc = await PDFDocument.load(templateBytes)
  const [page] = pdfDoc.getPages()

  if (!page) {
    throw new Error('Certificate PDF template is missing a page.')
  }

  const nameFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const dateFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const recipientName = normalizeRecipientName(values.recipientName)
  const issueMonth = values.issueMonth.toUpperCase()
  const issueYear = values.issueYear

  clearPlaceholder(page, RECIPIENT_RECT)
  clearPlaceholder(page, ISSUE_MONTH_RECT)
  clearPlaceholder(page, ISSUE_YEAR_RECT)

  drawCenteredText({
    page,
    text: recipientName,
    font: nameFont,
    rect: RECIPIENT_RECT,
    preferredSize: 32,
    minSize: 18,
  })

  drawCenteredText({
    page,
    text: issueMonth,
    font: dateFont,
    rect: ISSUE_MONTH_TEXT_RECT,
    preferredSize: 15,
    minSize: 9,
  })

  drawCenteredText({
    page,
    text: issueYear,
    font: dateFont,
    rect: ISSUE_YEAR_TEXT_RECT,
    preferredSize: 16,
    minSize: 10,
  })

  const pdfBytes = await pdfDoc.save()

  return {
    buffer: Buffer.from(pdfBytes),
    mimeType: 'application/pdf',
    extension: 'pdf',
  }
}

export function buildCertificateFilename(recipientName: string, extension = 'pdf') {
  const safeName = recipientName.replace(/[^\w-]+/g, '_').slice(0, 60) || 'recipient'
  return `BrainxAI_101_Certificate_${safeName}.${extension}`
}
