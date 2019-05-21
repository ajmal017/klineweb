class Chart {
  constructor (dataBounds, viewPortHandler) {
    this.dataBounds = dataBounds
    this.viewPortHandler = viewPortHandler
    this.chartTop = 0
    this.chartHeight = 0
    this.chartWidth = 0
  }

  /**
   * 设置图尺寸
   * @param height
   * @param top
   */
  setChartDimens (height, top) {
    this.chartHeight = height
    this.chartTop = top
  }

  /**
   * 获取y点坐标
   * @param yValue
   * @param yMin
   * @param interval
   * @returns {number}
   */
  getY (yValue, yMin, interval) {
    return this.chartTop + (1 - (yValue - yMin) / interval) * this.chartHeight
  }
}

export default Chart
