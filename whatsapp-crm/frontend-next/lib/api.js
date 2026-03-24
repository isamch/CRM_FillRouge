import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

let isRefreshing = false
let refreshQueue = []

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token))
  refreshQueue = []
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error('Refresh failed')

  saveTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.accessToken
}

function redirectToLogin() {
  clearTokens()
  if (typeof window !== 'undefined') window.location.href = '/login'
}

async function request(method, path, body, retry = true) {
  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  })

  const data = await res.json()

  // token expired → try refresh once
  if (res.status === 401 && retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then(newToken => request(method, path, body, false))
        .catch(() => { redirectToLogin(); throw new Error('Session expired') })
    }

    isRefreshing = true
    try {
      const newToken = await refreshAccessToken()
      processQueue(null, newToken)
      return request(method, path, body, false)
    } catch {
      processQueue(new Error('Session expired'))
      redirectToLogin()
      throw new Error('Session expired')
    } finally {
      isRefreshing = false
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed')
    err.status   = res.status
    err.response = { status: res.status, data }
    throw err
  }

  return data
}

const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
}

export default api
