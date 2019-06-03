import Event from './Event'
import { FRESHEN_DRAW_LINE_CHART } from '../../chart/KLineChart'
import { MarkType, ActiveType } from '../MarkData'

class MarkEvent extends Event {
  constructor (kline, markData, dataBounds, viewPortHandler) {
    super(kline, dataBounds, viewPortHandler)
    this.markData = markData
  }

  /**
   * 绘制结束
   */
  drawLineEnd () {
    this.markData.markingType = MarkType.NONE
    this.markData.markingDatas = []
    this.kline.tooltipCanvasDom.style.display = ''
  }

  /**
   * 开始绘制
   */
  drawLineStart (markingType) {
    this.markData.markingType = markingType
    this.markData.markingDatas = []
    this.kline.tooltipCanvasDom.style.display = 'none'
  }

  /**
   * 鼠标按下时事件
   * @param e
   */
  mouseDown (e) {
    this.stopEvent(e)
    let point = this.getCanvasPoint(e)
    if (!this.isValidEvent(point)) {
      return
    }
    if (e.button === 0) {
      if (this.markData.markingType === MarkType.NONE) {
        if (this.performHorizontalLineMouseLeftClick(point) ||
          this.performVerticalLineMouseLeftClick(point)) {
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
          return
        }
      }
      if (this.markData.markingDatas.length === 0) {
        this.markData.markingDatas[0] = point
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
      } else if (this.markData.markingDatas.length === 1) {
        switch (this.markData.markingType) {
          case MarkType.HORIZONTAL_LINE: {
            this.markData.horizontalLineDatas.push(point)
            break
          }
          case MarkType.VERTICAL_LINE: {
            this.markData.verticalLineDatas.push(point)
            break
          }
        }
        this.drawLineEnd()
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
      }
    } else if (e.button === 2) {
      if (this.markData.markingType !== MarkType.NONE) {
        this.drawLineEnd()
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
        return
      }
      if (this.performHorizontalLineMouseRightClick(point) ||
        this.performVerticalLineMouseRightClick(point)) {
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
        // return
      }
    }
  }

  /**
   * 处理水平直线鼠标左键点击事件
   * @param point
   */
  performHorizontalLineMouseLeftClick (point) {
    let horizontalLineDataLength = this.markData.horizontalLineDatas.length
    for (let i = 0; i < horizontalLineDataLength; i++) {
      let lineData = this.markData.horizontalLineDatas[i]
      if (point.y < lineData.y + 10 && point.y > lineData.y - 10 &&
        point.x < lineData.x + 10 && point.x > lineData.x - 10) {
        this.markData.horizontalLineDatas.splice(i, 1)
        this.drawLineStart(MarkType.HORIZONTAL_LINE)
        this.markData.markingDatas[0] = point
        return true
      }
    }
    return false
  }

  /**
   * 处理水平直线鼠标左键点击事件
   * @param point
   */
  performHorizontalLineMouseRightClick (point) {
    let horizontalLineDataLength = this.markData.horizontalLineDatas.length
    for (let i = 0; i < horizontalLineDataLength; i++) {
      let lineData = this.markData.horizontalLineDatas[i]
      if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
        if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
          if (this.markData.markingType === MarkType.NONE) {
            this.markData.horizontalLineDatas.splice(i, 1)
            this.drawLineEnd()
            return true
          }
        }
      } else {
        if (point.y < lineData.y + 4 && point.y > lineData.y - 4) {
          if (this.markData.markingType === MarkType.NONE) {
            this.markData.horizontalLineDatas.splice(i, 1)
            this.drawLineEnd()
            return true
          }
        }
      }
    }
    return false
  }

  /**
   * 处理垂直直线鼠标左键点击事件
   * @param point
   */
  performVerticalLineMouseLeftClick (point) {
    let verticalLineDataLength = this.markData.verticalLineDatas.length
    for (let i = 0; i < verticalLineDataLength; i++) {
      let lineData = this.markData.verticalLineDatas[i]
      if (point.y < lineData.y + 10 && point.y > lineData.y - 10 &&
        point.x < lineData.x + 10 && point.x > lineData.x - 10) {
        this.markData.verticalLineDatas.splice(i, 1)
        this.drawLineStart(MarkType.VERTICAL_LINE)
        this.markData.markingDatas[0] = point
        return true
      }
    }
    return false
  }

  /**
   * 处理水平直线鼠标左键点击事件
   * @param point
   */
  performVerticalLineMouseRightClick (point) {
    let verticalLineDataLength = this.markData.verticalLineDatas.length
    for (let i = 0; i < verticalLineDataLength; i++) {
      let lineData = this.markData.verticalLineDatas[i]
      if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
        if (point.y < lineData.x + 10 && point.x > lineData.x - 10) {
          if (this.markData.markingType === MarkType.NONE) {
            this.markData.verticalLineDatas.splice(i, 1)
            this.drawLineEnd()
            return true
          }
        }
      } else {
        if (point.x < lineData.x + 4 && point.x > lineData.x - 4) {
          if (this.markData.markingType === MarkType.NONE) {
            this.markData.verticalLineDatas.splice(i, 1)
            this.drawLineEnd()
            return true
          }
        }
      }
    }
    return false
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
    if (this.markData.markingType === MarkType.NONE) {
      if (this.performHorizontalLineEventMove(point) ||
        this.performVerticalLineEventMove(point)) {
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
        return
      }
    }

    if (this.markData.markingDatas.length === 0) {
      this.markData.startMarkPoint = point
      this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
    } else if (this.markData.markingDatas.length === 1) {
      this.markData.markingDatas[0] = point
      this.kline.freshen(FRESHEN_DRAW_LINE_CHART)
    }
  }

  /**
   * 处理鼠标移动时对水平直线的处理
   * @param point
   */
  performHorizontalLineEventMove (point) {
    let horizontalLineDataLength = this.markData.horizontalLineDatas.length
    let isActive = false
    for (let i = 0; i < horizontalLineDataLength; i++) {
      let lineData = this.markData.horizontalLineDatas[i]
      if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
        if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
          this.markData.horizontalLineDatas[i].activeType = ActiveType.POINT
          isActive = true
        }
      } else {
        if (point.y < lineData.y + 4 && point.y > lineData.y - 4) {
          this.markData.horizontalLineDatas[i].activeType = ActiveType.LINE
          isActive = true
        } else {
          this.markData.horizontalLineDatas[i].activeType = ActiveType.NONE
        }
      }
    }
    return isActive
  }

  /**
   * 处理鼠标移动时对水平直线的处理
   * @param point
   */
  performVerticalLineEventMove (point) {
    let verticalLineDataLength = this.markData.verticalLineDatas.length
    let isActive = false
    for (let i = 0; i < verticalLineDataLength; i++) {
      let lineData = this.markData.verticalLineDatas[i]
      if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
        if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
          this.markData.verticalLineDatas[i].activeType = ActiveType.POINT
          isActive = true
        }
      } else {
        if (point.x < lineData.x + 4 && point.x > lineData.x - 4) {
          this.markData.verticalLineDatas[i].activeType = ActiveType.LINE
          isActive = true
        } else {
          this.markData.verticalLineDatas[i].activeType = ActiveType.NONE
        }
      }
    }
    return isActive
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

export default MarkEvent
