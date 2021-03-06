import Axis from './Axis'

class XAxis extends Axis {
  constructor () {
    super()
    /**
     * x轴最大高度
     */
    this.xAxisMaxHeight = 20

    /**
     * x轴最小高度
     */
    this.xAxisMinHeight = 20
  }

  /**
   * 计算x轴需要的高度
   * @return number
   */
  getRequiredHeightSpace () {
    let height = this.tickText.size * 2 + this.tickText.margin * 2
    if (this.display && this.tickLine.display) {
      height += this.tickLine.size * 2
    }
    if (this.display && this.axisLine.display) {
      height += this.axisLine.size
    }
    let maxHeight = height
    if (this.xAxisMaxHeight > 0) {
      maxHeight = this.xAxisMaxHeight * 2
    }
    height = Math.max(this.xAxisMinHeight * 2, Math.min(height, maxHeight))
    return parseInt(height)
  }
}

export default XAxis
