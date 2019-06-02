import { LineStyle } from './Component'

/**
 * 指标提示显示规则
 */
export const IndicatorDisplayRule = {
  /**
   * 总是显示
   */
  ALWAYS: 'always',
  /**
   * 跟随十字光标显示
   */
  FOLLOW_CROSS: 'follow_cross',

  /**
   * 一直不显示
   */
  NONE: 'none'
}

class Tooltip {
  constructor () {
    /**
     * 文字大小
     */
    this.textSize = 12

    /**
     * 光标线配置
     */
    this.crossLine = {
      display: true,
      style: LineStyle.SOLID,
      dashValue: [8, 8],
      size: 1,
      color: '#505050',
      text: {
        color: '#EDEDED',
        size: 12,
        rectStrokeLineSize: 1,
        rectStrokeLineColor: '#EDEDED',
        rectFillColor: '#505050',
        margin: 4,
        valueFormatter: null
      }
    }

    /**
     * 基础数据显示配置
     */
    this.generalData = {
      labels: ['时间', '开', '收', '高', '低'],
      values: null,
      valueFormatter: null,
      text: {
        size: 12,
        color: '#898989',
        margin: 20
      }
    }

    /**
     * 指标数据显示配置
     */
    this.indicatorData = {
      displayRule: IndicatorDisplayRule.ALWAYS,
      valueFormatter: null,
      text: {
        size: 12,
        margin: 20
      }
    }
  }
}

export default Tooltip
