// Extract field errors from API 422 response
export const getApiErrors = (err) => {
  const details = err?.response?.data?.details
  if (!Array.isArray(details)) return {}
  return details.reduce((acc, { field, message }) => {
    const key = field.replace(/^body\./, '')
    acc[key] = message
    return acc
  }, {})
}

// Simple client-side rules — returns { field: message } or {}
export const validateForm = (rules) => {
  const errors = {}
  for (const [field, checks] of Object.entries(rules)) {
    for (const { test, message } of checks) {
      if (!test) { errors[field] = message; break }
    }
  }
  return errors
}

// Merge client errors + api errors (api takes priority)
export const mergeErrors = (clientErrors, apiErrors) => ({ ...clientErrors, ...apiErrors })
