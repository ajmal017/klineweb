import Type from '../constant/Type'

class Tooltip {
  constructor () {
    /**
     * 线样式
     */
    this.crossLineStyle = Type.LineStyle.SOLID

    /**
     * 十字光标线尺寸
     */
    this.crossLineSize = 1

    /**
     * 十字光标线颜色
     */
    this.crossLineColor = '#505050'

    /**
     * 十字光标显示的文字框的线尺寸
     */
    this.crossTextRectStrokeLineSize = 1

    /**
     * 十字光标显示的文字框的线颜色
     */
    this.crossTextRectStrokeLineColor = '#EDEDED'

    /**
     * 十字光标显示的文字框的填充颜色
     */
    this.crossTextRectFillColor = '#505050'

    /**
     * 十字光标文字颜色
     */
    this.crossTextColor = '#EDEDED'

    /**
     * 十字光标文字大小
     */
    this.crossTextSize = 10

    /**
     * 上涨颜色
     */
    this.increasingColor = '#5DB300'

    /**
     * 下跌颜色
     */
    this.decreasingColor = '#FF4A4A'

    /**
     * 指标提示规则
     */
    this.indicatorDisplayRule = Type.IndicatorDisplayRule.ALWAYS

    /**
     * 提示文字大小
     */
    this.tooltipTextSize = 10
  }
}

export default Tooltip
