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
    this.contentRect.right = width
    this.contentRect.bottom = height
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

  getContentCenter () {
    let point = {}
    point.x = (this.contentRect.left + this.contentRect.right) / 2
    point.y = (this.contentRect.top + this.contentRect.bottom) / 2
    return point
  }
}

export default ViewPortHandler
