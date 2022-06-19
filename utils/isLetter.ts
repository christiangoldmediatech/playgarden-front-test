// Generate alphabet for determinig if a "category" is a letter or something else
const alpha = Array.from(Array(26)).map((_, i) => i + 65)
const alphabet = alpha.map((x: number) => {
  const letter = String.fromCharCode(x)
  return `${letter.toUpperCase()}${letter.toLowerCase()}`
})

export function isLetter(text: string): boolean {
  return alphabet.includes(text)
}
