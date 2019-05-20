import AxisChart from './AxisChart'

class YAxisChart extends AxisChart {
  constructor (yAxis, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.axisMaximum = 0
    this.axisMinimum = 0
    this.yAxis = yAxis
  }

  /**
   * 绘制轴线
   * @param canvas
   */
  drawAxisLine (canvas) {
    if (!this.yAxis.displayAxisLine) {
      // return
    }
  }
}

export default YAxisChart
