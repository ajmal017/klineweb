export const DrawLineType = {
  /**
   * 无
   */
  NONE: 'none',

  /**
   * 水平直线
   */
  HORIZONTAL_LINE: 'horizontal_line',

  /**
   * 垂直直线
   */
  VERTICAL_LINE: 'vertical_line',

  /**
   * 普通直线
   */
  LINE: 'line',

  /**
   * 水平线段
   */
  HORIZONTAL_SEGMENT: 'horizontal_segment',

  /**
   * 垂直线段
   */
  VERTICAL_SEGMENT: 'vertical_segment',

  /**
   * 普通线段
   */
  SEGMENT: 'segment',

  /**
   * 箭头线
   */
  ARROW_LINE: 'arrow_line'
}

class DrawLineData {
  constructor () {
    this.drawingLineType = DrawLineType.NONE
    // 开始绘制时的点
    this.startDrawPoint = { x: 0, y: 0 }
    // 正在绘制的线数据
    this.drawingLineDatas = []
    // 绘制的水平线数据集合
    this.horizontalLineDatas = []
    // 绘制的垂直线数据集合
    this.verticalLineDatas = []
    // 绘制的普通直线数据集合
    this.lineDatas = []
    // 绘制的水平线段数据集合
    this.horizontalSegmentDatas = []
    // 绘制的垂直线段数据集合
    this.verticalSegmentDatas = []
    // 普通线段数据集合
    this.segmentDatas = []
    // 箭头线数据集合
    this.arrowLineDatas = []
  }
}

export default DrawLineData
