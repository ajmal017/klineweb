import Type from '../constant/Type'

class Axis {
  constructor () {
    /**
     * 是否显示轴线
     */
    this.displayAxisLine = true

    /**
     * 轴线的颜色
     */
    this.axisLineColor = '#707070'

    /**
     * 轴线的尺寸
     */
    this.axisLineSize = 1

    /**
     * 是否显示轴线上的文字
     */
    this.displayTickText = true

    /**
     * 分割文字颜色
     */
    this.tickTextColor = '#707070'

    /**
     * 分割文字的大小
     */
    this.tickTextSize = 10

    /**
     * 是否显示tick线
     */
    this.displayTickLine = true

    /**
     * 轴线上文字线的高度
     */
    this.tickLineSize = 3

    /**
     * 是否显示分割线
     */
    this.displaySeparatorLine = false

    /**
     * 分割线的尺寸
     */
    this.separatorLineSize = 1

    /**
     * 分割线颜色
     */
    this.separatorLineColor = '#B8B8B8'

    /**
     * 分割线类型
     */
    this.separatorLineStyle = Type.LineStyle.DASH

    /**
     * 文字的margin
     */
    this.textMarginSpace = 3
  }
}

export default Axis
