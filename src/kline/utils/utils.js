const utils = {
  canvas: document.createElement('canvas').getContext('2d'),

  /**
   * 测量文字的宽度
   * @param font
   * @param text
   * @returns {number}
   */
  calcTextWidth (font, text) {
    this.canvas.font = font
    return this.canvas.measureText(text).width
  },

  nice (value) {
    let exponent = Math.floor(Math.log(value) / Math.log(10.0))
    let exp10 = Math.pow(10.0, exponent)
    let f = value / exp10 // 1 <= f < 10
    let nf = 0
    if (f < 1) {
      nf = 1
    } else if (f < 2) {
      nf = 2
    } else if (f < 3) {
      nf = 3
    } else if (f < 5) {
      nf = 5
    } else {
      nf = 10
    }
    value = nf * exp10
    return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
  },

  getIntervalPrecision (value) {
    let str = value.toString()

    // Consider scientific notation: '3.4e-12' '3.4e+12'
    let eIndex = str.indexOf('e')
    if (eIndex > 0) {
      let precision = +str.slice(eIndex + 1)
      return precision < 0 ? -precision : 0
    } else {
      let dotIndex = str.indexOf('.')
      return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
    }
  },

  round (x, precision) {
    if (precision == null) {
      precision = 10
    }
    // Avoid range error
    precision = Math.min(Math.max(0, precision), 20)
    x = (+x).toFixed(precision)
    return x
  }
}

export default utils
