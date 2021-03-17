import dayjs from 'dayjs'

const dateIsBefore = (start, end) => {
  return dayjs(start).isBefore(end)
}

export const SAME_SITE = {
  LAX: 'lax',
  STRICT: 'strict',
  NONE: 'none'
}

export const EXPIRE_DATES = {
  SESSION: 'session',
  /**
   * Use a date some time in the not near future
   * Seen on https://developer.mozilla.org/en-US/docs/web/api/document/cookie#example_3_do_something_only_once
   * and also on https://www.geeksforgeeks.org/how-to-set-up-a-cookie-that-never-expires-in-javascript/
   */
  NEVER: 'Fri, 31 Dec 9999 23:59:59 GMT'
}

export const MAX_AGES = {
  SESSION: 0,
  NEVER_EXPIRE: -1
}

/**
 * Util functions
 * ===================================
 */
const getMaxAgeInGMTDate = (maxAge) => {
  let gmtDate = ''
  const today = dayjs()

  switch (maxAge) {
    case MAX_AGES.NEVER_EXPIRE:
      gmtDate = EXPIRE_DATES.NEVER
      break
    case MAX_AGES.SESSION:
      gmtDate = ''
      break
    default:
      today.add(maxAge, 's')
      gmtDate = today.toISOString()
      // Convert to GMT
      gmtDate = new Date(gmtDate).toUTCString()
  }

  return gmtDate
}

const getExpringDateInGMTDate = (expireDate) => {
  let gmtDate = ''

  switch (expireDate) {
    case EXPIRE_DATES.NEVER:
      gmtDate = expireDate
      break
    case EXPIRE_DATES.SESSION:
      gmtDate = ''
      break
    default:
      gmtDate = dayjs(expireDate).toISOString()
      // Convert to GMT
      gmtDate = new Date(gmtDate).toUTCString()
  }

  return gmtDate
}

const _getExpiresStringFromDefinedMaxAgeAndExpireDate = (
  maxAge = MAX_AGES.SESSION,
  expireDate = EXPIRE_DATES.SESSION
) => {
  let expiresString = ''

  const maxAgeDateInGMT = getMaxAgeInGMTDate(maxAge)

  const expireDateInGMT = getExpringDateInGMTDate(expireDate)

  // is the cookie a session cookie?
  if (
    maxAge === MAX_AGES.SESSION ||
    expireDate === EXPIRE_DATES.SESSION
  ) {
    // don't add anything as that tells the browser this is a session cookie
    expiresString = ''
    // @ts-ignore
  } else if (dateIsBefore(maxAgeDateInGMT, expireDateInGMT)) {
    expiresString = maxAgeDateInGMT ? `;max-age=${maxAge}` : ''
  } else {
    expiresString = expireDateInGMT ? `;expires=${expireDateInGMT}` : ''
  }

  return expiresString
}

const _getExpiresStringFromDefinedMaxAge = (maxAge) => {
  let expiresString = ''

  switch (maxAge) {
    case MAX_AGES.NEVER_EXPIRE:
      expiresString = `;expires=${EXPIRE_DATES.NEVER}`
      break
    case MAX_AGES.SESSION:
      expiresString = ''
      break
    default:
      expiresString = `;max-age=${maxAge}`
  }

  return expiresString
}

const getExpiresString = (maxAge, expireDate = EXPIRE_DATES.SESSION) => {
  let expiresString = ''

  const expireDateInGMT = getExpringDateInGMTDate(expireDate)

  switch (true) {
    case typeof maxAge !== 'undefined' && typeof expireDate !== 'undefined':
      expiresString = _getExpiresStringFromDefinedMaxAgeAndExpireDate(
        maxAge,
        expireDate
      )
      break
    case typeof maxAge !== 'undefined':
      expiresString = _getExpiresStringFromDefinedMaxAge(maxAge)
      break
    case typeof expireDate !== 'undefined':
      expiresString = expireDateInGMT ? `;expires=${expireDateInGMT}` : ''
      break
  }

  return expiresString
}

// END UTILS =======================

class Cookie {
  _key

  _data

  _expireDate

  _maxAge

  path

  secure

  sameSite

  constructor ({
    _key,
    _data,
    _expireDate = undefined,
    _maxAge = undefined,
    path = '/',
    secure = true,
    sameSite = SAME_SITE.STRICT
  }) {
    if (!_key || !_data) {
      throw new Error('invalid cookie parameters')
    }

    this._key = encodeURIComponent(_key)
    this._data = encodeURIComponent(_data)
    this._expireDate = _expireDate
    this._maxAge = _maxAge
    this.path = path
    this.secure = secure
    this.sameSite = sameSite
  }

  get name () {
    return decodeURIComponent(this._key)
  }

  get value () {
    return decodeURIComponent(this._data)
  }

  get expires () {
    return getExpiresString(this._maxAge, this._expireDate)
  }
}

export class CookieHandlerUI {
  static add (data) {
    const cookie = new Cookie(data)

    let cookieString = `${cookie.name}=${cookie.value}`
    cookieString += cookie.expires

    if (cookie.path) {
      cookieString += `;path=${encodeURIComponent(cookie.path)}`
    }

    if (cookie.sameSite) {
      cookieString += `;samesite=${cookie.sameSite}`
    }

    // NONE same site should always add secure on cookie
    if (cookie.sameSite === SAME_SITE.NONE || cookie.secure) {
      cookieString += ';secure'
    }

    document.cookie = cookieString
  }

  static remove (name) {
    const cookie = {
      _key: name,
      path: '/',
      _data: 'removed',
      _expireDate: '1970-01-01T00:00:00.000Z',
      _maxAge: 0
    }
    /**
     * Cookies can only be removed by setting their expiration time to
     * some date that has already past. Thats why we are 'adding' a new expired
     * cookie with the same cookie name.
     */
    CookieHandlerUI.add(cookie)
  }

  static getAll (text = '') {
    let selectedText = text
    if (process.client) {
      if (document && document.cookie) {
        selectedText = document.cookie
      }
    }
    const cookies = selectedText
    if (cookies) {
      return cookies
        .split(';')
        .map((ck) => {
          const cookie = ck.trim()
          const data = cookie.split('=')
          const name = data[0]
          const value = cookie.substring(data[0].length + 1)
          if (name && value) {
            return new Cookie({
              _key: name,
              _data: value
            })
          }
          return undefined
        })
        .filter((ck) => {
          /**
           * The addded type on the filter function is to let the ts static parser
           * that we are removing undefined values in here and we are not returning
           * a (Cookie|undefined)[] type
           */
          return typeof ck !== 'undefined'
        })
    }
    return []
  }
}
