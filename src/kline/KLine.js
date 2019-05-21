import ViewPortHandler from './internal/ViewPortHandler'
import DataBounds from './internal/DataBounds'
import CandleChart from './chart/CandleChart'
import IndicatorChart from './chart/IndicatorChart'
import XAxisChart from './chart/XAxisChart'
import YAxis from './component/YAxis'
import XAxis from './component/XAxis'
import Candle from './component/Candle'
import Indicator from './component/Indicator'
import Type from './constant/Type'

class KLine {
  constructor () {
    this.canvas = null
    this.canvasDom = null
    this.viewPortHandler = new ViewPortHandler()
    this.dataBounds = new DataBounds(this.viewPortHandler)
    this.yAxis = new YAxis()
    this.xAxis = new XAxis()
    this.candle = new Candle()
    this.indicator = new Indicator()
    this.candleChart = new CandleChart(this.candle, this.indicator, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.volChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.indicatorChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.xAxisChart = new XAxisChart(this.xAxis, this.dataBounds, this.viewPortHandler)
  }

  /**
   * 初始化
   * @param dom
   */
  init (dom) {
    let domWidth = dom.offsetWidth
    let domHeight = dom.offsetHeight
    this.canvasDom = document.createElement('canvas')
    dom.appendChild(this.canvasDom)
    this.resize(domWidth, domHeight)
  }

  /**
   * 计算图表高度
   */
  calcChartHeight (domHeight) {
    let xChartHeight = this.xAxis.getRequiredHeightSpace()
    let chartHeight = domHeight - xChartHeight
    let isDisplayVolChart = this.isDisplayVolChart()
    let isDisplayIndicatorChart = this.isDisplayIndicatorChart()
    let volChartHeight = 0
    let indicatorChartHeight = 0

    if (isDisplayVolChart && isDisplayIndicatorChart) {
      let height = chartHeight * 0.2
      volChartHeight = height
      indicatorChartHeight = height
    } else if (isDisplayVolChart && !isDisplayIndicatorChart) {
      volChartHeight = chartHeight * 0.3
    } else if (!isDisplayVolChart && isDisplayIndicatorChart) {
      indicatorChartHeight = chartHeight * 0.3
    }

    let candleChartHeight = chartHeight - volChartHeight - indicatorChartHeight
    let contentTop = 0
    this.candleChart.setChartDimens(candleChartHeight, contentTop)

    contentTop += candleChartHeight
    this.volChart.setChartDimens(volChartHeight, contentTop)

    contentTop += volChartHeight
    this.indicatorChart.setChartDimens(indicatorChartHeight, contentTop)

    contentTop += indicatorChartHeight
    this.xAxisChart.setChartDimens(xChartHeight, contentTop)
  }

  /**
   * 计算不包括x轴y轴的绘制区域的尺寸
   */
  calcOffsets () {
    let offsetLeft = 0
    let offsetRight = 0
    let offsetTop = 0
    let offsetBottom = 0

    if (this.yAxis.needsOffset()) {
      // 计算y轴最大宽度
      let yAxisRequireWidthSpace = this.yAxis.getRequiredWidthSpace()
      if (this.yAxis.yAxisPosition === Type.YAxisPosition.LEFT) {
        offsetLeft += yAxisRequireWidthSpace
      } else {
        offsetRight += yAxisRequireWidthSpace
      }
    }

    let requireXAxisHeight = this.xAxis.getRequiredHeightSpace()
    offsetBottom += requireXAxisHeight

    this.viewPortHandler.restrainViewPort(
      offsetLeft, offsetTop, offsetRight, offsetBottom
    )
  }

  /**
   * 改变尺寸
   * @param width
   * @param height
   */
  resize (width, height) {
    this.canvasDom.width = width * 2
    this.canvasDom.height = height * 2
    this.canvasDom.style.width = width + 'px'
    this.canvasDom.style.height = height + 'px'
    this.canvas = this.canvasDom.getContext('2d')
    this.viewPortHandler.setChartDimens(width * 2, height * 2)
    this.calcChartHeight(height * 2)
    this.calcOffsets()
    this.draw()
  }

  /**
   * 绘制
   */
  draw () {
    this.dataBounds.space()
    this.xAxisChart.draw(this.canvas)
    this.candleChart.draw(this.canvas)
    this.volChart.draw(this.canvas)
    this.indicatorChart.draw(this.canvas)
  }

  /**
   * 设置数据
   * @param dataList
   */
  setDataList (dataList) {
    this.dataBounds.dataList = dataList
    this.dataBounds.moveToLast()
    this.draw()
  }

  isDisplayVolChart () {
    return this.volChart.indicatorType !== Type.IndicatorType.NO
  }

  isDisplayIndicatorChart () {
    return this.indicatorChart.indicatorType !== Type.IndicatorType.NO
  }
}

export default KLine
