export const hasOnlyNumbers = (value) => {
  const regex = /^\d*\.?\d*$/
  if (regex.test(value)) {
    return true
  }

  return 'Only Numbers Allowed'
}

export const isValidEmail = (value) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(value) || 'Invalid e-mail'
}

export const isValidPassword = [
  value => !!value || 'Password is required',
  value => (value && value.length >= 6) || 'Password must be at least 6 characters',
  value => (value && /[0-9]/.test(value)) || 'Password must include numbers',
  value => (value && /[A-Z]/.test(value)) || 'Password must include uppercase'
]

export const isValidPhone = (value) => {
  const pattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
  if (typeof value === 'undefined' || value === null || value.match(pattern)) {
    return true
  }
  return 'Phone number must be valid'
}

export const isValidPostalCode5 = (value) => {
  const regex = /^\d{5}$/

  if (regex.test(value)) {
    return true
  }

  return 'Please enter a valid 5-digit ZIP code'
}

export const required = value => !!value || 'Required.'

// allows false/null
export const requiredStrict = (value) => {
  if (value !== undefined) {
    return true
  } else {
    return 'Required.'
  }
}
