import AxisChart from './AxisChart'

class YAxisChart extends AxisChart {
  constructor (yAxis, viewPortHandler) {
    super(viewPortHandler)
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
