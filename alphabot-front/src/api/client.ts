export type ApiError = Error & { status?: number }

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || ''

function getAccessToken(): string | null {
  // backwards compatibility: some pages still store under "authToken"
  return (
    window.localStorage.getItem('access_token') ??
    window.localStorage.getItem('authToken')
  )
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options
  const url = `${API_BASE_URL}${path}`
  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  }
  if (auth) {
    const token = getAccessToken()
    if (token) {
      (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(url, init)
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!res.ok) {
    const err: ApiError = new Error(
      isJson ? JSON.stringify(await res.json()).slice(0, 500) : await res.text(),
    )
    err.name = 'ApiError'
    err.status = res.status
    throw err
  }
  return (isJson ? res.json() : (null as unknown)) as T
}


