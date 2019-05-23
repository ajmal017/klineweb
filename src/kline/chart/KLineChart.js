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

import MotionEvent from '../internal/MotionEvent'
import * as IndicatorCalculation from '../utils/indicatorCalculation'

class KLineChart {
  constructor (dom) {
    this.rootDom = dom
    this.domWidth = 0
    this.domHeight = 0
    this.canvas = null
    this.canvasDom = null
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
    this.motionEvent = new MotionEvent(this, this.dataBounds, this.viewPortHandler)
    // 是否需要计算整个绘图区域的尺寸
    this.isShouldCalcOffset = true
    // 是否需要计算图的高度
    this.isShouldCalcChartHeight = true
    this.init()
  }

  /**
   * 初始化
   * @param dom
   */
  init () {
    this.canvasDom = document.createElement('canvas')
    this.canvasDom.addEventListener('mousedown', (e) => { this.motionEvent.mouseDown(e) })
    this.canvasDom.addEventListener('mouseup', (e) => { this.motionEvent.mouseUp(e) })
    this.canvasDom.addEventListener('mousemove', (e) => { this.motionEvent.mouseMove(e) })
    this.canvasDom.addEventListener('mouseleave', (e) => { this.motionEvent.mouseLeave(e) })
    // IE9, Chrome, Safari, Opera
    this.canvasDom.addEventListener('mousewheel', (e) => { this.motionEvent.mouseWheel(e) }, false)
    // Firefox
    this.canvasDom.addEventListener('DOMMouseScroll', (e) => { this.motionEvent.mouseWheel(e) }, false)
    this.rootDom.appendChild(this.canvasDom)
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
        this.grid.display = grid.display
        if (grid.lineSize > 0) {
          this.grid.lineSize = grid.lineSize
        }
        if (grid.lineColor) {
          this.grid.lineColor = grid.lineColor
        }
      }
      let candle = common.candle
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
        this.xAxis.display = xAxis.display
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
        this.yAxis.display = yAxis.display
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
      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
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
    this.gridChart.draw(this.canvas)
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
  }

  /**
   * 计算各图指标
   */
  calcChartIndicator () {
    if (this.candleChart.isDisplayChart()) {
      this.calcIndicator(this.candleChart.indicatorType)
    }
    if (this.isDisplayVolChart()) {
      this.calcIndicator(IndicatorType.VOL)
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

  /**
   * 设置主指标类型
   * @param indicatorType
   */
  setMainIndicatorType (indicatorType) {
    if (this.candleChart.indicatorType !== indicatorType) {
      this.candleChart.indicatorType = indicatorType
      this.calcIndicator(indicatorType)
      this.freshen()
    }
  }

  /**
   * 设置副指标类型
   * @param indicatorType
   */
  setSubIndicatorType (indicatorType) {
    if (this.indicatorChart.indicatorType !== indicatorType) {
      let shouldCalcChartHeight = (this.isDisplayIndicatorChart() && indicatorType === IndicatorType.NO) ||
        (!this.isDisplayIndicatorChart() && indicatorType !== IndicatorType.NO)
      this.indicatorChart.indicatorType = indicatorType
      if (shouldCalcChartHeight) {
        this.isShouldCalcChartHeight = true
      }
      this.calcIndicator(indicatorType)
      this.freshen()
    }
  }

  /**
   * 设置是否显示vol指标
   * @param isShow Boolean
   */
  setShowVolIndicatorChart (isShow) {
    if (this.isDisplayVolChart() !== isShow) {
      if (isShow) {
        this.volChart.indicatorType = IndicatorType.VOL
        this.calcIndicator(IndicatorType.VOL)
      } else {
        this.volChart.indicatorType = IndicatorType.NO
      }
      this.isShouldCalcChartHeight = true
      this.freshen()
    }
  }

  isDisplayVolChart () {
    return this.volChart.isDisplayChart()
  }

  isDisplayIndicatorChart () {
    return this.indicatorChart.isDisplayChart()
  }
}

export default KLineChart
