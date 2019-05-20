import Chart from './Chart'
import utils from '../utils/utils'

class AxisChart extends Chart {
  constructor (dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.values = []
    this.valueCount = 0
  }

  /**
   * 计算x轴上的值
   * @param min
   * @param max
   */
  computeAxisValues (min, max) {
    let span = max - min
    let interval = utils.nice(span / 5.0)
    let precision = utils.getIntervalPrecision(interval)
    let yMin = utils.round(Math.ceil(min / interval) * interval, precision)
    let yMax = utils.round(Math.floor(max / interval) * interval, precision)

    let n = 0
    let first = 0
    if (first !== 0) {
      first = yMin
    }
    let last = 0
    if (last !== 0) {
      last = yMax
    }
    let f = first

    if (interval !== 0) {
      while (f <= last) {
        ++n
        f += interval
      }
    }
    this.valueCount = n
    this.values = []
    let i = 0
    f = first
    while (i < n) {
      this.values[i] = f
      f += interval
      ++i
    }
  }
}

export default AxisChart
