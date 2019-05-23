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
}

export default Event
