class Event {
  constructor (kline, dataBounds, viewPortHandler) {
    this.kline = kline
    this.dataBounds = dataBounds
    this.viewPortHandler = viewPortHandler
  }

  /**
   * 是否是有效事件
   * @param point
   * @returns {boolean}
   */
  isValidEvent (point) {
    return !(point.x < this.viewPortHandler.contentLeft() ||
      point.x > this.viewPortHandler.contentRight() ||
      point.y < this.viewPortHandler.contentTop() ||
      point.y > this.viewPortHandler.contentBottom())
  }

  /**
   * 获取事件对应画布上的点
   * @param e
   * @returns {{x: number, y: number}}
   */
  getCanvasPoint (e) {
    let rect = this.kline.tooltipCanvasDom.getBoundingClientRect()
    let x = Math.round(e.clientX - rect.left)
    let y = Math.round(e.clientY - rect.top)
    return { x: x * 2, y: y * 2 }
  }

  /**
   * 阻止事件
   * @param e
   */
  stopEvent (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    } else {
      window.event.cancelBubble = true
    }
    if (e && e.preventDefault) {
      e.preventDefault()
    } else {
      window.event.returnValue = false
    }
  }
}

export default Event
