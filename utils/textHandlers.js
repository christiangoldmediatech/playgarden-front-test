function getTextWidth (text, font) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)

  return metrics.width
}

function getFontData (containerElement) {
  const { fontFamily, fontSize, fontWeight } = window.getComputedStyle(containerElement)

  return `${fontWeight} ${fontSize} ${fontFamily}`
}

/**
 * Breaks single text into multiple lines in order to
 * wrap text and preserve underlined element
 * it's usage is recomended along with resize listener
 *
 * @param {*} containerElement
 * @param {*} text
 * @param {string} [mode='word'|'letter']
 * @returns
 */
function breakTextIntoLines (containerElement, text, mode = 'word') {
  const textLines = []
  let textArr

  if (mode === 'word') {
    textArr = text.match(/\S+|\s/g)
  } else if (mode === 'letter') {
    textArr = [...text]
  }

  textArr.reduce((prev, curr, index) => {
    const textWidth = getTextWidth(prev.join('') + curr, getFontData(containerElement))
    prev.push(curr)

    if (textArr.length - 1 === index) {
      textLines.push(prev)
      return
    }

    if (textWidth < containerElement.clientWidth) {
      return prev
    }

    textLines.push(prev)
    return []
  }, [])

  return textLines.map(line => line.join(''))
}

export default {
  getTextWidth,
  breakTextIntoLines,
  getFontData
}
