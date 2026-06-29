import { existsSync } from 'node:fs'
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { execFileSync, execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import JSZip from 'jszip'

const DOCX_TEMPLATE_PATH = path.join(
  process.cwd(),
  'certificate',
  'BrainxAI_101_Certificate_Template.docx',
)
const DOCUMENT_XML_PATH = 'word/document.xml'
const PDF_CONVERSION_ERROR = 'PDF conversion failed. LibreOffice is required for local certificate PDF generation.'

export interface CertificateTemplateValues {
  recipientName: string
  issueMonth: string
  issueYear: string
}

export function normalizeRecipientName(value: string) {
  return value.trim().replace(/\s+/g, ' ').replace(/\{\{[^}]*\}\}/g, '')
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function findContainingParagraphStart(xml: string, index: number) {
  const paragraphStartPattern = /<w:p(?=[\s>])/g
  let paragraphStart = -1
  let match: RegExpExecArray | null

  while ((match = paragraphStartPattern.exec(xml)) && match.index <= index) {
    paragraphStart = match.index
  }

  return paragraphStart
}

function centerParagraphContaining(xml: string, marker: string) {
  const markerIndex = xml.indexOf(marker)
  if (markerIndex === -1) return xml

  const paragraphStart = findContainingParagraphStart(xml, markerIndex)
  const paragraphEnd = xml.indexOf('</w:p>', markerIndex)
  if (paragraphStart === -1 || paragraphEnd === -1) return xml

  const paragraphCloseEnd = paragraphEnd + '</w:p>'.length
  const paragraph = xml.slice(paragraphStart, paragraphCloseEnd)
  const openTagEnd = paragraph.indexOf('>')
  if (openTagEnd === -1) return xml

  const centeredParagraph = paragraph.replace(
    /<w:pPr\b[^>]*>[\s\S]*?<\/w:pPr>/,
    (pPr) => {
      if (/<w:jc\b/.test(pPr)) {
        return pPr.replace(
          /<w:jc\b[^>]*(?:\/>|>[\s\S]*?<\/w:jc>)/,
          '<w:jc w:val="center"/>',
        )
      }

      return pPr.replace('</w:pPr>', '<w:jc w:val="center"/></w:pPr>')
    },
  )

  const updatedParagraph = centeredParagraph === paragraph
    ? `${paragraph.slice(0, openTagEnd + 1)}<w:pPr><w:jc w:val="center"/></w:pPr>${paragraph.slice(openTagEnd + 1)}`
    : centeredParagraph

  return `${xml.slice(0, paragraphStart)}${updatedParagraph}${xml.slice(paragraphCloseEnd)}`
}

let sofficeCommand: string | null | undefined

function getSofficeCommand(): string | null {
  if (sofficeCommand !== undefined) return sofficeCommand

  const windowsCandidates = [
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
    'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
  ]

  for (const candidate of windowsCandidates) {
    if (existsSync(candidate)) {
      sofficeCommand = candidate
      return sofficeCommand
    }
  }

  try {
    const command = process.platform === 'win32' ? 'where soffice' : 'command -v soffice'
    const result = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)[0]
    sofficeCommand = result || null
  } catch {
    sofficeCommand = null
  }

  return sofficeCommand
}

async function fillDocxTemplate(values: CertificateTemplateValues): Promise<Buffer> {
  const content = await readFile(DOCX_TEMPLATE_PATH)
  const zip = await JSZip.loadAsync(content)

  const documentEntry = zip.file(DOCUMENT_XML_PATH)
  if (!documentEntry) {
    throw new Error('Certificate template is missing word/document.xml.')
  }

  let xml = await documentEntry.async('string')

  // Word can split {{recipient_name}} across runs and proofing markers.
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '')
  xml = centerParagraphContaining(xml, 'recipient_name')

  const RPC = '(?:[^<]|<(?!\\/w:rPr>))*'

  if (xml.includes('{{recipient_name}}')) {
    xml = xml.split('{{recipient_name}}').join(escapeXml(values.recipientName))
  } else {
    const nameRe = new RegExp(
      `<w:r\\b[^>]*>(?:<w:rPr>${RPC}<\\/w:rPr>)?<w:t[^>]*>\\{\\{<\\/w:t><\\/w:r>` +
      `<w:r\\b[^>]*>(?:<w:rPr>${RPC}<\\/w:rPr>)?<w:t[^>]*>recipient_name<\\/w:t><\\/w:r>` +
      `<w:r\\b[^>]*>(?:<w:rPr>${RPC}<\\/w:rPr>)?<w:t[^>]*>\\}\\}<\\/w:t><\\/w:r>`,
    )
    xml = xml.replace(
      nameRe,
      `<w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="74"/><w:szCs w:val="74"/></w:rPr>` +
      `<w:t xml:space="preserve">${escapeXml(values.recipientName)}</w:t></w:r>`,
    )
  }

  const monthRe = new RegExp(
    `(<w:r[^>]*>)(<w:rPr>${RPC}<\\/w:rPr>)?(<w:t[^>]*>)\\{\\{(?:issue_month|ISSUE_MONTH)\\}\\}(<\\/w:t><\\/w:r>)`,
  )
  xml = xml.replace(monthRe,
    (_m, runOpen: string, rPr: string | undefined, tOpen: string, tClose: string) => {
      const fontProps = '<w:sz w:val="40"/><w:szCs w:val="40"/>'
      const newRPr = rPr
        ? rPr.replace('</w:rPr>', `${fontProps}</w:rPr>`)
        : `<w:rPr>${fontProps}</w:rPr>`
      return `${runOpen}${newRPr}${tOpen}${escapeXml(values.issueMonth.toUpperCase())}${tClose}`
    },
  )
  xml = xml.split('{{issue_month}}').join(escapeXml(values.issueMonth.toUpperCase()))
  xml = xml.split('{{ISSUE_MONTH}}').join(escapeXml(values.issueMonth.toUpperCase()))

  const yearRe = new RegExp(
    `(<w:r[^>]*>)(<w:rPr>)(${RPC})(<\\/w:rPr>)(<w:t[^>]*>)\\{\\{(?:issue_year|ISSUE_YEAR)\\}\\}`,
  )
  xml = xml.replace(yearRe,
    (_m, runOpen: string, rPrOpen: string, rPrContent: string, rPrClose: string, tOpen: string) => {
      const fixed = rPrContent
        .replace(/<w:sz w:val="28"\/>/, '<w:sz w:val="64"/>')
        .replace(/<w:szCs w:val="28"\/>/, '<w:szCs w:val="64"/>')
      return `${runOpen}${rPrOpen}${fixed}${rPrClose}${tOpen}{{issue_year}}`
    },
  )
  xml = xml.split('{{issue_year}}').join(escapeXml(values.issueYear))
  xml = xml.split('{{ISSUE_YEAR}}').join(escapeXml(values.issueYear))

  zip.file(DOCUMENT_XML_PATH, xml)
  return zip.generateAsync({ type: 'nodebuffer' })
}

export async function generateCertificateDocument(values: CertificateTemplateValues): Promise<{
  buffer: Buffer
  mimeType: string
  extension: 'pdf'
}> {
  const soffice = getSofficeCommand()
  if (!soffice) {
    throw new Error(PDF_CONVERSION_ERROR)
  }

  const docxBuffer = await fillDocxTemplate(values)
  const tmp = tmpdir()
  const id = randomUUID()
  const tmpDocx = path.join(tmp, `cert_${id}.docx`)
  const tmpPdf = path.join(tmp, `cert_${id}.pdf`)

  try {
    await writeFile(tmpDocx, docxBuffer)
    execFileSync(soffice, ['--headless', '--convert-to', 'pdf', '--outdir', tmp, tmpDocx], {
      timeout: 25000,
      stdio: 'pipe',
    })
    const pdfBuffer = await readFile(tmpPdf)
    return { buffer: pdfBuffer, mimeType: 'application/pdf', extension: 'pdf' }
  } catch {
    throw new Error(PDF_CONVERSION_ERROR)
  } finally {
    await unlink(tmpDocx).catch(() => {})
    await unlink(tmpPdf).catch(() => {})
  }
}

export function buildCertificateFilename(recipientName: string, extension = 'pdf') {
  const safeName = recipientName.replace(/[^\w-]+/g, '_').slice(0, 60) || 'recipient'
  return `BrainxAI_101_Certificate_${safeName}.${extension}`
}
