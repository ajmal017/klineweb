class ViewPortHandler {
  constructor () {
    // 绘制区域参数
    this.contentRect = {
      left: 0, right: 0, top: 0, bottom: 0
    }
    // 整个view的高度
    this.viewHeight = 0
    // 整个view的宽度
    this.viewWidth = 0
  }

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setChartDimens (width, height) {
    this.viewWidth = width
    this.viewHeight = height
    this.restrainViewPort(
      this.contentLeft(),
      this.contentTop(),
      width - this.contentRight(),
      height - this.contentBottom()
    )
  }

  restrainViewPort (offsetLeft, offsetTop, offsetRight, offsetBottom) {
    this.contentRect.left = offsetLeft
    this.contentRect.right = this.viewWidth - offsetRight
    this.contentRect.top = offsetTop
    this.contentRect.bottom = this.viewHeight - offsetBottom
  }

  contentTop () {
    return this.contentRect.top
  }

  contentLeft () {
    return this.contentRect.left
  }

  contentRight () {
    return this.contentRect.right
  }

  contentBottom () {
    return this.contentRect.bottom
  }

  /**
   * 获取中间点坐标
   */
  getContentCenter () {
    let point = {}
    point.x = (this.contentRect.left + this.contentRect.right) / 2
    point.y = (this.contentRect.top + this.contentRect.bottom) / 2
    return point
  }

  isInBoundsX (x) {
    return this.isInBoundsLeft(x) && this.isInBoundsRight(x)
  }

  isInBoundsLeft (x) {
    return this.contentRect.left <= x + 1
  }

  isInBoundsRight (x) {
    let tx = (parseInt(x * 100)) / 100
    return this.contentRect.right >= tx - 1
  }
}

export default ViewPortHandler
