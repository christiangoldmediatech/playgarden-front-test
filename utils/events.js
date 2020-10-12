export const doEvent = (name, value, listeners) => {
  if (listeners[name]) {
    if (typeof listeners[name] === 'function') {
      return listeners[name](value)
    } else {
      return listeners[name].map(callback => callback(value))
    }
  }
  return undefined
}
