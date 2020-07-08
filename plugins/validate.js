import Vue from 'vue'
import { extend, localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import { confirmed, email, max, min, required } from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// Locales
localize({ en })

// Default
extend('confirmed', confirmed)
extend('email', email)
extend('max', max)
extend('min', min)
extend('required', required)

// Custom
// (123) 456-7890
// (123)456-7890
// 123-456-7890
// 123.456.7890
// 1234567890
// +31636363634
// 075-63546725
extend('phone', value => (value && /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) || 'The {_field_} field must be a valid phone number')
extend('w_number', value => (value && /[0-9]/.test(value)) || 'The {_field_} field must include numbers')
extend('w_special', value => (value && /\W/.test(value)) || 'The {_field_} field must include special character')
extend('w_upper', value => (value && /[A-Z]/.test(value)) || 'The {_field_} field must include uppercase')
