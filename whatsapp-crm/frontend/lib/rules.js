// Shared validation rules — each rule returns error message or ""
export const rules = {
  required: (label = "This field") => (v) =>
    !v || !String(v).trim() ? `${label} is required` : "",

  min: (n, label = "This field") => (v) =>
    v && String(v).trim().length < n ? `${label} must be at least ${n} characters` : "",

  max: (n, label = "This field") => (v) =>
    v && String(v).trim().length > n ? `${label} must be at most ${n} characters` : "",

  email: () => (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email format" : "",

  phone: () => (v) =>
    v && !/^\+?[1-9]\d{6,14}$/.test(v.trim()) ? "Invalid phone number format (e.g. +212612345678)" : "",

  minLength: (n) => (v) =>
    v && v.length < n ? `Must be at least ${n} characters` : "",

  match: (other, label = "Passwords") => (v) =>
    v && v !== other ? `${label} do not match` : "",

  mongoId: (label = "ID") => (v) =>
    v && !/^[a-f\d]{24}$/i.test(v) ? `${label} is invalid` : "",
}

// Run array of rule functions against a value — returns first error or ""
export const runRules = (value, ruleFns = []) => {
  for (const fn of ruleFns) {
    const err = fn(value)
    if (err) return err
  }
  return ""
}

// Validate entire form schema — returns { field: errorMsg }
export const validateSchema = (values, schema) => {
  const errors = {}
  for (const [field, ruleFns] of Object.entries(schema)) {
    const err = runRules(values[field], ruleFns)
    if (err) errors[field] = err
  }
  return errors
}

// Extract API field errors from 422 response
export const getApiErrors = (err) => {
  const details = err?.response?.data?.details
  if (!Array.isArray(details)) return {}
  return details.reduce((acc, { field, message }) => {
    acc[field.replace(/^body\./, "")] = message
    return acc
  }, {})
}
