const API_BASE = "/api"

const TOKEN_KEY = "fh_access"
const REFRESH_KEY = "fh_refresh"

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  auth?: boolean
}

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const detail =
      (typeof data === "object" && data !== null &&
        ("detail" in data ? (data as { detail: string }).detail : undefined)) ||
      "Có lỗi xảy ra, vui lòng thử lại."
    throw new Error(detail)
  }

  return data as T
}

export async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken()
  if (!refresh) return false
  try {
    const data = await api<{ access: string }>(
      "/auth/refresh/",
      { method: "POST", body: { refresh }, auth: false },
    )
    localStorage.setItem(TOKEN_KEY, data.access)
    return true
  } catch {
    clearTokens()
    return false
  }
}