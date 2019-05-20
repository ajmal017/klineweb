import AxisChart from './AxisChart'

class XAxisChart extends AxisChart {
  constructor (xAxis, viewPortHandler) {
    super(viewPortHandler)
    this.xAxis = xAxis
  }

  draw (canvas) {
  }
}

export default XAxisChart
