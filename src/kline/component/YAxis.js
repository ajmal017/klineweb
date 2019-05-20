import Axis from './Axis'

import utils from '../utils/utils'

class YAxis extends Axis {
  constructor () {
    super()
    /**
     * 是否绘制文字在轴线外
     */
    this.yAxisTextPosition = 'inside'

    /**
     * y轴位置
     */
    this.yAxisPosition = 'right'

    /**
     * y轴最大宽度
     */
    this.yAxisMaxWidth = 20

    /**
     * y轴最小宽度
     */
    this.yAxisMinWidth = 20
  }

  /**
   * 是否需要留间距绘制y轴
   * @return Boolean
   */
  needsOffset () {
    return ((this.displayTickText || this.displayTickLine || this.textMarginSpace > 0) && this.yAxisTextPosition === 'outside') || this.displayAxisLine
  }
  /**
   * 获取y轴需要的宽度
   * @return number
   */
  getRequiredWidthSpace () {
    let width = 0
    if (this.yAxisTextPosition === 'outside') {
      width += utils.calcTextWidth(this.tickTextSize, '0000000') + this.textMarginSpace
      if (this.displayTickLine) {
        width += this.tickLineSize
      }
    }

    if (this.displayAxisLine) {
      width += this.axisLineSize
    }

    let maxWidth = width
    if (this.yAxisMaxWidth > 0) {
      maxWidth = this.yAxisMaxWidth
    }
    width = Math.min(maxWidth, Math.max(width, this.yAxisMinWidth))
    return width
  }
}

export default YAxis
