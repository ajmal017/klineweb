import Chart from './Chart'
import { ActiveType, MarkType } from '../internal/MarkData'

class MarkChart extends Chart {
  constructor (mark, markData, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.mark = mark
    this.markData = markData
  }

  draw (canvas) {
    canvas.save()
    canvas.beginPath()
    canvas.rect(
      this.viewPortHandler.contentLeft(),
      this.chartTop,
      this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(),
      this.chartHeight
    )
    canvas.closePath()
    canvas.clip()

    this.drawStartPoint(canvas)
    this.drawHorizontalVerticalLine(canvas, this.markData.horizontalLineDatas, MarkType.HORIZONTAL_LINE)
    this.drawHorizontalVerticalLine(canvas, this.markData.verticalLineDatas, MarkType.VERTICAL_LINE)
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
   * 绘制垂直直线
   * @param canvas
   */
  drawVerticalLine (canvas) {
  }

  /**
   * 绘制水平直线
   */
  drawHorizontalVerticalLine (canvas, lineDatas, markType) {
    let lineDataLength = lineDatas.length
    for (let i = 0; i < lineDataLength; i++) {
      let point = lineDatas[i]
      canvas.lineWidth = 1
      if (point.activeType === ActiveType.LINE || point.activeType === ActiveType.POINT) {
        this.drawPoint(canvas, point, point.activeType === ActiveType.POINT)
        canvas.strokeStyle = this.mark.line.highlight.color
      }
      canvas.beginPath()
      if (markType === MarkType.HORIZONTAL_LINE) {
        canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
        canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      } else {
        canvas.moveTo(point.x, this.viewPortHandler.contentTop())
        canvas.lineTo(point.x, this.viewPortHandler.contentBottom())
      }
      canvas.stroke()
      canvas.closePath()
    }
    let point = this.markData.markingDatas[0]
    if (point && this.markData.markingType === markType) {
      canvas.lineWidth = 1
      canvas.strokeStyle = this.mark.line.highlight.color
      canvas.beginPath()
      if (markType === MarkType.HORIZONTAL_LINE) {
        canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
        canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      } else {
        canvas.moveTo(point.x, this.viewPortHandler.contentTop())
        canvas.lineTo(point.x, this.viewPortHandler.contentBottom())
      }
      canvas.stroke()
      canvas.closePath()
      this.drawPoint(canvas, point, true)
    }
  }
}

export default MarkChart
