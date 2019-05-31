import KLineChart from './chart/KLineChart'
import { IndicatorType } from './component/Indicator'
import { LineStyle } from './component/Component'
import { YAxisTextPosition, YAxisPosition } from './component/YAxis'
import { CandleStyle, ChartStyle } from './component/Candle'
import { IndicatorDisplayRule } from './component/Tooltip'

const klinecharts = {
  IndicatorType,
  LineStyle,
  YAxisTextPosition,
  YAxisPosition,
  CandleStyle,
  ChartStyle,
  IndicatorDisplayRule,
  init (dom) {
    return new KLineChart(dom)
  },
  version () {
    return process.env.K_LINE_CHARTS_VERSION
  }
}

export default klinecharts
