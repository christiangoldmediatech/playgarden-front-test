export const shuffle = (array) => {
  const result = []
  while (array.length) {
    const max = array.length
    const index = (max > 1) ? Math.floor(Math.random() * max) : 0
    result.push(array.splice(index, 1)[0])
  }
  return result
}
