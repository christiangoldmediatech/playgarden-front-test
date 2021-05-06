/**
 * Check if an Object contains all the properties specified in keys
 * @param {Object} obj - object from whom to check it's keys
 * @param {Array} keys - array of properties to check
 */
export const checkKeys = (obj, keys) => {
  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be an Array with the keys to be checked')
  }

  if (typeof obj !== 'object') {
    throw new TypeError('obj must be an object')
  }

  return keys.every((key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
  })
}

/**
 * Deep comparison of objects
 * @param {*} a
 * @param {*} b
 */
export const deepEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}
