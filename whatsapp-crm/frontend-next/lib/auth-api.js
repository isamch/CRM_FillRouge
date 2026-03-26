const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function authRequest(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong')
    err.response = { data, status: res.status }
    throw err
  }

  return data
}

export const loginApi    = (email, password)           => authRequest('/auth/login', { email, password })
export const registerApi = (name, email, password)     => authRequest('/auth/register', { name, email, password })
export const refreshApi  = (token)                     => authRequest('/auth/refresh-token', { token })
export const logoutApi   = (token)                     => authRequest('/auth/logout', { token })
