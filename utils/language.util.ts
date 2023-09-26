export // Set language
const getLanguageCode = (code: string) => {
  if (code.includes('-')) {
    return code.split('-')[0]
  } else if (code.includes('_')) {
    return code.split('_')[0]
  } else {
    return code
  }
}
