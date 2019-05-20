import ViewPortHandler from './internal/ViewPortHandler'
import DataBounds from './internal/DataBounds'
import CandleChart from './chart/CandleChart'
import IndicatorChart from './chart/IndicatorChart'
import XAxisChart from './chart/XAxisChart'
import YAxis from './component/YAxis'
import XAxis from './component/XAxis'
import Candle from './component/Candle'
import Indicator from './component/Indicator'

class KLine {
  constructor () {
    this.canvas = null
    this.viewPortHandler = new ViewPortHandler()
    this.dataBounds = new DataBounds(this.viewPortHandler)
    this.yAxis = new YAxis()
    this.xAxis = new XAxis()
    this.candle = new Candle()
    this.indicator = new Indicator()
    this.candleChart = new CandleChart(this.candle, this.indicator, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.volChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.indicatorChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.xAxisChart = new XAxisChart(this.xAxis, this.viewPortHandler)
  }

  /**
   * 初始化
   * @param dom
   */
  init (dom) {
    let domWidth = dom.offsetWidth
    let domHeight = dom.offsetHeight

    let canvasDom = document.createElement('canvas')
    dom.appendChild(canvasDom)
    this.canvas = canvasDom.getContext('2d')
    this.resize(domWidth, domHeight)
  }

  /**
   * 改变尺寸
   * @param width
   * @param height
   */
  resize (width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.viewPortHandler.setChartDimens(width, height)
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
}

export default KLine
