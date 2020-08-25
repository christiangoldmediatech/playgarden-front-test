import { jsonCopy } from './objectTools'

export const shuffle = (unshuffled) => {
  const result = []
  const array = jsonCopy(unshuffled)
  while (array.length) {
    const max = array.length
    const index = (max > 1) ? Math.floor(Math.random() * max) : 0
    result.push(array.splice(index, 1)[0])
  }
  return result
}
