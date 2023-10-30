import { useLanguageHelper } from '../helpers.composable'

export const useFormValidations = () => {
  const language = useLanguageHelper()

  const hasOnlyNumbers = (value: any) => {
    const regex = /^\d*\.?\d*$/
    if (regex.test(value)) {
      return true
    }
    return language.t('validations.hasOnlyNumber')
  }

  const isValidEmail = (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || language.t('validations.invalidEmail')
  }

  const isValidPassword = [
    (value:any) => !!value || language.t('validations.password.required'),
    (value:any) => (value && value.length >= 6) || language.t('validations.password.length'),
    (value:any) => (value && /[0-9]/.test(value)) || language.t('validations.password.numbers'),
    (value:any) => (value && /[A-Z]/.test(value)) || language.t('validations.password.uppercase')
  ]

  const isValidPhone = (value: any) => {
    const pattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    if (typeof value === 'undefined' || value === null || value.match(pattern)) {
      return true
    }
    return language.t('validations.invalidPhone')
  }

  const isValidPostalCode5 = (value: any) => {
    const regex = /^\d{5}$/
    if (regex.test(value)) {
      return true
    }
    return language.t('validations.invalidZip')
  }

  const required = (value: any) => !!value || language.t('validations.required')

  const requiredStrict = (value: any) => {
    if (value !== undefined) {
      return true
    } else {
      return language.t('validations.required')
    }
  }

  return {
    hasOnlyNumbers,
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidPostalCode5,
    required,
    requiredStrict
  }
}
