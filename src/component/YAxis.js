import Axis from './Axis'

import utils from '../utils/utils'

/**
 * y轴位置
 */
export const YAxisPosition = {
  /**
   * 左边
   */
  LEFT: 'left',
  /**
   * 右边
   */
  RIGHT: 'right'
}

/**
 * y轴上文字位置
 */
export const YAxisTextPosition = {
  /**
   * 外部
   */
  OUTSIDE: 'outside',
  /**
   * 内部
   */
  INSIDE: 'inside'
}

class YAxis extends Axis {
  constructor () {
    super()
    /**
     * y轴位置
     */
    this.yAxisPosition = YAxisPosition.RIGHT

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
    return (((this.tickText.display || this.tickLine.display || this.tickText.margin > 0) && this.tickText.position === YAxisTextPosition.OUTSIDE) ||
      this.axisLine.display) && this.display
  }
  /**
   * 获取y轴需要的宽度
   * @return number
   */
  getRequiredWidthSpace () {
    let width = 0
    if (this.tickText.position === YAxisTextPosition.OUTSIDE) {
      width += utils.calcTextWidth(`${this.tickText.size * 2}px Arial`, '0000000') + this.tickText.margin * 2
      if (this.display && this.tickLine.display) {
        width += this.tickLine.size * 2
      }
    }

    if (this.display && this.axisLine.display) {
      width += this.axisLine.size
    }

    if (width === this.axisLine.size) {
      return parseInt(width)
    }
    let maxWidth = width
    if (maxWidth > 0) {
      maxWidth = this.yAxisMaxWidth * 2
      width = Math.min(maxWidth, Math.max(width, this.yAxisMinWidth * 2))
    }
    return parseInt(width)
  }
}

export default YAxis
