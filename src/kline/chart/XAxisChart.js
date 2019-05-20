import AxisChart from './AxisChart'

class XAxisChart extends AxisChart {
  constructor (xAxis, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.xAxis = xAxis
  }

  draw (canvas) {
    this.computeAxis()
  }

  computeAxis () {
    let dataMin = this.dataBounds.min
    let max = Math.min(dataMin + this.dataBounds.range - 1, this.dataBounds.dataList.size - 1)
    this.computeAxisValues(dataMin, max)
  }
}

export default XAxisChart
