import { LineStyle } from './Component'

/**
 * 蜡烛图样式
 */
export const CandleStyle = {
  /**
   * 全实心
   */
  SOLID: 'solid',

  /**
   * 全空心
   */
  STROKE: 'stroke',

  /**
   * 涨空心
   */
  INCREASING_STROKE: 'increasing_stroke',

  /**
   * 跌空心
   */
  DECREASING_STROKE: 'decreasing_stroke',

  /**
   * 美国线
   */
  OHLC: 'ohlc'
}

/**
 * 图表类型
 */
export const ChartStyle = {
  /**
   * 蜡烛图
   */
  CANDLE: 'candle',

  /**
   * 分时线
   */
  TIME_LINE: 'time_line'
}

class Candle {
  constructor () {
    /**
     * 图类型
     */
    this.chartStyle = ChartStyle.CANDLE

    /**
     * 分时图配置
     */
    this.timeChart = {
      /**
       * 分时线尺寸
       */
      timeLineSize: 1,

      /**
       * 分时线颜色
       */
      timeLineColor: '#D8D8D8',

      /**
       * 分时线填充色
       */
      timeLineFillColor: '#f4f4f4',

      /**
       * 分时均线颜色
       */
      timeAverageLineColor: '#F5A623'
    }

    /**
     * 蜡烛图配置
     */
    this.candleChart = {
      /**
       * 蜡烛图样式
       */
      candleStyle: CandleStyle.OHLC,
      /**
       * 上涨颜色
       */
      increasingColor: '#5DB300',
      /**
       * 下跌颜色
       */
      decreasingColor: '#FF4A4A'
    }

    /**
     * 最低最高价格标记文字颜色
     */
    this.lowestHighestPriceMarkTextColor = '#898989'

    /**
     * 最低最高价格标记文字大小
     */
    this.lowestHighestPriceMarkTextSize = 10

    /**
     * 最高最低价格标记值格式化
     */
    this.lowestHighestValueFormatter = null

    /**
     * 最大价格标记参数
     */
    this.highestPriceMark = {
      display: true,
      color: '#898989',
      textSize: 10,
      valueFormatter: null
    }

    /**
     * 最小价格标记参数
     */
    this.lowestPriceMark = {
      display: true,
      color: '#898989',
      textSize: 10,
      valueFormatter: null
    }

    /**
     * 最新价标记参数
     */
    this.lastPriceMark = {
      display: true,
      lineStyle: LineStyle.DASH,
      dashValue: [8, 8],
      lineSize: 1,
      lineColor: '#B9B9B9'
    }
  }
}

export default Candle
