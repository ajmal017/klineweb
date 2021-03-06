import Event from './Event'
import { FRESHEN_CHART, FRESHEN_TOOLTIP } from '../../chart/KLineChart'

/**
 * 无
 */
const TOUCH_NO = 0

/**
 * 拖拽
 */
const TOUCH_DRAG = 1

/**
 * 缩放
 */
const TOUCH_ZOOM = 2

/**
 *
 */
const TOUCH_POST_ZOOM = 3

/**
 * 十字光标
 */
const TOUCH_CROSS = 4

/**
 * 十字光标取消
 */
const TOUCH_CROSS_CANCEL = 5

class TouchEvent extends Event {
  constructor (kline, dataBounds, viewPortHandler) {
    super(kline, dataBounds, viewPortHandler)
    // 事件模型
    this.touchMode = TOUCH_NO
    this.touchStartPoint = { x: 0, y: 0 }
    this.touchMovePoint = { x: 0, y: 0 }
    this.touchCrossPoint = { x: 0, y: 0 }
    this.savedDist = 1
    this.savedXDist = 1
    this.touchRange = this.dataBounds.range
    this.touchStartPosition = this.dataBounds.min

    this.delayTimeout = null
    this.delayActiveCross = () => {
      if (this.touchMode === TOUCH_NO || this.touchMode === TOUCH_CROSS_CANCEL) {
        if (this.kline) {
          this.touchMode = TOUCH_CROSS
          this.touchCrossPoint = { x: this.touchStartPoint.x, y: this.touchStartPoint.y }
          dataBounds.calcCurrentDataIndex(this.touchCrossPoint.x)
          this.kline.tooltipChart.setCross(this.touchCrossPoint.y, true)
          this.kline.freshen(FRESHEN_TOOLTIP)
        }
      }
    }
  }

  /**
   * 触摸事件开始
   * @param e
   */
  touchStart (e) {
    if (e.targetTouches.length === 1) {
      let point = this.getCanvasPoint(e.targetTouches[0])
      this.touchStartPoint = { x: point.x, y: point.y }
      this.touchMovePoint = { x: point.x, y: point.y }
      if (!this.isValidEvent(this.touchStartPoint)) {
        return
      }
      if (this.touchMode === TOUCH_CROSS) {
        this.stopEvent(e)
        let crossRadius = this.distance(point.x, this.touchCrossPoint.x, point.y, this.touchCrossPoint.y)
        if (crossRadius < 10) {
          this.performCross(e)
        } else {
          this.touchMode = TOUCH_CROSS_CANCEL
          this.kline.tooltipChart.setCross(0, false)
          this.kline.freshen(FRESHEN_TOOLTIP)
        }
      } else {
        this.touchMode = TOUCH_NO
      }
      this.removeDelayActiveCross()
      this.postDelayDelayActiveCross()
    } else if (e.targetTouches.length > 1) {
      if (!this.isValidEvent(this.touchStartPoint)) {
        return
      }
      if (this.touchMode !== TOUCH_CROSS) {
        this.stopEvent(e)
        this.savedDist = this.spacing(e)
        this.savedXDist = this.getXDist(e)
        if (this.savedDist > 3) {
          this.touchMode = TOUCH_ZOOM
        }
        this.touchRange = this.dataBounds.range
        this.touchStartPosition = this.dataBounds.min
      }
    }
  }

  /**
   * 触摸事件移动
   * @param e
   */
  touchMove (e) {
    if (!this.isValidEvent(this.touchStartPoint)) {
      return
    }
    switch (this.touchMode) {
      case TOUCH_ZOOM: {
        this.stopEvent(e)
        this.performZoom(e)
        break
      }
      case TOUCH_DRAG: {
        this.stopEvent(e)
        this.performDrag(e)
        break
      }
      case TOUCH_CROSS: {
        this.stopEvent(e)
        this.performCross(e)
        break
      }
      case TOUCH_CROSS_CANCEL: {
        this.removeDelayActiveCross()
        break
      }
      case TOUCH_NO: {
        let point = this.getCanvasPoint(e.targetTouches[0])
        let distance = Math.abs(this.distance(point.x, this.touchStartPoint.x, point.y, this.touchStartPoint.y))
        if (distance > 10) {
          let distanceX = Math.abs(point.x - this.touchStartPoint.x)
          let distanceY = Math.abs(point.y - this.touchStartPoint.y)
          if (distanceY <= distanceX) {
            this.stopEvent(e)
            this.kline.tooltipChart.setCross(0, false)
            this.touchMode = TOUCH_DRAG
            this.kline.freshen(FRESHEN_TOOLTIP)
          }
        }
        this.removeDelayActiveCross()
      }
    }
  }

  /**
   * 触摸事件结束
   * @param e
   */
  touchEnd (e) {
    if (!this.isValidEvent(this.touchStartPoint)) {
      return
    }
    this.stopEvent(e)
    if (e.targetTouches.length > 0) {
      if (this.touchMode === TOUCH_CROSS) {
        this.performCross(e)
      } else {
        this.touchMode = TOUCH_POST_ZOOM
      }
    } else {
      this.removeDelayActiveCross()
      if (this.touchMode !== TOUCH_CROSS) {
        // 拿起
        this.touchMode = TOUCH_NO
        this.kline.tooltipChart.setCross(0, false)
        this.kline.freshen(FRESHEN_TOOLTIP)
      }
    }
  }

  /**
   * 处理拖拽视图事件
   * @param e
   * @returns {boolean}
   */
  performDrag (e) {
    // 左右滑动事件
    let point = this.getCanvasPoint(e.targetTouches[0])
    let moveDist = point.x - this.touchMovePoint.x
    if (moveDist < 0 - this.dataBounds.dataSpace / 2) {
      if (this.dataBounds.min + this.dataBounds.range === this.dataBounds.dataList.length || this.dataBounds.dataList.length < this.dataBounds.range) {
        return false
      }

      this.touchMovePoint.x = point.x

      let moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0)
      if (moveRange === 0) {
        moveRange = 1
      }

      this.dataBounds.min += moveRange
      if (this.dataBounds.min >= this.dataBounds.dataList.length - this.dataBounds.range) {
        this.dataBounds.min = this.dataBounds.dataList.length - this.dataBounds.range
      }
      this.kline.freshen(FRESHEN_CHART)
    } else if (moveDist > this.dataBounds.dataSpace / 2) {
      if (this.dataBounds.min === 0 || this.dataBounds.dataList.length < this.dataBounds.range) {
        return false
      }

      this.touchMovePoint.x = point.x

      let moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0)
      if (moveRange === 0) {
        moveRange = 1
      }

      this.dataBounds.min -= moveRange
      if (this.dataBounds.min <= 0) {
        this.dataBounds.min = 0
      }
      this.kline.freshen(FRESHEN_CHART)
    }
  }

  /**
   * 处理缩放
   * @param e
   * @returns {boolean}
   */
  performZoom (e) {
    if (e.targetTouches.length > 1) {
      let totalDist = this.spacing(e)
      if (totalDist > 10) {
        let xDist = this.getXDist(e)
        // x轴方向 scale
        let scaleX = xDist / this.savedXDist

        // 是否缩小
        let isZoomingOut = scaleX < 1

        if (isZoomingOut) {
          if (this.dataBounds.range >= this.dataBounds.maxRange) {
            // 无法继续缩小
            return false
          }
        } else {
          if (this.dataBounds.range <= this.dataBounds.minRange) {
            // 无法继续放大
            return false
          }
        }

        // 计算缩放后的range大小
        this.dataBounds.range = +(this.touchRange / scaleX).toFixed(0)

        this.dataBounds.range = Math.min(Math.max(this.dataBounds.range, this.dataBounds.minRange), this.dataBounds.maxRange)

        this.dataBounds.min = this.touchStartPosition + this.touchRange - this.dataBounds.range
        if (this.dataBounds.min + this.dataBounds.range > this.dataBounds.dataList.length) {
          this.dataBounds.min = 0
        }
        if (this.dataBounds.min < 0) {
          this.dataBounds.min = 0
        }
        this.kline.freshen(FRESHEN_CHART)
      }
    }
  }

  /**
   * 处理移动光标
   * @param e
   * @returns {boolean}
   */
  performCross (e) {
    let point = this.getCanvasPoint(e.targetTouches[0])
    this.touchCrossPoint = { x: point.x, y: point.y }
    this.dataBounds.calcCurrentDataIndex(this.touchCrossPoint.x)
    this.kline.tooltipChart.setCross(this.touchCrossPoint.y, true)
    this.kline.freshen(FRESHEN_TOOLTIP)
  }

  /**
   * 执行延迟事件
   */
  postDelayDelayActiveCross () {
    this.delayTimeout = setTimeout(this.delayActiveCross, 200)
  }

  /**
   * 移除延迟事件
   */
  removeDelayActiveCross () {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
      this.delayTimeout = null
    }
  }

  /**
   * 两点之间的距离
   * @param eventX
   * @param startX
   * @param eventY
   * @param startY
   * @returns {*}
   */
  distance (eventX, startX, eventY, startY) {
    let dx = eventX - startX
    let dy = eventY - startY
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * 计算移动距离
   * @param e
   * @returns {*}
   */
  spacing (e) {
    if (e.targetTouches.length < 2) {
      return 0
    }
    let point1 = this.getCanvasPoint(e.targetTouches[0])
    let point2 = this.getCanvasPoint(e.targetTouches[1])
    let x = Math.abs(point1.x - point2.x)
    let y = Math.abs(point1.y - point2.y)
    return Math.sqrt(x * x + y * y)
  }

  /**
   * 获取两点间x的距离
   * @param e
   * @returns {number}
   */
  getXDist (e) {
    let point1 = this.getCanvasPoint(e.targetTouches[0])
    let point2 = this.getCanvasPoint(e.targetTouches[1])
    return Math.abs(point1.x - point2.y)
  }
}

export default TouchEvent
