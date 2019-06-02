import Event from './Event'
import { FRESHEN_DRAW_LINE_CHART } from '../../chart/KLineChart'
import {DrawLineType} from "../DrawLineData";

class DrawLineEvent extends Event {
  constructor (kline, drawLineData, dataBounds, viewPortHandler) {
    super(kline, dataBounds, viewPortHandler)
    this.drawLineData = drawLineData
    this.mouseDownPoint = { x: 0, y: 0 }
  }

  /**
   * 绘制结束
   */
  drawLineEnd () {
    this.drawLineData.drawingLineType = DrawLineType.NONE
    this.drawLineData.drawingLineDatas = []
    this.kline.tooltipCanvasDom.style.display = ''
  }

  /**
   * 鼠标按下时事件
   * @param e
   */
  mouseDown (e) {
    this.stopEvent(e)
    if (e.button === 0) {
      let point = this.getCanvasPoint(e)
      if (!this.isValidEvent(point)) {
        return
      }
      if (this.drawLineData.drawingLineDatas.length === 0) {
        this.drawLineData.drawingLineDatas[0] = point
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
      } else if (this.drawLineData.drawingLineDatas.length === 1) {
        this.drawLineData.horizontalLineDatas.push(point)
        this.drawLineEnd()
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
      }
    }
  }

  /**
   * 鼠标抬起时事件
   * @param e
   */
  mouseUp (e) {
    this.stopEvent(e)
  }

  mouseLeave (e) {
    this.stopEvent(e)
  }

  /**
   * 鼠标移动时事件
   * @param e
   */
  mouseMove (e) {
    this.stopEvent(e)
    let point = this.getCanvasPoint(e)
    if (!this.isValidEvent(point)) {
      return
    }
    if (this.drawLineData.drawingLineDatas.length === 0) {
      this.drawLineData.startDrawPoint = point
      this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
    } else if (this.drawLineData.drawingLineDatas.length === 1) {
      this.drawLineData.drawingLineDatas[0] = point
      this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
    }
  }

  /**
   * 鼠标滚轮事件
   * @param e
   */
  mouseWheel (e) {
    this.stopEvent(e)
  }

  /**
   * 是否是有效事件
   * @param point
   * @returns {boolean}
   */
  isValidEvent (point) {
    return !(point.x < this.viewPortHandler.contentLeft() ||
      point.x > this.viewPortHandler.contentRight() ||
      point.y < this.viewPortHandler.contentTop() ||
      point.y > this.kline.candleChart.chartTop + this.kline.candleChart.chartHeight)
  }
}

export default DrawLineEvent
