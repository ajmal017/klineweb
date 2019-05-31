import ViewPortHandler from '../internal/ViewPortHandler'
import DataBounds from '../internal/DataBounds'
import GridChart from './GridChart'
import CandleChart from './CandleChart'
import IndicatorChart from './IndicatorChart'
import XAxisChart from './XAxisChart'
import TooltipChart from './TooltipChart'
import YAxis, { YAxisPosition } from '../component/YAxis'
import XAxis from '../component/XAxis'
import Candle from '../component/Candle'
import Indicator, { IndicatorType } from '../component/Indicator'
import Tooltip from '../component/Tooltip'
import Grid from '../component/Grid'

import MouseEvent from '../internal/event/MouseEvent'
import TouchEvent from '../internal/event/TouchEvent'
import * as IndicatorCalculation from '../utils/indicatorCalculation'

const FRESHEN_ALL = 'all'
const FRESHEN_TOOLTIP = 'tooltip'
const FRESHEN_CHART = 'chart'
const FRESHEN_CANDLE_CHART = 'candle_chart'
const FRESHEN_VOL_CHART = 'vol_chart'
const FRESHEN_INDICATOR_CHART = 'indicator_chart'

export { FRESHEN_TOOLTIP, FRESHEN_CHART }

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|UCBrowser/i.test(navigator.userAgent)

class KLineChart {
  constructor (dom) {
    this.rootDom = dom
    this.chartCanvasDom = null
    this.chartCanvas = null
    this.tooltipCanvasDom = null
    this.tooltipCanvas = null
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
    this.motionEvent = isMobile
      ? new TouchEvent(this, this.dataBounds, this.viewPortHandler)
      : new MouseEvent(this, this.dataBounds, this.viewPortHandler)
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
    this.tooltipCanvasDom = document.createElement('canvas')
    this.initCanvas(this.tooltipCanvasDom)
    this.tooltipCanvas = this.tooltipCanvasDom.getContext('2d')

    try {
      if (isMobile) {
        this.tooltipCanvasDom.addEventListener('touchstart', (e) => { this.motionEvent.touchStart(e) }, false)
        this.tooltipCanvasDom.addEventListener('touchmove', (e) => { this.motionEvent.touchMove(e) }, false)
        this.tooltipCanvasDom.addEventListener('touchend', (e) => { this.motionEvent.touchEnd(e) }, false)
      } else {
        this.tooltipCanvasDom.addEventListener('mousedown', (e) => { this.motionEvent.mouseDown(e) }, false)
        this.tooltipCanvasDom.addEventListener('mouseup', (e) => { this.motionEvent.mouseUp(e) }, false)
        this.tooltipCanvasDom.addEventListener('mousemove', (e) => { this.motionEvent.mouseMove(e) }, false)
        this.tooltipCanvasDom.addEventListener('mouseleave', (e) => { this.motionEvent.mouseLeave(e) }, false)
        // IE9, Chrome, Safari, Opera
        this.tooltipCanvasDom.addEventListener('mousewheel', (e) => { this.motionEvent.mouseWheel(e) }, false)
        // Firefox
        this.tooltipCanvasDom.addEventListener('DOMMouseScroll', (e) => { this.motionEvent.mouseWheel(e) }, false)
      }
    } catch (e) {}
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
   * 刷新
   * @param freshenType 刷新类型
   */
  freshen (freshenType = FRESHEN_ALL) {
    const rootDomWidth = this.rootDom.offsetWidth
    const rootDomHeight = this.rootDom.offsetHeight
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
    }

    if (this.isShouldCalcChartHeight) {
      this.calcChartHeight(rootDomHeight * 2)
      this.isShouldCalcChartHeight = false
    }
    if (this.isShouldCalcOffset) {
      this.chartCanvasDom.width = rootDomWidth * 2
      this.chartCanvasDom.height = rootDomHeight * 2
      this.chartCanvasDom.style.width = rootDomWidth + 'px'
      this.chartCanvasDom.style.height = rootDomHeight + 'px'

      this.tooltipCanvasDom.width = rootDomWidth * 2
      this.tooltipCanvasDom.height = rootDomHeight * 2
      this.tooltipCanvasDom.style.width = rootDomWidth + 'px'
      this.tooltipCanvasDom.style.height = rootDomHeight + 'px'

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
  async calcIndicator (indicatorType, freshenType = FRESHEN_CHART) {
    try {
      switch (indicatorType) {
        case IndicatorType.MA: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationMa(this.dataBounds.dataList)
          break
        }
        case IndicatorType.MACD: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationMacd(this.dataBounds.dataList)
          break
        }
        case IndicatorType.VOL: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationVol(this.dataBounds.dataList)
          break
        }
        case IndicatorType.BOLL: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationBoll(this.dataBounds.dataList)
          break
        }
        case IndicatorType.BIAS: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationBias(this.dataBounds.dataList)
          break
        }
        case IndicatorType.BRAR: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationBrar(this.dataBounds.dataList)
          break
        }
        case IndicatorType.CCI: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationCci(this.dataBounds.dataList)
          break
        }
        case IndicatorType.CR: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationCr(this.dataBounds.dataList)
          break
        }
        case IndicatorType.DMA: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationDma(this.dataBounds.dataList)
          break
        }
        case IndicatorType.DMI: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationDmi(this.dataBounds.dataList)
          break
        }
        case IndicatorType.KDJ: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
          break
        }
        case IndicatorType.KD: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationKdj(this.dataBounds.dataList)
          break
        }
        case IndicatorType.RSI: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationRsi(this.dataBounds.dataList)
          break
        }
        case IndicatorType.PSY: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationPsy(this.dataBounds.dataList)
          break
        }
        case IndicatorType.TRIX: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationTrix(this.dataBounds.dataList)
          break
        }
        case IndicatorType.OBV: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationObv(this.dataBounds.dataList)
          break
        }
        case IndicatorType.VR: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationVr(this.dataBounds.dataList)
          break
        }
        case IndicatorType.WR: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationWr(this.dataBounds.dataList)
          break
        }
        case IndicatorType.MTM: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationMtm(this.dataBounds.dataList)
          break
        }
        case IndicatorType.EMV: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationEmv(this.dataBounds.dataList)
          break
        }
        case IndicatorType.SAR: {
          this.dataBounds.dataList = await IndicatorCalculation.calculationSar(this.dataBounds.dataList)
          break
        }
      }
      this.freshen(freshenType)
    } catch (e) {}
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
}

export default KLineChart
