import Chart from './Chart'
import { DrawLineType } from '../internal/DrawLineData'

class DrawLineChart extends Chart {
  constructor (drawLineData, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.drawLineData = drawLineData
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
   */
  drawPoint (canvas, point) {
    canvas.fillStyle = '#ffffff'
    canvas.beginPath()
    canvas.arc(point.x, point.y, 10, 0, Math.PI * 2, true)
    canvas.fill()
    canvas.closePath()
  }

  /**
   * 绘制开始点
   * @param canvas
   */
  drawStartPoint (canvas) {
    if (this.drawLineData.drawingLineType !== DrawLineType.NONE && this.drawLineData.drawingLineDatas.length === 0) {
      let point = this.drawLineData.startDrawPoint
      this.drawPoint(canvas, point)
    }
  }

  /**
   * 绘制水平直线
   * @param canvas
   */
  drawHorizontalLine (canvas) {
    let horizontalLineDataLength = this.drawLineData.horizontalLineDatas.length
    for (let i = 0; i < horizontalLineDataLength; i++) {
      let point = this.drawLineData.horizontalLineDatas[i]
      canvas.lineWidth = 1
      canvas.strokeStyle = '#ffffff'
      canvas.beginPath()
      canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
      canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      canvas.stroke()
      canvas.closePath()
    }
    let point = this.drawLineData.drawingLineDatas[0]
    if (point) {
      canvas.lineWidth = 1
      canvas.strokeStyle = '#ffffff'
      canvas.beginPath()
      canvas.moveTo(this.viewPortHandler.contentLeft(), point.y)
      canvas.lineTo(this.viewPortHandler.contentRight(), point.y)
      canvas.stroke()
      canvas.closePath()
      this.drawPoint(canvas, point)
    }
  }

  /**
   * 绘制垂直直线
   * @param canvas
   */
  drawVerticalLine (canvas) {
  }
}

export default DrawLineChart
