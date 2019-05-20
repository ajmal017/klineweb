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
  }
}

export default utils
