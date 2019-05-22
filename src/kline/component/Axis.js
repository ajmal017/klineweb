import Type from '../constant/Type'

class Axis {
  constructor () {
    /**
     * 是否显示整个轴
     */
    this.display = true
    /**
     * 整个轴的颜色
     */
    this.color = '#707070'

    /**
     * 轴线配置
     */
    this.axisLine = {
      display: true,
      color: '#707070',
      size: 1
    }

    /**
     * 分割文字配置
     */
    this.tickText = {
      display: true,
      position: Type.YAxisTextPosition.OUTSIDE,
      color: '#707070',
      size: 10,
      margin: 3,
      valueFormatter: null
    }

    /**
     * 分割tick线配置
     */
    this.tickLine = {
      display: true,
      size: 3,
      color: '#707070'
    }

    /**
     * 分割线配置
     */
    this.separatorLine = {
      display: false,
      size: 1,
      color: '#B8B8B8',
      style: Type.LineStyle.DASH,
      dashValue: [8, 8]
    }
  }
}

export default Axis
