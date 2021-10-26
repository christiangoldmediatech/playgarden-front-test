import { google } from 'google-maps'

export const getStreetStrFromAddressComps = (address: google.maps.GeocoderResult | null): string => {
  if (!address || !address.address_components || !address.address_components.length) {
    return ''
  }

  const route = address.address_components.find(({ types }) =>
    types.includes('route')
  )
  const streetNumber = address.address_components.find(({ types }) =>
    types.includes('street_number')
  )
  const sublocality = address.address_components.find(
    ({ types }) =>
      types.includes('sublocality') && types.includes('sublocality_level_1')
  )
  const country = address.address_components.find(({ types }) =>
    types.includes('country')
  )

  let streetText = ''

  if (route && streetNumber) {
    if (country && country.short_name.toUpperCase() === 'MX') {
      streetText = `${route.long_name} ${streetNumber.long_name}`
    } else {
      streetText = `${streetNumber.long_name} ${route.long_name}`
    }
  } else if (route) {
    streetText = `${route.long_name}`
  }

  if (route && streetNumber && sublocality) {
    streetText += `, ${sublocality.long_name}`
  }

  return streetText
}
