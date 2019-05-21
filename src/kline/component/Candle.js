import Type from '../constant/Type'

class Candle {
  constructor () {
    /**
     * 上涨颜色
     */
    this.increasingColor = '#5DB300'

    /**
     * 下跌颜色
     */
    this.decreasingColor = '#FF4A4A'

    /**
     * 蜡烛图样式
     */
    this.candleStyle = Type.CandleStyle.SOLID

    /**
     * 图类型
     */
    this.chartStyle = Type.ChartStyle.CANDLE

    /**
     * 是否显示最大价格标记
     */
    this.displayHighestPriceMark = true

    /**
     * 是否显示最低价格标记
     */
    this.displayLowestPriceMark = true

    /**
     * 最低最高价格标记文字颜色
     */
    this.lowestHighestPriceMarkTextColor = '#898989'

    /**
     * 最低最高价格标记文字大小
     */
    this.lowestHighestPriceMarkTextSize = 10

    /**
     * 是否显示最新价标记
     */
    this.displayLastPriceMark = true

    /**
     * 最新价标记线样式
     */
    this.lastPriceMarkLineStyle = Type.LineStyle.DASH

    /**
     * 最新价标记线尺寸
     */
    this.lastPriceMarkLineSize = 1

    /**
     * 最新价标记线颜色
     */
    this.lastPriceMarkLineColor = '#B9B9B9'

    /**
     * 分时线尺寸
     */
    this.timeLineSize = 1

    /**
     * 分时线颜色
     */
    this.timeLineColor = '#D8D8D8'

    /**
     * 分时线填充色
     */
    this.timeLineFillColor = '#20D8D8D8'

    /**
     * 分时均线颜色
     */
    this.timeAverageLineColor = '#F5A623'
  }
}

export default Candle
