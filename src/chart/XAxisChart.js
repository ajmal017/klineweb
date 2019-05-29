import AxisChart from './AxisChart'
import { LineStyle } from '../component/Component'
import utils from '../utils/utils'

class XAxisChart extends AxisChart {
  constructor (xAxis, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.xAxis = xAxis
  }

  /**
   * 绘制
   * @param canvas
   */
  draw (canvas) {
    this.computeAxis()
    this.drawAxisLine(canvas)
    this.drawTickLines(canvas)
    this.drawAxisLabels(canvas)
    this.drawSeparatorLines(canvas)
  }

  /**
   * 绘制轴线
   * @param canvas
   */
  drawAxisLine (canvas) {
    if (!this.xAxis.display || !this.xAxis.axisLine.display) {
      return
    }
    canvas.strokeStyle = this.xAxis.axisLine.color || this.xAxis.color
    canvas.lineWidth = this.xAxis.axisLine.size
    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom())
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom())
    canvas.stroke()
    canvas.closePath()
  }

  /**
   * 绘制坐标轴上的文字
   * @param canvas Canvas
   */
  drawAxisLabels (canvas) {
    if (!this.xAxis.display || !this.xAxis.tickText.display) {
      return
    }
    canvas.textBaseline = 'top'
    canvas.font = this.xAxis.tickText.size * 2 + 'px Arial'
    canvas.textAlign = 'center'
    canvas.fillStyle = this.xAxis.tickText.color || this.xAxis.color

    let positions = this.pointValuesToPixel()
    let startY = this.viewPortHandler.contentBottom() + this.xAxis.tickText.margin * 2
    if (this.display && this.xAxis.tickLine.display) {
      startY += this.xAxis.tickLine.size * 2
    }
    let formatter = this.xAxis.tickText.valueFormatter
    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        let kLineModel = this.dataBounds.dataList[parseInt(this.values[i / 2])]
        let timestamp = kLineModel.timestamp
        let label = utils.formatDate(timestamp)
        if (formatter) {
          label = formatter(kLineModel)
        }
        canvas.fillText(label, x, startY)
      }
    }
  }

  /**
   * 绘制分割线
   * @param canvas Canvas
   */
  drawSeparatorLines (canvas) {
    if (!this.xAxis.display || !this.xAxis.separatorLine.display) {
      return
    }
    canvas.strokeStyle = this.xAxis.separatorLine.color || this.xAxis.color
    canvas.lineWidth = this.xAxis.separatorLine.size

    if (this.xAxis.separatorLine.style === LineStyle.DASH) {
      canvas.setLineDash(this.xAxis.separatorLine.dashValue)
    }
    let positions = this.pointValuesToPixel()

    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        canvas.beginPath()
        canvas.moveTo(x, this.viewPortHandler.contentTop())
        canvas.lineTo(x, this.viewPortHandler.contentBottom())
        canvas.stroke()
        canvas.closePath()
      }
    }
    canvas.setLineDash([])
  }

  /**
   * 绘制tick线
   * @param canvas Canvas
   */
  drawTickLines (canvas) {
    if (!this.xAxis.display || !this.xAxis.tickLine.display) {
      return
    }
    canvas.lineWidth = 1
    canvas.strokeStyle = this.xAxis.axisLine.color || this.xAxis.color
    let positions = this.pointValuesToPixel()

    let startY = this.viewPortHandler.contentBottom()
    let endY = startY + this.xAxis.tickLine.size * 2

    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        canvas.beginPath()
        canvas.moveTo(x, startY)
        canvas.lineTo(x, endY)
        canvas.stroke()
        canvas.closePath()
      }
    }
  }

  /**
   * 获取值对应的坐标点值
   * @return Array
   */
  pointValuesToPixel () {
    let positions = []
    for (let i = 0; i < this.valueCount * 2; i += 2) {
      let pos = this.values[i / 2]
      positions[i] = (pos - this.dataBounds.min) * this.dataBounds.dataSpace + this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate) / 2
    }
    return positions
  }

  computeAxis () {
    let dataMin = this.dataBounds.min
    let max = Math.min(dataMin + this.dataBounds.range - 1, this.dataBounds.dataList.length - 1)
    this.computeAxisValues(dataMin, max)
  }
}

export default XAxisChart
