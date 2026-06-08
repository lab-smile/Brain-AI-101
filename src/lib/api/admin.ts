import type { AdminExportType, AdminSubmissionsResponse, AdminSubmissionsSummary } from '../../types/admin'
import { requestText } from './client'

class AdminApiError extends Error {
  kind: 'unauthorized' | 'network' | 'invalid-response' | 'server'

  constructor(message: string, kind: 'unauthorized' | 'network' | 'invalid-response' | 'server') {
    super(message)
    this.name = 'AdminApiError'
    this.kind = kind
  }
}

function authorizationHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isSummary(value: unknown): value is AdminSubmissionsSummary {
  if (!isRecord(value)) {
    return false
  }

  return [
    'quizAttemptCount',
    'evaluationCount',
    'averageQuizScore',
    'passCount',
    'preCourseCount',
    'postCourseCount',
  ].every((key) => typeof value[key] === 'number')
}

function normalizeAdminSubmissionsResponse(payload: unknown): AdminSubmissionsResponse {
  if (!isRecord(payload) || payload.ok !== true || !isSummary(payload.summary)) {
    throw new AdminApiError('Invalid admin response shape', 'invalid-response')
  }

  const quizAttempts = Array.isArray(payload.quizAttempts) ? payload.quizAttempts : null
  const evaluations = Array.isArray(payload.evaluations) ? payload.evaluations : null

  if (!quizAttempts || !evaluations) {
    throw new AdminApiError('Invalid admin response shape', 'invalid-response')
  }

  return {
    ok: true,
    summary: payload.summary,
    quizAttempts,
    evaluations,
  }
}

async function readErrorMessage(response: Response) {
  try {
    const payload = await response.json() as { error?: string; message?: string }
    return payload.error || payload.message || ''
  } catch {
    return ''
  }
}

export async function getAdminSubmissions(token: string) {
  let response: Response

  try {
    response = await fetch('/api/admin/submissions', {
      method: 'GET',
      credentials: 'same-origin',
      headers: authorizationHeader(token),
    })
  } catch {
    throw new AdminApiError('Unable to reach the server. Check your connection and try again.', 'network')
  }

  if (response.status === 401 || response.status === 403) {
    throw new AdminApiError('Invalid admin token. Double-check the token and try again.', 'unauthorized')
  }

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response)
    throw new AdminApiError(errorMessage || 'The server could not load admin submissions right now.', 'server')
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new AdminApiError('Invalid admin response shape', 'invalid-response')
  }

  return normalizeAdminSubmissionsResponse(payload)
}

export function getAdminExportFilename(type: AdminExportType) {
  return type === 'quiz'
    ? 'brain-ai-101-quiz-attempts.csv'
    : 'brain-ai-101-evaluations.csv'
}

export async function downloadAdminExport(type: AdminExportType, token: string) {
  const path = type === 'quiz'
    ? '/api/admin/export-quiz.csv'
    : '/api/admin/export-evaluations.csv'

  let csv = ''

  try {
    csv = await requestText(path, {
      method: 'GET',
      headers: authorizationHeader(token),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      throw new AdminApiError('Invalid admin token. Double-check the token and try again.', 'unauthorized')
    }

    throw new AdminApiError(
      error instanceof Error ? error.message : 'Unable to export CSV.',
      'server',
    )
  }

  return {
    csv,
    filename: getAdminExportFilename(type),
  }
}
