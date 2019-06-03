import Chart from './Chart'
import { ActiveType, MarkType } from '../internal/MarkData'

class MarkChart extends Chart {
  constructor (mark, markData, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.mark = mark
    this.markData = markData
  }

  draw (canvas) {
    this.drawStartPoint(canvas)
    this.drawHorizontalLine(canvas)
    this.drawVerticalLine(canvas)
  }

  /**
   * 绘制点
   * @param canvas
   * @param point
   * @param isHighlight
   */
  drawPoint (canvas, point, isHighlight) {
    let radius = (isHighlight ? this.mark.point.highlight.radius : this.mark.point.radius) * 2
    canvas.fillStyle = isHighlight ? this.mark.point.highlight.fillColor : this.mark.point.fillColor
    canvas.strokeStyle = isHighlight ? this.mark.point.highlight.strokeColor : this.mark.point.strokeColor
    canvas.lineWidth = 1
    canvas.beginPath()
    canvas.arc(point.x, point.y, radius, 0, Math.PI * 2, true)
    canvas.fill()
    canvas.closePath()
    canvas.beginPath()
    canvas.arc(point.x, point.y, radius, 0, Math.PI * 2, true)
    canvas.stroke()
    canvas.closePath()
  }

  /**
   * 绘制开始点
   * @param canvas
   */
  drawStartPoint (canvas) {
    if (this.markData.markingType !== MarkType.NONE && this.markData.markingDatas.length === 0) {
      let point = this.markData.startMarkPoint
      this.drawPoint(canvas, point, true)
    }
  }

  /**
   * 绘制水平直线
   * @param canvas
   */
  drawHorizontalLine (canvas) {
    let horizontalLineDataLength = this.markData.horizontalLineDatas.length
    for (let i = 0; i < horizontalLineDataLength; i++) {
      let point = this.markData.horizontalLineDatas[i]
      canvas.lineWidth = 1
      if (point.activeType === ActiveType.LINE || point.activeType === ActiveType.POINT) {
        this.drawPoint(canvas, point, point.activeType === ActiveType.POINT)
        canvas.strokeStyle = this.mark.line.highlight.color
      }
      canvas.beginPath()
      canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
      canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      canvas.stroke()
      canvas.closePath()
    }
    let point = this.markData.markingDatas[0]
    if (point && this.markData.markingType === MarkType.HORIZONTAL_LINE) {
      canvas.lineWidth = 1
      canvas.strokeStyle = this.mark.line.highlight.color
      canvas.beginPath()
      canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
      canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      canvas.stroke()
      canvas.closePath()
      this.drawPoint(canvas, point, true)
    }
  }

  /**
   * 绘制垂直直线
   * @param canvas
   */
  drawVerticalLine (canvas) {
  }
}

export default MarkChart
