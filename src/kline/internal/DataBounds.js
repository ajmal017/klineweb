class DataBounds {
  constructor (viewPortHandler) {
    this.viewPortHandler = viewPortHandler
    // 数据源
    this.dataList = []
    // 数据绘制起始位置
    this.min = 0
    // 绘制的数据条数
    this.range = 120
    // 最大绘制条数
    this.maxRange = 180
    // 最小绘制条数
    this.minRange = 20
    // 没条数据的所占的空间
    this.dataSpace = 0
    // 每条数据之间的距离比例
    this.dataMarginSpaceRate = 0.2
    // 当前数据的位置
    this.currentDataPos = 0
  }

  /**
   * 获取柱状图之间的间隙
   */
  space () {
    this.dataSpace = (this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft()) / this.range
  }

  moveToLast () {
    if (this.dataList.length > this.range) {
      this.min = this.dataList.length - this.range
      this.currentDataPos = this.dataList.length - 1
    } else {
      this.min = 0
    }
  }
}

export default DataBounds
