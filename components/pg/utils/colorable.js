export const colorMaker = (color) => {
  // using HEX or vuetify colors vars
  if (typeof color === 'string') {
    return color
  }

  return `var(--v-${color.color}-${color.light || 'base'})`
}
