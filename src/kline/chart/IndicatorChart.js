import Chart from './Chart'
import YAxisChart from './YAxisChart'

class IndicatorChart extends Chart {
  constructor (indicator, xAxis, yAxis, dataBounds, viewPortHandler) {
    super(viewPortHandler)
    this.yAxisChart = new YAxisChart(yAxis, viewPortHandler)
  }

  draw () {}
}

export default IndicatorChart
