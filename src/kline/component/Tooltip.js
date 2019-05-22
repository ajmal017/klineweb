import Type from '../constant/Type'

class Tooltip {
  constructor () {
    /**
     * 文字大小
     */
    this.textSize = 12

    /**
     * 文字间距
     */
    this.textMargin = 20

    /**
     * 光标线配置
     */
    this.crossLine = {
      style: Type.LineStyle.SOLID,
      dashValue: [8, 8],
      size: 1,
      color: '#505050',
      text: {
        color: '#EDEDED',
        size: 10,
        rectStrokeLineSize: 1,
        rectStrokeLineColor: '#EDEDED',
        rectFillColor: '#505050'
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
      displayRule: Type.IndicatorDisplayRule.ALWAYS,
      text: {
        size: 12,
        margin: 20
      }
    }
  }
}

export default Tooltip
