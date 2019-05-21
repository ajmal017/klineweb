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
    if (span < 0) {
      this.values = []
      this.valueCount = 0
      return
    }
    let interval = +utils.nice(span / 5.0)
    let precision = utils.getIntervalPrecision(interval)
    let first = +utils.round(Math.ceil(min / interval) * interval, precision)
    let last = +utils.round(Math.floor(max / interval) * interval, precision)
    let n = 0
    let f = first

    if (interval !== 0) {
      while (f <= (+last)) {
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
