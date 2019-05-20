import IndicatorChart from './IndicatorChart'

class CandleChart extends IndicatorChart {
  constructor (candle, indicator, yAxis, dataBounds, viewPortHandler) {
    super(indicator, null, yAxis, dataBounds, viewPortHandler)
  }
}

export default CandleChart
