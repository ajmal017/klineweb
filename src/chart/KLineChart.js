import ViewPortHandler from '../internal/ViewPortHandler'
import DataBounds from '../internal/DataBounds'
import GridChart from './GridChart'
import CandleChart from './CandleChart'
import IndicatorChart from './IndicatorChart'
import XAxisChart from './XAxisChart'
import TooltipChart from './TooltipChart'
import MarkChart from './MarkChart'
import YAxis, { YAxisPosition } from '../component/YAxis'
import XAxis from '../component/XAxis'
import Candle from '../component/Candle'
import Indicator, { IndicatorType } from '../component/Indicator'
import Tooltip from '../component/Tooltip'
import Grid from '../component/Grid'
import Mark from '../component/Mark'
import MarkData from '../internal/MarkData'

import MouseEvent from '../internal/event/MouseEvent'
import TouchEvent from '../internal/event/TouchEvent'
import MarkEvent from '../internal/event/MarkEvent'
import * as IndicatorCalculation from '../utils/indicatorCalculation'

const FRESHEN_ALL = 'all'
const FRESHEN_TOOLTIP = 'tooltip'
const FRESHEN_CHART = 'chart'
const FRESHEN_CANDLE_CHART = 'candle_chart'
const FRESHEN_VOL_CHART = 'vol_chart'
const FRESHEN_INDICATOR_CHART = 'indicator_chart'
const FRESHEN_DRAW_LINE_CHART = 'draw_line_chart'

export { FRESHEN_TOOLTIP, FRESHEN_CHART, FRESHEN_DRAW_LINE_CHART }

class KLineChart {
  constructor (dom) {
    this.rootDom = dom
    this.chartCanvasDom = null
    this.chartCanvas = null
    this.tooltipCanvasDom = null
    this.tooltipCanvas = null
    this.markCanvasDom = null
    this.markCanvas = null
    this.viewPortHandler = new ViewPortHandler()
    this.dataBounds = new DataBounds(this.viewPortHandler)
    this.grid = new Grid()
    this.yAxis = new YAxis()
    this.xAxis = new XAxis()
    this.candle = new Candle()
    this.indicator = new Indicator()
    this.tooltip = new Tooltip()
    this.gridChart = new GridChart(this.grid, this.dataBounds, this.viewPortHandler)
    this.candleChart = new CandleChart(this.candle, this.indicator, this.yAxis, this.dataBounds, this.viewPortHandler)
    this.volChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler, IndicatorType.VOL)
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
    this.mark = new Mark()
    this.markData = new MarkData()
    this.markChart = new MarkChart(this.mark, this.markData, this.dataBounds, this.viewPortHandler)
    // 是否需要计算整个绘图区域的尺寸
    this.isShouldCalcOffset = true
    // 是否需要计算图的高度
    this.isShouldCalcChartHeight = true
    this.init()
  }

  /**
   * 初始化
   */
  init () {
    this.rootDom.style.position = 'relative'
    this.chartCanvasDom = document.createElement('canvas')
    this.initCanvas(this.chartCanvasDom)
    this.chartCanvas = this.chartCanvasDom.getContext('2d')
    this.markCanvasDom = document.createElement('canvas')
    this.initCanvas(this.markCanvasDom)
    this.markCanvas = this.markCanvasDom.getContext('2d')
    this.tooltipCanvasDom = document.createElement('canvas')
    this.initCanvas(this.tooltipCanvasDom)
    this.tooltipCanvas = this.tooltipCanvasDom.getContext('2d')

    this.initEvent()
    this.resize()
  }

  /**
   * 初始化画布
   */
  initCanvas (canvasDom) {
    canvasDom.style.position = 'absolute'
    canvasDom.style.top = '0'
    canvasDom.style.right = '0'
    canvasDom.style.bottom = '0'
    canvasDom.style.left = '0'
    this.rootDom.appendChild(canvasDom)
  }

  /**
   * 初始化事件
   */
  initEvent () {
    try {
      let isMobile = /Android|webOS|iPhone|iPod|BlackBerry|UCBrowser/i.test(navigator.userAgent)
      if (isMobile) {
        let motionEvent = new TouchEvent(this, this.dataBounds, this.viewPortHandler)
        this.tooltipCanvasDom.ontouchstart = (e) => {
          motionEvent.touchStart(e)
        }
        this.tooltipCanvasDom.ontouchmove = (e) => {
          motionEvent.touchMove(e)
        }
        this.tooltipCanvasDom.ontouchend = (e) => {
          motionEvent.touchEnd(e)
        }
      } else {
        let motionEvent = new MouseEvent(this, this.dataBounds, this.viewPortHandler)
        this.markEvent = new MarkEvent(this, this.markData, this.dataBounds, this.viewPortHandler)
        this.tooltipCanvasDom.onmousedown = (e) => {
          motionEvent.mouseDown(e)
          this.markEvent.mouseDown(e)
        }
        this.tooltipCanvasDom.onmouseup = (e) => {
          motionEvent.mouseUp(e)
        }
        this.tooltipCanvasDom.onmousemove = (e) => {
          motionEvent.mouseMove(e)
          this.markEvent.mouseMove(e)
        }
        this.tooltipCanvasDom.onmouseleave = (e) => {
          motionEvent.mouseLeave(e)
        }
        this.tooltipCanvasDom.onwheel = (e) => {
          motionEvent.mouseWheel(e)
        }
        this.tooltipCanvasDom.oncontextmenu = () => { return false }
        this.markCanvasDom.onmousedown = (e) => {
          this.markEvent.mouseDown(e)
        }
        this.markCanvasDom.onmouseup = (e) => {
          this.markEvent.mouseUp(e)
        }
        this.markCanvasDom.onmousemove = (e) => {
          this.markEvent.mouseMove(e)
        }
        this.markCanvasDom.onmouseleave = (e) => {
          this.markEvent.mouseLeave(e)
        }
        this.markCanvasDom.onwheel = (e) => {
          this.markEvent.mouseWheel(e)
        }
        this.markCanvasDom.oncontextmenu = () => { return false }
      }
    } catch (e) {}
  }

  /**
   * 计算图表高度
   */
  calcChartHeight (domHeight) {
    let xChartHeight = this.xAxis.getRequiredHeightSpace()
    let chartHeight = domHeight - xChartHeight
    let isDisplayVolChart = this.volChart.isDisplayChart()
    let isDisplayIndicatorChart = this.indicatorChart.isDisplayChart()
    let volChartHeight = 0
    let indicatorChartHeight = 0

    if (isDisplayVolChart && isDisplayIndicatorChart) {
      let height = parseInt(chartHeight * 0.2)
      volChartHeight = height
      indicatorChartHeight = height
    } else if (isDisplayVolChart && !isDisplayIndicatorChart) {
      volChartHeight = parseInt(chartHeight * 0.3)
    } else if (!isDisplayVolChart && isDisplayIndicatorChart) {
      indicatorChartHeight = parseInt(chartHeight * 0.3)
    }

    let candleChartHeight = chartHeight - volChartHeight - indicatorChartHeight
    let contentTop = 0
    this.candleChart.setChartDimens(candleChartHeight, contentTop)
    this.markChart.setChartDimens(candleChartHeight, contentTop)

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
      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        offsetLeft += yAxisRequireWidthSpace
      } else {
        offsetRight += yAxisRequireWidthSpace
      }
    }
    offsetBottom += this.xAxis.getRequiredHeightSpace()

    this.viewPortHandler.restrainViewPort(
      offsetLeft, offsetTop, offsetRight, offsetBottom
    )
  }

  /**
   * 设置canvas尺寸
   * @param dom
   * @param rootDomWidth
   * @param rootDomHeight
   */
  setCanvasDomSize (dom, rootDomWidth, rootDomHeight) {
    dom.width = rootDomWidth * 2
    dom.height = rootDomHeight * 2
    dom.style.width = rootDomWidth + 'px'
    dom.style.height = rootDomHeight + 'px'
  }

  /**
   * 清空canvas
   * @param freshenType
   * @param rootDomWidth
   * @param rootDomHeight
   */
  clearCanvasRect (freshenType, rootDomWidth, rootDomHeight) {
    // 根据刷新类型来清空画布区域
    switch (freshenType) {
      case FRESHEN_CHART: {
        this.chartCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
        break
      }
      case FRESHEN_TOOLTIP: {
        this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
        break
      }
      case FRESHEN_ALL: {
        this.chartCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
        this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
        break
      }
      case FRESHEN_CANDLE_CHART: {
        this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
        this.chartCanvas.clearRect(0, this.candleChart.chartTop, rootDomWidth * 2, this.candleChart.chartHeight)
        break
      }
      case FRESHEN_VOL_CHART: {
        if (this.volChart.isDisplayChart()) {
          this.chartCanvas.clearRect(0, this.volChart.chartTop, rootDomWidth * 2, this.volChart.chartHeight)
        }
        break
      }
      case FRESHEN_INDICATOR_CHART: {
        if (this.indicatorChart.isDisplayChart()) {
          this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
          this.chartCanvas.clearRect(0, this.indicatorChart.chartTop, rootDomWidth * 2, this.indicatorChart.chartHeight)
        }
        break
      }
      case FRESHEN_DRAW_LINE_CHART: {
        this.markCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2)
      }
    }
  }

  /**
   * 刷新
   * @param freshenType 刷新类型
   */
  freshen (freshenType = FRESHEN_ALL) {
    const rootDomWidth = this.rootDom.offsetWidth
    const rootDomHeight = this.rootDom.offsetHeight

    this.clearCanvasRect(freshenType, rootDomWidth, rootDomHeight)

    if (this.isShouldCalcChartHeight) {
      this.calcChartHeight(rootDomHeight * 2)
      this.isShouldCalcChartHeight = false
    }
    if (this.isShouldCalcOffset) {
      this.setCanvasDomSize(this.chartCanvasDom, rootDomWidth, rootDomHeight)
      this.setCanvasDomSize(this.markCanvasDom, rootDomWidth, rootDomHeight)
      this.setCanvasDomSize(this.tooltipCanvasDom, rootDomWidth, rootDomHeight)

      this.viewPortHandler.setChartDimens(rootDomWidth * 2, rootDomHeight * 2)
      this.calcOffsets()
      this.isShouldCalcOffset = false
    }
    this.draw(freshenType)
  }

  /**
   * 绘制图
   */
  draw (freshenType) {
    this.dataBounds.space()
    if (freshenType === FRESHEN_VOL_CHART) {
      this.volChart.draw(this.chartCanvas)
    } else if (freshenType === FRESHEN_INDICATOR_CHART) {
      this.indicatorChart.draw(this.chartCanvas)
      this.tooltipChart.draw(this.tooltipCanvas)
    } else if (freshenType === FRESHEN_CANDLE_CHART) {
      this.candleChart.draw(this.chartCanvas)
      this.tooltipChart.draw(this.tooltipCanvas)
    } else if (freshenType === FRESHEN_DRAW_LINE_CHART) {
      this.markChart.draw(this.markCanvas)
    } else {
      if (freshenType === FRESHEN_CHART || freshenType === FRESHEN_ALL) {
        this.gridChart.draw(this.chartCanvas)
        this.xAxisChart.draw(this.chartCanvas)
        this.candleChart.draw(this.chartCanvas)
        this.volChart.draw(this.chartCanvas)
        this.indicatorChart.draw(this.chartCanvas)
      }
      if (freshenType === FRESHEN_TOOLTIP || freshenType === FRESHEN_ALL) {
        this.tooltipChart.draw(this.tooltipCanvas)
      }
    }
  }

  /**
   * 计算指标数据
   * @param indicatorType
   * @param freshenType
   * @returns {Promise<void>}
   */
  calcIndicator (indicatorType, freshenType = FRESHEN_CHART) {
    Promise.resolve().then(() => {
      try {
        switch (indicatorType) {
          case IndicatorType.MA: {
            this.dataBounds.dataList = IndicatorCalculation.calculationMa(this.dataBounds.dataList)
            break
          }
          case IndicatorType.MACD: {
            this.dataBounds.dataList = IndicatorCalculation.calculationMacd(this.dataBounds.dataList)
            break
          }
          case IndicatorType.VOL: {
            this.dataBounds.dataList = IndicatorCalculation.calculationVol(this.dataBounds.dataList)
            break
          }
          case IndicatorType.BOLL: {
            this.dataBounds.dataList = IndicatorCalculation.calculationBoll(this.dataBounds.dataList)
            break
          }
          case IndicatorType.BIAS: {
            this.dataBounds.dataList = IndicatorCalculation.calculationBias(this.dataBounds.dataList)
            break
          }
          case IndicatorType.BRAR: {
            this.dataBounds.dataList = IndicatorCalculation.calculationBrar(this.dataBounds.dataList)
            break
          }
          case IndicatorType.CCI: {
            this.dataBounds.dataList = IndicatorCalculation.calculationCci(this.dataBounds.dataList)
            break
          }
          case IndicatorType.CR: {
            this.dataBounds.dataList = IndicatorCalculation.calculationCr(this.dataBounds.dataList)
            break
          }
          case IndicatorType.DMA: {
            this.dataBounds.dataList = IndicatorCalculation.calculationDma(this.dataBounds.dataList)
            break
          }
          case IndicatorType.DMI: {
            this.dataBounds.dataList = IndicatorCalculation.calculationDmi(this.dataBounds.dataList)
            break
          }
          case IndicatorType.KDJ: {
            this.dataBounds.dataList = IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
            break
          }
          case IndicatorType.KD: {
            this.dataBounds.dataList = IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
            break
          }
          case IndicatorType.RSI: {
            this.dataBounds.dataList = IndicatorCalculation.calculationRsi(this.dataBounds.dataList)
            break
          }
          case IndicatorType.PSY: {
            this.dataBounds.dataList = IndicatorCalculation.calculationPsy(this.dataBounds.dataList)
            break
          }
          case IndicatorType.TRIX: {
            this.dataBounds.dataList = IndicatorCalculation.calculationTrix(this.dataBounds.dataList)
            break
          }
          case IndicatorType.OBV: {
            this.dataBounds.dataList = IndicatorCalculation.calculationObv(this.dataBounds.dataList)
            break
          }
          case IndicatorType.VR: {
            this.dataBounds.dataList = IndicatorCalculation.calculationVr(this.dataBounds.dataList)
            break
          }
          case IndicatorType.WR: {
            this.dataBounds.dataList = IndicatorCalculation.calculationWr(this.dataBounds.dataList)
            break
          }
          case IndicatorType.MTM: {
            this.dataBounds.dataList = IndicatorCalculation.calculationMtm(this.dataBounds.dataList)
            break
          }
          case IndicatorType.EMV: {
            this.dataBounds.dataList = IndicatorCalculation.calculationEmv(this.dataBounds.dataList)
            break
          }
          case IndicatorType.SAR: {
            this.dataBounds.dataList = IndicatorCalculation.calculationSar(this.dataBounds.dataList)
            break
          }
        }
        this.freshen(freshenType)
      } catch (e) {}
    })
  }

  /**
   * 计算各图指标
   */
  calcChartIndicator () {
    let isDisplayCandleIndicator = this.candleChart.isDisplayChart()
    let isDisplayVol = this.volChart.isDisplayChart()
    let isDisplayIndicator = this.indicatorChart.isDisplayChart()
    if (isDisplayCandleIndicator) {
      this.calcIndicator(this.candleChart.indicatorType)
    }
    if (isDisplayVol) {
      this.calcIndicator(IndicatorType.VOL)
    }
    if (isDisplayIndicator) {
      this.calcIndicator(this.indicatorChart.indicatorType)
    }
  }

  /**
   * 检查数据是否合法
   * @param data
   */
  checkData (data) {
    if (typeof data !== 'object' ||
      data.open === null || data.open === undefined ||
      data.close === null || data.close === undefined ||
      data.high === null || data.high === undefined ||
      data.low === null || data.low === undefined ||
      data.timestamp === null || data.timestamp === undefined ||
      data.volume === null || data.volume === undefined ||
      data.turnover === null || data.turnover === undefined
    ) {
      throw new Error('The data must be object and need to contain open, close, high, low, timestamp, volume, and turnover fields')
    }
  }

  /**
   * 改变尺寸
   */
  resize () {
    this.isShouldCalcOffset = true
    this.freshen()
  }

  /**
   * 设置配置
   * @param config
   */
  setConfig (config) {
    if (config) {
      let common = config.common
      if (common) {
        if (common.minVisibleRange > 0) {
          this.dataBounds.minRange = common.minVisibleRange
        }
        if (common.maxVisibleRange > 0 && common.maxVisibleRange > this.dataBounds.minRange) {
          this.dataBounds.maxRange = common.maxVisibleRange
        }
        if (common.defaultVisibleRange > 0 &&
          common.defaultVisibleRange > this.dataBounds.minRange - 1 &&
          common.defaultVisibleRange < this.dataBounds.maxRange + 1) {
          this.dataBounds.range = common.defaultVisibleRange
        }
      }
      let grid = config.grid
      if (grid) {
        if (grid.display !== undefined) {
          this.grid.display = grid.display
        }
        if (grid.lineSize > 0) {
          this.grid.lineSize = grid.lineSize
        }
        if (grid.lineColor) {
          this.grid.lineColor = grid.lineColor
        }
      }
      let candle = config.candle
      if (candle) {
        if (candle.chartType) {
          this.candle.chartStyle = candle.chartType
        }
        if (candle.timeChart) {
          this.candle.timeChart = { ...this.candle.timeChart, ...candle.timeChart }
        }
        if (candle.candleChart) {
          this.candle.candleChart = { ...this.candle.candleChart, ...candle.candleChart }
        }
        if (candle.lowestHighestPriceMarkTextColor) {
          this.candle.lowestHighestPriceMarkTextColor = candle.lowestHighestPriceMarkTextColor
        }
        if (candle.lowestHighestPriceMarkTextSize > 0) {
          this.candle.lowestHighestPriceMarkTextSize = candle.lowestHighestPriceMarkTextSize
        }
        this.candle.lowestHighestValueFormatter = candle.lowestHighestValueFormatter
        if (candle.highestPriceMark) {
          this.candle.highestPriceMark = { ...this.candle.highestPriceMark, ...candle.highestPriceMark }
        }
        if (candle.lowestPriceMark) {
          this.candle.lowestPriceMark = { ...this.candle.lowestPriceMark, ...candle.lowestPriceMark }
        }
        if (candle.lastPriceMark) {
          this.candle.lastPriceMark = { ...this.candle.lastPriceMark, ...candle.lastPriceMark }
        }
      }
      let indicator = config.indicator
      if (indicator) {
        if (indicator.lineSize > 0) {
          this.indicator.lineSize = indicator.lineSize
        }
        if (indicator.increasingColor) {
          this.indicator.increasingColor = indicator.increasingColor
        }
        if (indicator.decreasingColor) {
          this.indicator.decreasingColor = indicator.decreasingColor
        }
        if (indicator.lineColors && indicator.lineColors.length > 4) {
          this.indicator.lineColors = indicator.lineColors
        }
      }
      let xAxis = config.xAxis
      if (xAxis) {
        if (xAxis.display !== null && xAxis.display !== undefined) {
          this.xAxis.display = xAxis.display
        }
        if (this.xAxis.color) {
          this.xAxis.color = xAxis.color
        }
        if (xAxis.minHeight >= 0) {
          this.xAxis.xAxisMinHeight = xAxis.minHeight
        }
        if (xAxis.maxHeight >= 0 && xAxis.maxHeight >= this.xAxis.xAxisMinHeight) {
          this.xAxis.xAxisMaxHeight = xAxis.maxHeight
        }
        if (xAxis.axisLine) {
          this.xAxis.axisLine = { ...this.xAxis.axisLine, ...xAxis.axisLine }
        }
        if (xAxis.tickText) {
          this.xAxis.tickText = { ...this.xAxis.tickText, ...xAxis.tickText }
        }
        if (xAxis.tickLine) {
          this.xAxis.tickLine = { ...this.xAxis.tickLine, ...xAxis.tickLine }
        }
        if (xAxis.separatorLine) {
          this.xAxis.separatorLine = { ...this.xAxis.separatorLine, ...xAxis.separatorLine }
        }
      }
      let yAxis = config.yAxis
      if (yAxis) {
        if (yAxis.display !== null && yAxis.display !== undefined) {
          this.yAxis.display = yAxis.display
        }
        if (yAxis.position) {
          this.yAxis.yAxisPosition = yAxis.position
          this.isShouldCalcOffset = true
        }
        if (this.yAxis.color) {
          this.yAxis.color = yAxis.color
        }
        if (yAxis.minWidth >= 0) {
          this.yAxis.yAxisMinWidth = yAxis.minWidth
        }
        if (yAxis.maxWidth >= 0 && yAxis.maxWidth >= this.yAxis.yAxisMinWidth) {
          this.yAxis.yAxisMaxWidth = yAxis.maxWidth
        }
        if (yAxis.axisLine) {
          this.yAxis.axisLine = { ...this.yAxis.axisLine, ...yAxis.axisLine }
        }
        if (yAxis.tickText) {
          this.yAxis.tickText = { ...this.yAxis.tickText, ...yAxis.tickText }
          this.isShouldCalcOffset = true
        }
        if (yAxis.tickLine) {
          this.yAxis.tickLine = { ...this.yAxis.tickLine, ...yAxis.tickLine }
        }
        if (yAxis.separatorLine) {
          this.yAxis.separatorLine = { ...this.yAxis.separatorLine, ...yAxis.separatorLine }
        }
      }
      let tooltip = config.tooltip
      if (tooltip) {
        if (tooltip.textSize > 0) {
          this.tooltip.textSize = tooltip.textSize
        }
        if (tooltip.crossLine) {
          if (tooltip.crossLine.display !== null && tooltip.crossLine.display !== undefined) {
            this.tooltip.crossLine.display = yAxis.display
          }
          if (tooltip.crossLine.text) {
            tooltip.crossLine.text = { ...this.tooltip.crossLine.text, ...tooltip.crossLine.text }
          }
          this.tooltip.crossLine = { ...this.tooltip.crossLine, ...tooltip.crossLine }
        }
        if (tooltip.generalData) {
          if (tooltip.generalData.text) {
            tooltip.generalData.text = { ...this.tooltip.generalData.text, ...tooltip.generalData.text }
          }
          this.tooltip.generalData = { ...this.tooltip.generalData, ...tooltip.generalData }
        }
        if (tooltip.indicatorData) {
          if (tooltip.indicatorData.text) {
            tooltip.indicatorData.text = { ...this.tooltip.indicatorData.text, ...tooltip.indicatorData.text }
          }
          this.tooltip.indicatorData = { ...this.tooltip.indicatorData, ...tooltip.indicatorData }
        }
      }
      let mark = config.mark
      if (mark) {
        if (mark.line) {
          if (mark.line.highlight) {
            mark.line.highlight = { ...this.mark.line.highlight, ...mark.line.highlight }
          }
          this.mark.line = { ...this.mark.line, ...mark.line }
        }
        if (mark.point) {
          if (mark.point.highlight) {
            mark.point.highlight = { ...this.mark.point.highlight, ...mark.point.highlight }
          }
          this.mark.point = { ...this.mark.point, ...mark.point }
        }
      }

      this.freshen()
    }
  }

  /**
   * 设置数据
   * @param dataList
   */
  setDataList (dataList) {
    if (dataList && Array.isArray(dataList)) {
      for (let i = 0; i < dataList.length; i++) {
        this.checkData(dataList[i])
      }
      this.dataBounds.dataList = dataList
      this.dataBounds.moveToLast()
      this.calcChartIndicator()
    }
  }

  /**
   * 添加数据
   * @param data
   * @param index
   */
  addData (data, index = this.dataBounds.dataList.length) {
    this.checkData(data)
    this.dataBounds.dataList[index] = data
    if (this.dataBounds.min + this.dataBounds.range >= this.dataBounds.dataList.length - 1) {
      this.dataBounds.moveToLast()
    }
    this.calcChartIndicator()
  }

  /**
   * 设置主指标类型
   * @param indicatorType
   */
  setMainIndicatorType (indicatorType) {
    if (this.candleChart.indicatorType !== indicatorType) {
      this.candleChart.indicatorType = indicatorType
      this.calcIndicator(indicatorType, FRESHEN_CANDLE_CHART)
    }
  }

  /**
   * 设置副指标类型
   * @param indicatorType
   */
  setSubIndicatorType (indicatorType) {
    if (this.indicatorChart.indicatorType !== indicatorType) {
      let shouldCalcChartHeight = (this.indicatorChart.isDisplayChart() && indicatorType === IndicatorType.NO) ||
        (!this.indicatorChart.isDisplayChart() && indicatorType !== IndicatorType.NO)
      this.indicatorChart.indicatorType = indicatorType
      if (shouldCalcChartHeight) {
        this.isShouldCalcChartHeight = true
      }
      this.calcIndicator(indicatorType)
      this.freshen(this.isShouldCalcChartHeight ? FRESHEN_ALL : FRESHEN_INDICATOR_CHART)
    }
  }

  /**
   * 设置是否显示vol指标
   * @param isShow Boolean
   */
  setShowVolIndicatorChart (isShow) {
    if (this.volChart.isDisplayChart() !== isShow) {
      if (isShow) {
        this.volChart.indicatorType = IndicatorType.VOL
        this.calcIndicator(IndicatorType.VOL)
      } else {
        this.volChart.indicatorType = IndicatorType.NO
      }
      this.isShouldCalcChartHeight = true
      this.freshen(FRESHEN_VOL_CHART)
    }
  }

  /**
   * 绘制线
   * @param markingType
   */
  markLine (markingType) {
    this.markEvent.drawLineStart(markingType)
  }
}

export default KLineChart
