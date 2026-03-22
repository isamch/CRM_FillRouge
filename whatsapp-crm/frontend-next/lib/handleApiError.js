export function handleApiError(err, { setErrors }) {
  const response = err.response?.data

  if (err.response?.status === 422 && Array.isArray(response?.details)) {
    const fieldErrors = {}
    response.details.forEach(({ field, message }) => {
      fieldErrors[field.replace('body.', '')] = message
    })
    setErrors(fieldErrors)
    return
  }

  alert(response?.message || 'Something went wrong. Please try again.')
}
