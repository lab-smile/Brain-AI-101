import type { ApiErrorPayload } from '../../types/api'

export let isDatabaseAvailable = true

async function readErrorPayload(response: Response): Promise<ApiErrorPayload | null> {
  return response.json().catch(() => null) as Promise<ApiErrorPayload | null>
}

function extractErrorMessage(payload: ApiErrorPayload | null, status: number) {
  return payload?.error || `Request failed with status ${status}.`
}

export async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'same-origin',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const payload = await readErrorPayload(response)
    if (payload?.code === 'DB_UNAVAILABLE') {
      isDatabaseAvailable = false
    }
    throw new Error(extractErrorMessage(payload, response.status))
  }

  return response.json() as Promise<T>
}

export async function requestText(input: string, init?: RequestInit): Promise<string> {
  const response = await fetch(input, {
    credentials: 'same-origin',
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const payload = await readErrorPayload(response)
    if (payload?.code === 'DB_UNAVAILABLE') {
      isDatabaseAvailable = false
    }
    throw new Error(extractErrorMessage(payload, response.status))
  }

  return response.text()
}
