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
import es from 'vee-validate/dist/locale/es.json'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

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
      ))
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
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value))
)
extend(
  'url',
  value => isURL(value)
)
extend(
  'w_number',
  value =>
    (value && /[0-9]/.test(value))
)
extend(
  'w_special',
  value =>
    (value && /\W/.test(value))
)
extend(
  'w_upper',
  value =>
    (value && /[A-Z]/.test(value))
)
extend(
  'w_strong_password',
  value =>
    (value && /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value))
)

// Locales
const dictionary = {
  en: {
    // code: 'en',
    messages: {
      ...en.messages,
      cc_number: 'The {_field_} field must be a valid credit card number',
      cc_exp_date: 'The {_field_} field must be a valid expiration date',
      phone: 'The {_field_} field must be a valid phone number',
      url: 'The {_field_} field must be a valid url',
      w_number: 'The {_field_} field must include numbers',
      w_special: 'The {_field_} field must include a special character',
      w_upper: 'The {_field_} field must include uppercase',
      w_strong_password: 'Password does not meet all of the requirements'
    },
    names: {
      name: 'Name',
      firstName: 'First Name',
      firstNameGiftRecipient: 'First Name (Gift Recipient)',
      lastName: 'Last Name',
      lastNameGiftRecipient: 'Last Name (Gift Recipient)',
      gender: 'Gender',
      birthdayDate: 'Birthday date',
      backpack: 'Backpack',
      email: 'Email',
      emailGiftRecipient: 'Email (Gift Recipient)',
      password: 'Password',
      newPassword: 'New Password',
      phone: 'Phone',
      phoneNumber: 'Phone Number',
      phoneNumberGiftRecipient: 'Phone Number (Gift Recipient)',
      phoneNumberOptional: 'Phone Number (optional)',
      address: 'Address',
      street: 'Street',
      street2: 'Street 2',
      city: 'City',
      state: 'State',
      country: 'Country',
      zipcode: 'Zip Code',
      subject: 'Subject',
      coupon: 'Coupon',
      terms: 'Terms',
      sendToChildName: 'Send To Child Name',
      disclaimer: 'Disclaimer',
      howCanWeHelpYou: 'How can we help you?',
      nameOfLibrary: 'Name of Library',
      libraryAddress: 'Library Address',
      cardNumber: 'Card number',
      promotionCode: 'Promotion Code',
      explanation: 'explanation',
      confirmationWord: 'Confirmation Word'
    }
  },
  es: {
    // code: 'es',
    messages: {
      ...es.messages,
      cc_number: 'El campo {_field_} debe ser un número de tarjeta de crédito válido',
      cc_exp_date: 'El campo {_field_} debe ser una fecha de vencimiento válida',
      phone: 'El campo {_field_} debe ser un número de teléfono válido',
      url: 'El campo {_field_} debe ser una URL válida',
      w_number: 'El campo {_field_} debe incluir números',
      w_special: 'El campo {_field_} debe incluir un carácter especial',
      w_upper: 'El campo {_field_} debe incluir mayúsculas',
      w_strong_password: 'La contraseña no cumple con todos los requisitos'
    },
    names: {
      name: 'Nombre',
      firstName: 'Nombre',
      firstNameGiftRecipient: 'Nombre (Destinatario del regalo)',
      lastName: 'Apellido',
      lastNameGiftRecipient: 'Apellido (Destinatario del regalo)',
      gender: 'Género',
      birthdayDate: 'Fecha de nacimiento',
      backpack: 'Mochila',
      email: 'Correo electrónico',
      emailGiftRecipient: 'Correo electrónico (Destinatario del regalo)',
      password: 'Contraseña',
      newPassword: 'Nueva Contraseña',
      phone: 'Teléfono',
      phoneNumber: 'Número de teléfono',
      phoneNumberGiftRecipient: 'Número de teléfono (Destinatario del regalo)',
      phoneNumberOptional: 'Número de teléfono (opcional)',
      address: 'Dirección',
      street: 'Calle',
      street2: 'Calle 2',
      city: 'Ciudad',
      state: 'Estado',
      country: 'País',
      zipcode: 'Código postal',
      subject: 'Asunto',
      coupon: 'Cupón',
      terms: 'Términos',
      sendToChildName: 'Enviar al nombre del niño',
      disclaimer: 'Descargo de responsabilidad',
      howCanWeHelpYou: '¿Cómo podemos ayudarte?',
      nameOfLibrary: 'Nombre de la biblioteca',
      libraryAddress: 'Dirección de la biblioteca',
      cardNumber: 'Número de tarjeta',
      promotionCode: 'Código de promoción',
      explanation: 'Explicación',
      confirmationWord: 'Palabra de confirmación'
    }
  }
}
localize('en', dictionary.en)
localize('es', dictionary.es)
