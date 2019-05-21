import Chart from './Chart'
import YAxisChart from './YAxisChart'
import Type from '../constant/Type'

class IndicatorChart extends Chart {
  constructor (indicator, xAxis, yAxis, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.yAxisChart = new YAxisChart(yAxis, dataBounds, viewPortHandler)
    this.indicatorType = Type.IndicatorType.NO
  }

  setChartDimens (height, top) {
    super.setChartDimens(height, top)
    this.yAxisChart.setChartDimens(height, top)
  }

  draw () {}
}

export default IndicatorChart
