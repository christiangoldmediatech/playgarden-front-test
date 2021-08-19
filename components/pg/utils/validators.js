export const colorValidator = (value) => {
  if (!value) {
    return false
  }

  // using HEX or vuetify colors vars
  if (typeof value === 'string') {
    return true
  }

  // using vuetify color with object
  if (!value.color || !value.light) {
    return false
  }

  if (
    ![
      'primary',
      'secondary',
      'accent',
      'error',
      'info',
      'success',
      'warning',
      'black',
      'green2'
    ].includes(value.color)
  ) {
    return false
  }

  return (
    !value.light ||
    [
      'base',
      'lighten5',
      'lighten4',
      'lighten3',
      'lighten2',
      'lighten1',
      'darken1',
      'darken2',
      'darken3',
      'darken4'
    ].includes(value.light)
  )
}
