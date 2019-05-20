import Chart from './Chart'
import YAxisChart from './YAxisChart'

class IndicatorChart extends Chart {
  constructor (indicator, xAxis, yAxis, dataBounds, viewPortHandler) {
    super(viewPortHandler)
    this.yAxisChart = new YAxisChart(yAxis, dataBounds, viewPortHandler)
  }

  setChartDimens (height, top) {
    super.setChartDimens(height, top)
    this.yAxisChart.setChartDimens(height, top)
  }

  draw () {}
}

export default IndicatorChart
