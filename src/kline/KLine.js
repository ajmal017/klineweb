import ViewPortHandler from './internal/ViewPortHandler'
import DataBounds from './internal/DataBounds'
import CandleChart from './chart/CandleChart'
import IndicatorChart from './chart/IndicatorChart'
import XAxisChart from './chart/XAxisChart'
import TooltipChart from './chart/TooltipChart'
import YAxis from './component/YAxis'
import XAxis from './component/XAxis'
import Candle from './component/Candle'
import Indicator from './component/Indicator'
import Tooltip from './component/Tooltip'

import MotionEvent from './internal/MotionEvent'
import Type from './constant/Type'
import * as IndicatorCalculation from './utils/indicatorCalculation'

class KLine {
  constructor () {
    this.rootDom = null
    this.domWidth = 0
    this.domHeight = 0
    this.canvas = null
    this.canvasDom = null
    this.viewPortHandler = new ViewPortHandler()
    this.dataBounds = new DataBounds(this.viewPortHandler)
    this.yAxis = new YAxis()
    this.xAxis = new XAxis()
    this.candle = new Candle()
    this.indicator = new Indicator()
    this.tooltip = new Tooltip()
    this.candleChart = new CandleChart(this.candle, this.indicator, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.volChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler, Type.IndicatorType.VOL)
    this.indicatorChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.xAxisChart = new XAxisChart(this.xAxis, this.dataBounds, this.viewPortHandler)
    this.tooltipChart = new TooltipChart(
      this.tooltip,
      this.candle,
      this.indicator,
      this.yAxis,
      this.candleChart,
      this.volChart,
      this.indicatorChart,
      this.dataBounds,
      this.viewPortHandler
    )
    this.motionEvent = new MotionEvent(this, this.dataBounds, this.viewPortHandler)
    // 是否需要计算整个绘图区域的尺寸
    this.isShouldCalcOffset = true
    // 是否需要计算图的高度
    this.isShouldCalcChartHeight = true
  }

  /**
   * 初始化
   * @param dom
   */
  init (dom) {
    this.rootDom = dom
    this.canvasDom = document.createElement('canvas')
    this.canvasDom.addEventListener('mousedown', (e) => { this.motionEvent.mouseDown(e) })
    this.canvasDom.addEventListener('mouseup', (e) => { this.motionEvent.mouseUp(e) })
    this.canvasDom.addEventListener('mousemove', (e) => { this.motionEvent.mouseMove(e) })
    this.canvasDom.addEventListener('mouseleave', (e) => { this.motionEvent.mouseLeave(e) })
    // IE9, Chrome, Safari, Opera
    this.canvasDom.addEventListener('mousewheel', (e) => { this.motionEvent.mouseWheel(e) }, false)
    // Firefox
    this.canvasDom.addEventListener('DOMMouseScroll', (e) => { this.motionEvent.mouseWheel(e) }, false)
    dom.appendChild(this.canvasDom)
    this.resize()
  }

  /**
   * 改变尺寸
   * @param width
   * @param height
   */
  resize () {
    this.isShouldCalcOffset = true
    this.domWidth = this.rootDom.offsetWidth * 2
    this.domHeight = this.rootDom.offsetHeight * 2
    this.canvasDom.style.width = this.rootDom.offsetWidth + 'px'
    this.canvasDom.style.height = this.rootDom.offsetHeight + 'px'
    this.freshen()
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
   * 刷新
   */
  freshen () {
    this.canvasDom.width = this.domWidth
    this.canvasDom.height = this.domHeight
    this.canvas = this.canvasDom.getContext('2d')
    if (this.isShouldCalcChartHeight) {
      this.calcChartHeight(this.domHeight)
      this.isShouldCalcChartHeight = false
    }
    if (this.isShouldCalcOffset) {
      this.viewPortHandler.setChartDimens(this.domWidth, this.domHeight)
      this.calcOffsets()
      this.isShouldCalcOffset = false
    }
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
    this.tooltipChart.draw(this.canvas)
  }

  /**
   * 计算指标数据
   * @param indicatorType Int
   */
  calcIndicator (indicatorType) {
    switch (indicatorType) {
      case Type.IndicatorType.MA: {
        this.dataBounds.dataList = IndicatorCalculation.calculationMa(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.MACD: {
        this.dataBounds.dataList = IndicatorCalculation.calculationMacd(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.VOL: {
        this.dataBounds.dataList = IndicatorCalculation.calculationVol(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.BOLL: {
        this.dataBounds.dataList = IndicatorCalculation.calculationBoll(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.BIAS: {
        this.dataBounds.dataList = IndicatorCalculation.calculationBias(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.BRAR: {
        this.dataBounds.dataList = IndicatorCalculation.calculationBrar(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.CCI: {
        this.dataBounds.dataList = IndicatorCalculation.calculationCci(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.CR: {
        this.dataBounds.dataList = IndicatorCalculation.calculationCr(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.DMA: {
        this.dataBounds.dataList = IndicatorCalculation.calculationDma(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.DMI: {
        this.dataBounds.dataList = IndicatorCalculation.calculationDmi(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.KDJ: {
        this.dataBounds.dataList = IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.KD: {
        this.dataBounds.dataList = IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.RSI: {
        this.dataBounds.dataList = IndicatorCalculation.calculationRsi(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.PSY: {
        this.dataBounds.dataList = IndicatorCalculation.calculationPsy(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.TRIX: {
        this.dataBounds.dataList = IndicatorCalculation.calculationTrix(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.OBV: {
        this.dataBounds.dataList = IndicatorCalculation.calculationObv(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.VR: {
        this.dataBounds.dataList = IndicatorCalculation.calculationVr(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.WR: {
        this.dataBounds.dataList = IndicatorCalculation.calculationWr(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.MTM: {
        this.dataBounds.dataList = IndicatorCalculation.calculationMtm(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.EMV: {
        this.dataBounds.dataList = IndicatorCalculation.calculationEmv(this.dataBounds.dataList)
        break
      }
      case Type.IndicatorType.SAR: {
        this.dataBounds.dataList = IndicatorCalculation.calculationSar(this.dataBounds.dataList)
        break
      }
    }
  }

  /**
   * 计算各图指标
   */
  calcChartIndicator () {
    if (this.candleChart.isDisplayChart()) {
      this.calcIndicator(this.candleChart.indicatorType)
    }
    if (this.isDisplayVolChart()) {
      this.calcIndicator(Type.IndicatorType.VOL)
    }
    if (this.isDisplayIndicatorChart()) {
      this.calcIndicator(this.indicatorChart.indicatorType)
    }
    this.freshen()
  }

  /**
   * 设置数据
   * @param dataList
   */
  setDataList (dataList) {
    this.dataBounds.dataList = dataList
    this.dataBounds.moveToLast()
    this.calcChartIndicator()
    this.freshen()
  }

  isDisplayVolChart () {
    return this.volChart.isDisplayChart()
  }

  isDisplayIndicatorChart () {
    return this.indicatorChart.isDisplayChart()
  }
}

export default KLine
