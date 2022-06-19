export function hexToRgb(hex: string) {
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b].join(',')
}

// Convert css RGBA to non transparent hex
export function hexify(color: string) {
  const values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
  const a = parseFloat(values[3] || '1')
  const r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255)
  const g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255)
  const b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
  return (
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
  )
}

// Allows us to create a lighter color via transparency, but then find the corresponding non transparent color assuming a white bkg
export function getHexNonTransparentColor(color: string, transparency: number): string {
  return hexify(`rgba(${hexToRgb(color.substring(1))}, ${transparency})`)
}
