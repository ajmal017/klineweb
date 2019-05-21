import Axis from './Axis'

import utils from '../utils/utils'
import Type from '../constant/Type'

class YAxis extends Axis {
  constructor () {
    super()
    /**
     * 是否绘制文字在轴线外
     */
    this.yAxisTextPosition = Type.YAxisTextPosition.OUTSIDE

    /**
     * y轴位置
     */
    this.yAxisPosition = Type.YAxisPosition.RIGHT

    /**
     * y轴最大宽度
     */
    this.yAxisMaxWidth = 80

    /**
     * y轴最小宽度
     */
    this.yAxisMinWidth = 40
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
    if (this.yAxisTextPosition === Type.YAxisTextPosition.OUTSIDE) {
      width += utils.calcTextWidth(this.tickTextSize * 2, '0000000') + this.textMarginSpace * 2
      if (this.displayTickLine) {
        width += this.tickLineSize * 2
      }
    }

    if (this.displayAxisLine) {
      width += this.axisLineSize
    }

    let maxWidth = width
    if (maxWidth > 0) {
      maxWidth = this.yAxisMaxWidth * 2
      width = Math.min(maxWidth, Math.max(width, this.yAxisMinWidth * 2))
    }
    return width
  }
}

export default YAxis
