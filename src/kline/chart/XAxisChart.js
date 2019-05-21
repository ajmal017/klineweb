import AxisChart from './AxisChart'
import utils from '../utils/utils'
import Type from '../constant/Type'

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
    if (!this.xAxis.displayAxisLine) {
      return
    }
    canvas.strokeStyle = this.xAxis.axisLineColor
    canvas.lineWidth = this.xAxis.axisLineSize
    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom())
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom())
    canvas.closePath()
    canvas.stroke()
  }

  /**
   * 绘制坐标轴上的文字
   * @param canvas Canvas
   */
  drawAxisLabels (canvas) {
    if (!this.xAxis.displayTickText) {
      return
    }

    canvas.font = this.xAxis.tickTextSize * 2 + 'px Arial'
    canvas.textAlign = 'center'
    canvas.fillStyle = this.xAxis.tickTextColor

    let positions = this.pointValuesToPixel()
    let labelHeight = this.xAxis.tickTextSize * 2
    let startY = this.viewPortHandler.contentBottom() + this.xAxis.textMarginSpace * 2 + labelHeight
    if (this.xAxis.displayTickLine) {
      startY += this.xAxis.tickLineSize * 2
    }
    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        let kLineModel = this.dataBounds.dataList[parseInt(this.values[i / 2])]
        let timestamp = kLineModel.timestamp
        let label = utils.formatDate(timestamp)
        canvas.fillText(label, x, startY)
      }
    }
  }

  /**
   * 绘制分割线
   * @param canvas Canvas
   */
  drawSeparatorLines (canvas) {
    if (!this.xAxis.displaySeparatorLine) {
      return
    }
    canvas.strokeStyle = this.xAxis.separatorLineColor
    canvas.lineWidth = this.xAxis.separatorLineSize

    if (this.xAxis.separatorLineStyle === Type.LineStyle.DASH) {
      canvas.setLineDash([8, 8])
    }
    let positions = this.pointValuesToPixel()

    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        canvas.beginPath()
        canvas.moveTo(x, this.viewPortHandler.contentTop())
        canvas.lineTo(x, this.viewPortHandler.contentBottom())
        canvas.closePath()
        canvas.stroke()
      }
    }
    canvas.setLineDash(null)
  }

  /**
   * 绘制tick线
   * @param canvas Canvas
   */
  drawTickLines (canvas) {
    if (!this.xAxis.displayTickLine) {
      return
    }
    canvas.lineWidth = 1
    canvas.strokeStyle = this.xAxis.axisLineColor
    let positions = this.pointValuesToPixel()

    let startY = this.viewPortHandler.contentBottom()
    let endY = startY + this.xAxis.tickLineSize * 2

    for (let i = 0; i < positions.length; i += 2) {
      let x = positions[i]

      if (this.viewPortHandler.isInBoundsX(x)) {
        canvas.beginPath()
        canvas.moveTo(x, startY)
        canvas.lineTo(x, endY)
        canvas.closePath()
        canvas.stroke()
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
