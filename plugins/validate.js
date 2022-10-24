import Vue from 'vue'
import isURL from 'validator/lib/isURL'
import {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'
import {
  confirmed,
  digits,
  email,
  integer,
  max,
  min,
  min_value as minValue,
  required,
  size
} from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// Locales
localize({ en })

// Default
extend('confirmed', confirmed)
extend('digits', digits)
extend('email', email)
extend('integer', integer)
extend('max', max)
extend('min', min)
extend('min_value', minValue)
extend('required', required)
extend('size', size)

// Custom
// 4242424242424242
// 4242.4242.4242.4242
// 4242-4242-4242-4242
extend('cc_number', (value) => {
  value = `${value || ''}`.replace(/\D/gm, '')

  return (
    (value.length === 16 &&
      /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14})$/.test(
        value
      )) ||
    'The {_field_} field must be a valid credit card number'
  )
})

extend('cc_exp_date', (value) => {
  value = `${value || ''}`

  if (/^\d{1,2}\/\d{2}$/.test(value)) {
    let [month, year] = value.split('/')
    month = Number(month)
    year = Number(year) + 2000
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    if (
      month >= 1 &&
      month <= 12 &&
      year >= currentYear &&
      year <= 2099 &&
      !(month <= currentMonth && year === currentYear)
    ) {
      return true
    }
  }

  return 'The {_field_} field must be a valid expiration date'
})

// (123) 456-7890
// (123)456-7890
// 123-456-7890
// 123.456.7890
// 1234567890
// +31636363634
// 075-63546725
extend(
  'phone',
  value =>
    (value &&
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) ||
    'The {_field_} field must be a valid phone number'
)
extend(
  'url',
  value => isURL(value) || 'The {_field_} field must be a valid url'
)
extend(
  'w_number',
  value =>
    (value && /[0-9]/.test(value)) || 'The {_field_} field must include numbers'
)
extend(
  'w_special',
  value =>
    (value && /\W/.test(value)) ||
    'The {_field_} field must include special character'
)
extend(
  'w_upper',
  value =>
    (value && /[A-Z]/.test(value)) ||
    'The {_field_} field must include uppercase'
)
extend(
  'w_strong_password',
  value =>
    (value && /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value)) ||
    'Password does not meet all of the requirements'
)
