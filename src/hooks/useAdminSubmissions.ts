import { useEffect, useMemo, useState } from 'react'
import { downloadAdminExport, getAdminSubmissions } from '../lib/api/admin'
import type { AdminExportType, AdminSubmissionsResponse } from '../types/admin'

const ADMIN_TOKEN_STORAGE_KEY = 'brainAi101.adminToken'

function readStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    return window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function persistToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (token) {
      window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
    } else {
      window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    }
  } catch {
    // sessionStorage unavailable — ignore and keep runtime state only
  }
}

export function useAdminSubmissions() {
  const [token, setToken] = useState(readStoredToken)
  const [data, setData] = useState<AdminSubmissionsResponse | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorType, setErrorType] = useState<'unauthorized' | 'network' | 'invalid-response' | 'server' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [exporting, setExporting] = useState<AdminExportType | null>(null)

  const hasStoredToken = useMemo(() => token.trim().length > 0, [token])

  useEffect(() => {
    if (!token.trim()) {
      return
    }

    load(token).catch(() => {
      // The hook state already captures the error.
    })
    // Run once on mount when a session token exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateToken = (nextToken: string) => {
    setToken(nextToken)
  }

  const load = async (nextToken = token) => {
    const trimmedToken = nextToken.trim()

    if (!trimmedToken) {
      setStatus('error')
      setErrorType('unauthorized')
      setErrorMessage('Enter the admin token to load submissions.')
      return null
    }

    setStatus('loading')
    setErrorType(null)
    setErrorMessage('')

    try {
      persistToken(trimmedToken)
      const result = await getAdminSubmissions(trimmedToken)
      setToken(trimmedToken)
      setData(result)
      setStatus('success')
      return result
    } catch (loadError) {
      setStatus('error')
      setData(null)
      setErrorType(
        loadError instanceof Error && 'kind' in loadError
          ? (loadError as Error & { kind: 'unauthorized' | 'network' | 'invalid-response' | 'server' }).kind
          : 'server',
      )
      setErrorMessage(loadError instanceof Error ? loadError.message : 'Unable to load admin submissions.')
      throw loadError
    }
  }

  const clearToken = () => {
    persistToken('')
    setToken('')
    setData(null)
    setStatus('idle')
    setErrorType(null)
    setErrorMessage('')
  }

  const exportCsv = async (type: AdminExportType, nextToken = token) => {
    const trimmedToken = nextToken.trim()

    if (!trimmedToken) {
      const message = 'Enter the admin token before exporting CSV.'
      setErrorType('unauthorized')
      setErrorMessage(message)
      throw new Error(message)
    }

    setExporting(type)
    setErrorType(null)
    setErrorMessage('')

    try {
      persistToken(trimmedToken)
      const { csv, filename } = await downloadAdminExport(type, trimmedToken)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } catch (exportError) {
      setErrorType(
        exportError instanceof Error && 'kind' in exportError
          ? (exportError as Error & { kind: 'unauthorized' | 'network' | 'invalid-response' | 'server' }).kind
          : 'server',
      )
      setErrorMessage(exportError instanceof Error ? exportError.message : 'Unable to export CSV.')
      throw exportError
    } finally {
      setExporting(null)
    }
  }

  return {
    token,
    setToken: updateToken,
    clearToken,
    load,
    exportCsv,
    data,
    errorType,
    errorMessage,
    status,
    exporting,
    hasStoredToken,
    isLoading: status === 'loading',
  }
}
