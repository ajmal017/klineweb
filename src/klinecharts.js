import KLineChart from './chart/KLineChart'
import { LineStyle } from './component/Component'
import { ChartStyle, CandleStyle } from './component/Candle'
import { IndicatorType } from './component/Indicator'
import { YAxisTextPosition, YAxisPosition } from './component/YAxis'
import { IndicatorDisplayRule } from './component/Tooltip'

export { LineStyle, ChartStyle, CandleStyle, IndicatorType, YAxisTextPosition, YAxisPosition, IndicatorDisplayRule }

const klinecharts = {
  init (dom) {
    return new KLineChart(dom)
  },
  version () {
    return process.env.VERSION
  }
}
export default klinecharts