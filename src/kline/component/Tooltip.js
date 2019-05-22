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
     * 基础数据文字大小
     */
    this.generalDataTextSize = 10

    /**
     * 基础数据文字颜色
     */
    this.generalDataTextColor = '#898989'

    /**
     * 基础数据label
     */
    this.generalDataLabels = ['时间', '开', '收', '高', '低']

    /**
     * 指标提示规则
     */
    this.indicatorDisplayRule = Type.IndicatorDisplayRule.ALWAYS

    /**
     * 提示文字大小
     */
    this.indicatorTextSize = 10
  }
}

export default Tooltip
