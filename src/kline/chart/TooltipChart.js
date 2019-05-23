import Chart from './Chart'
import { IndicatorDisplayRule } from '../component/Tooltip'
import { ChartStyle } from '../component/Candle'
import { YAxisPosition, YAxisTextPosition } from '../component/YAxis'
import { LineStyle } from '../component/Component'
import { IndicatorType } from '../component/Indicator'
import utils from '../utils/utils'

class TooltipChart extends Chart {
  constructor (tooltip, candle, indicator, yAxis, candleChart, volChart, indicatorChart, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.displayCross = false
    this.crossPoint = { x: 0, y: 0 }
    this.tooltip = tooltip
    this.candle = candle
    this.indicator = indicator
    this.yAxis = yAxis
    this.candleChart = candleChart
    this.volChart = volChart
    this.indicatorChart = indicatorChart

    this.yAxisLabelStrokePathPoints = []
  }

  draw (canvas) {
    if (this.dataBounds.currentDataPos < this.dataBounds.dataList.length) {
      let kLineModel = this.dataBounds.dataList[this.dataBounds.currentDataPos]
      if (this.displayCross) {
        this.crossPoint.x = this.viewPortHandler.contentLeft() +
          this.dataBounds.dataSpace * (this.dataBounds.currentDataPos - this.dataBounds.min) +
          this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate) / 2
        canvas.font = (this.tooltip.crossLine.text.size || this.tooltip.textSize) * 2 + 'px Arial'

        this.drawCrossHorizontalLine(canvas)
        this.drawCrossVerticalLine(canvas, kLineModel)
      }

      if (this.tooltip.indicatorData.displayRule === IndicatorDisplayRule.ALWAYS ||
        (this.tooltip.indicatorData.displayRule === IndicatorDisplayRule.FOLLOW_CROSS && this.displayCross)) {
        let textHeight = (this.tooltip.indicatorData.text.size || this.tooltip.textSize) * 2
        let startX = this.viewPortHandler.contentLeft() + 10
        canvas.font = textHeight + 'px Arial'
        this.drawGeneralDataTooltip(canvas, startX, kLineModel)
        if (this.candle.chartStyle !== ChartStyle.TIME_LINE) {
          // 绘制主图的指标提示文字
          this.drawIndicatorTooltip(
            canvas, startX,
            this.candleChart.chartTop + 10 + textHeight + 10 + (this.tooltip.generalData.text.size || this.tooltip.textSize) * 2,
            kLineModel, this.candleChart.indicatorType
          )
        }
        // 绘制成交量指标提示文字
        this.drawIndicatorTooltip(
          canvas, startX,
          this.volChart.chartTop + 4 + textHeight,
          kLineModel, this.volChart.indicatorType
        )
        // 绘制副图指标提示文字
        this.drawIndicatorTooltip(
          canvas, startX,
          this.indicatorChart.chartTop + 4 + textHeight,
          kLineModel, this.indicatorChart.indicatorType
        )
      }
    }
  }

  /**
   * 绘制水平线
   * @param canvas Canvas
   */
  drawCrossHorizontalLine (canvas) {
    let yAxisDataLabel = this.getCrossYAxisLabel()
    if (yAxisDataLabel == null) {
      return
    }
    let isDrawYAxisTextOutside = this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE
    let textSize = this.tooltip.crossLine.text.size || this.tooltip.textSize
    let yAxisDataLabelWidth = utils.calcTextWidth(textSize * 2 + 'px Arial', yAxisDataLabel)
    let halfLabelHeight = textSize
    let labelStartX
    let labelStartY = this.crossPoint.y + halfLabelHeight

    let lineStartX = this.viewPortHandler.contentLeft()
    let lineEndX = this.viewPortHandler.contentRight()

    let centerPoint = this.viewPortHandler.getContentCenter()

    let crossTextMarginSpace = this.tooltip.crossLine.text.margin
    let rectStrokeLineSize = this.tooltip.crossLine.text.rectStrokeLineSize

    if (isDrawYAxisTextOutside) {
      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        labelStartX = lineStartX - rectStrokeLineSize - crossTextMarginSpace * 2 - yAxisDataLabelWidth
      } else {
        labelStartX = lineEndX + rectStrokeLineSize + crossTextMarginSpace * 2
      }
    } else {
      if (this.crossPoint.x > centerPoint.x) {
        // 左边
        lineStartX = this.viewPortHandler.contentLeft() +
          rectStrokeLineSize * 2 + crossTextMarginSpace * 3 + yAxisDataLabelWidth
        labelStartX = this.viewPortHandler.contentLeft() + rectStrokeLineSize + crossTextMarginSpace
      } else {
        lineEndX = this.viewPortHandler.contentRight() - rectStrokeLineSize * 2 - crossTextMarginSpace * 3 - yAxisDataLabelWidth
        labelStartX = lineEndX + rectStrokeLineSize + crossTextMarginSpace * 2
      }
    }

    if ((!isDrawYAxisTextOutside && this.crossPoint.x > centerPoint.x) ||
      (isDrawYAxisTextOutside && this.yAxis.yAxisPosition === YAxisPosition.LEFT)) {
      // 左边
      this.yAxisLabelStrokePathPoints[0] = { x: lineStartX, y: this.crossPoint.y }
      this.yAxisLabelStrokePathPoints[1] = {
        x: lineStartX - crossTextMarginSpace,
        y: this.crossPoint.y - halfLabelHeight - crossTextMarginSpace
      }
      this.yAxisLabelStrokePathPoints[2] = {
        x: lineStartX - crossTextMarginSpace * 3 - yAxisDataLabelWidth,
        y: this.yAxisLabelStrokePathPoints[1].y
      }
      this.yAxisLabelStrokePathPoints[3] = {
        x: this.yAxisLabelStrokePathPoints[2].x,
        y: this.crossPoint.y + halfLabelHeight + crossTextMarginSpace
      }
      this.yAxisLabelStrokePathPoints[4] = {
        x: this.yAxisLabelStrokePathPoints[1].x,
        y: this.yAxisLabelStrokePathPoints[3].y
      }
    } else {
      // 右边
      this.yAxisLabelStrokePathPoints[0] = { x: lineEndX, y: this.crossPoint.y }
      this.yAxisLabelStrokePathPoints[1] = {
        x: lineEndX + crossTextMarginSpace,
        y: this.crossPoint.y - halfLabelHeight - crossTextMarginSpace
      }
      this.yAxisLabelStrokePathPoints[2] = {
        x: lineEndX + crossTextMarginSpace * 3 + yAxisDataLabelWidth,
        y: this.yAxisLabelStrokePathPoints[1].y
      }
      this.yAxisLabelStrokePathPoints[3] = {
        x: this.yAxisLabelStrokePathPoints[2].x,
        y: this.crossPoint.y + halfLabelHeight + crossTextMarginSpace
      }
      this.yAxisLabelStrokePathPoints[4] = {
        x: this.yAxisLabelStrokePathPoints[1].x,
        y: this.yAxisLabelStrokePathPoints[3].y
      }
    }

    // 绘制十字光标垂直线
    canvas.lineWidth = this.tooltip.crossLine.size
    canvas.strokeStyle = this.tooltip.crossLine.color
    if (this.tooltip.crossLine.style === LineStyle.DASH) {
      canvas.setLineDash(this.tooltip.crossLine.dashValue)
    }
    canvas.beginPath()
    canvas.moveTo(lineStartX, this.crossPoint.y)
    canvas.lineTo(lineEndX, this.crossPoint.y)
    canvas.stroke()
    canvas.closePath()
    canvas.setLineDash([])

    // 绘制y轴文字外的边框
    canvas.fillStyle = this.tooltip.crossLine.rectFillColor
    canvas.beginPath()
    canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y)
    for (let i = 1; i < this.yAxisLabelStrokePathPoints.length; i++) {
      canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x, this.yAxisLabelStrokePathPoints[i].y)
    }
    canvas.closePath()
    canvas.fill()

    canvas.lineWidth = this.tooltip.crossLine.rectStrokeLineSize
    canvas.strokeStyle = this.tooltip.crossLine.rectStrokeLineColor
    canvas.beginPath()
    canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y)
    for (let i = 1; i < this.yAxisLabelStrokePathPoints.length; i++) {
      canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x, this.yAxisLabelStrokePathPoints[i].y)
    }
    canvas.closePath()
    canvas.stroke()

    canvas.fillStyle = this.tooltip.crossLine.text.color
    canvas.fillText(yAxisDataLabel, labelStartX, labelStartY)
  }

  /**
   * 获取十字光标y轴上的文字
   */
  getCrossYAxisLabel () {
    let candleChartYAxis = this.candleChart.yAxisChart
    let candleChartHeight = candleChartYAxis.chartHeight
    let candleChartTop = candleChartYAxis.chartTop

    let volChartYAxis = this.volChart.yAxisChart
    let volChartHeight = volChartYAxis.chartHeight
    let volChartTop = volChartYAxis.chartTop

    let indicatorChartYAxis = this.indicatorChart.yAxisChart
    let indicatorChartHeight = indicatorChartYAxis.chartHeight
    let indicatorChartTop = indicatorChartYAxis.chartTop

    let eventY = this.crossPoint.y
    if (eventY > candleChartTop && eventY < (candleChartHeight + candleChartTop)) {
      let candleChartYAxisDataMin = candleChartYAxis.axisMinimum
      let candleChartYAxisDataMax = candleChartYAxis.axisMaximum
      let yData = (1 - (eventY - candleChartTop) / candleChartHeight) * (candleChartYAxisDataMax - candleChartYAxisDataMin) + candleChartYAxisDataMin
      let text = yData.toFixed(2)
      if (this.tooltip.crossLine.text.valueFormatter) {
        text = this.tooltip.crossLine.text.valueFormatter('y', yData) || '--'
      }
      return text
    } else if (eventY > volChartTop && eventY < volChartTop + volChartHeight) {
      let volIndicatorChartYAxisDataMin = volChartYAxis.axisMinimum
      let volIndicatorChartYAxisDataMax = volChartYAxis.axisMaximum
      let yData = (1 - (eventY - volChartTop) / volChartHeight) * (volIndicatorChartYAxisDataMax - volIndicatorChartYAxisDataMin) + volIndicatorChartYAxisDataMin
      let text = yData.toFixed(0)
      if (this.tooltip.crossLine.text.valueFormatter) {
        text = this.tooltip.crossLine.text.valueFormatter('y', yData) || '--'
      }
      return text
    } else if (eventY > indicatorChartTop && eventY < indicatorChartTop + indicatorChartHeight) {
      let indicatorChartYAxisDataMin = indicatorChartYAxis.axisMinimum
      let indicatorChartYAxisDataMax = indicatorChartYAxis.axisMaximum
      let yData = (1 - (eventY - indicatorChartTop) / indicatorChartHeight) * (indicatorChartYAxisDataMax - indicatorChartYAxisDataMin) + indicatorChartYAxisDataMin
      let text = yData.toFixed(2)
      if (this.indicatorChart.indicatorType === IndicatorType.VOL) {
        text = yData.toFixed(0)
      }
      if (this.tooltip.crossLine.text.valueFormatter) {
        text = this.tooltip.crossLine.text.valueFormatter('y', yData) || '--'
      }
      return text
    }
    return null
  }

  /**
   * 绘制十字光标垂直线
   * @param canvas Canvas
   * @param kLineModel KLineModel
   */
  drawCrossVerticalLine (canvas, kLineModel) {
    canvas.lineWidth = this.tooltip.crossLine.size
    canvas.strokeStyle = this.tooltip.crossLine.color

    if (this.tooltip.crossLine.style === LineStyle.DASH) {
      canvas.setLineDash(this.tooltip.crossLine.dashValue)
    }

    canvas.beginPath()
    canvas.moveTo(this.crossPoint.x, this.viewPortHandler.contentTop())
    canvas.lineTo(this.crossPoint.x, this.viewPortHandler.contentBottom())
    canvas.stroke()
    canvas.closePath()
    canvas.setLineDash([])

    let timestamp = kLineModel.timestamp
    let label = utils.formatDate(timestamp)
    if (this.tooltip.crossLine.text.valueFormatter) {
      label = this.tooltip.crossLine.text.valueFormatter('x', kLineModel) || '--'
    }
    let textSize = this.tooltip.crossLine.text.size || this.tooltip.textSize
    let labelWidth = utils.calcTextWidth(textSize * 2 + 'px Arial', label)
    let xAxisLabelX = this.crossPoint.x - labelWidth / 2
    let crossTextMarginSpace = this.tooltip.crossLine.text.margin
    let rectStrokeLineSize = this.tooltip.crossLine.text.rectStrokeLineSize
    // 保证整个x轴上的提示文字总是完全显示
    if (xAxisLabelX < this.viewPortHandler.contentLeft() + crossTextMarginSpace + rectStrokeLineSize) {
      xAxisLabelX = this.viewPortHandler.contentLeft()
    } else if (xAxisLabelX > this.viewPortHandler.contentRight() - labelWidth - rectStrokeLineSize) {
      xAxisLabelX = this.viewPortHandler.contentRight() - labelWidth - rectStrokeLineSize
    }

    let rectLeft = xAxisLabelX - rectStrokeLineSize - crossTextMarginSpace
    let rectTop = this.viewPortHandler.contentBottom()
    let rectRight = xAxisLabelX + labelWidth + crossTextMarginSpace + rectStrokeLineSize
    let rectBottom = this.viewPortHandler.contentBottom() + textSize * 2 + rectStrokeLineSize + crossTextMarginSpace * 2
    canvas.fillStyle = this.tooltip.crossLine.text.rectFillColor
    canvas.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    canvas.lineWidth = rectStrokeLineSize
    canvas.strokeStyle = this.tooltip.crossLine.rectStrokeLineColor
    canvas.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    // 绘制轴上的提示文字
    canvas.fillStyle = this.tooltip.crossLine.text.color
    canvas.fillText(
      label,
      xAxisLabelX,
      this.viewPortHandler.contentBottom() + textSize * 2 + rectStrokeLineSize + crossTextMarginSpace
    )
  }

  /**
   * 绘制基础数据提示
   * @param canvas
   * @param startX
   * @param kLineModel
   */
  drawGeneralDataTooltip (canvas, startX, kLineModel) {
    let textSize = this.tooltip.generalData.text.size || this.tooltip.textSize
    canvas.font = textSize * 2 + 'px Arial'
    let textColor = this.tooltip.generalData.text.color
    let values = []
    if (this.tooltip.generalData.values) {
      values = this.tooltip.generalData.values(kLineModel) || []
    } else {
      let formatter = this.tooltip.generalData.valueFormatter
      let time = utils.formatDate(kLineModel.timestamp)
      let open = kLineModel.open.toFixed(2)
      let close = kLineModel.close.toFixed(2)
      let high = kLineModel.high.toFixed(2)
      let low = kLineModel.low.toFixed(2)
      if (formatter) {
        time = formatter(0, kLineModel.timestamp) || '--'
        open = formatter(1, kLineModel.open) || '--'
        close = formatter(2, kLineModel.close) || '--'
        high = formatter(3, kLineModel.high) || '--'
        low = formatter(4, kLineModel.low) || '--'
      }
      values = [time, open, close, high, low]
    }
    let labels = this.tooltip.generalData.labels
    for (let i = 0; i < labels.length; i++) {
      let label = (labels[i] || '--') + ': '
      let labelWidth = utils.calcTextWidth(textSize * 2 + 'px Arial', label)
      canvas.fillStyle = textColor
      canvas.fillText(label, startX, textSize * 2 + 4)
      startX += labelWidth

      let value = values[i] || '--'
      let text
      if (typeof value === 'object') {
        text = value.value || '--'
        canvas.fillStyle = value.color || textColor
      } else {
        canvas.fillStyle = textColor
        text = value
      }
      let textWidth = utils.calcTextWidth(textSize * 2 + 'px Arial', text)
      canvas.fillText(text, startX, textSize * 2 + 4)
      startX += textWidth + this.tooltip.generalData.text.margin
    }
  }

  /**
   * 绘制指标提示文字
   * @param canvas
   * @param startX
   * @param startY
   * @param kLineModel
   * @param indicatorType
   */
  drawIndicatorTooltip (canvas, startX, startY, kLineModel, indicatorType) {
    switch (indicatorType) {
      case IndicatorType.MA: {
        let maData = kLineModel.ma
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [maData.ma5, maData.ma10, maData.ma20, maData.ma60],
          ['MA5', 'MA10', 'MA20', 'MA60'],
          kLineModel, IndicatorType.MA
        )
        break
      }
      case IndicatorType.MACD: {
        let macdData = kLineModel.macd
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [macdData.diff, macdData.dea, macdData.macd],
          ['DIFF', 'DEA', 'MACD'],
          kLineModel, IndicatorType.MACD
        )
        break
      }
      case IndicatorType.VOL: {
        let volData = kLineModel.vol
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [volData.ma5, volData.ma10, volData.ma20, volData.num],
          ['MA5', 'MA10', 'MA20', 'VOLUME'],
          kLineModel, IndicatorType.VOL
        )
        break
      }
      case IndicatorType.BOLL: {
        let bollData = kLineModel.boll
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [bollData.up, bollData.mid, bollData.dn],
          ['UP', 'MID', 'DN'],
          kLineModel, IndicatorType.BOLL
        )
        break
      }
      case IndicatorType.BIAS: {
        let biasData = kLineModel.bias
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [biasData.bias1, biasData.bias2, biasData.bias3],
          ['BIAS6', 'BIAS12', 'BIAS24'],
          kLineModel, IndicatorType.BIAS
        )
        break
      }
      case IndicatorType.BRAR: {
        let brarData = kLineModel.brar
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [brarData.br, brarData.ar],
          ['BR', 'AR'],
          kLineModel, IndicatorType.BRAR
        )
        break
      }
      case IndicatorType.CCI: {
        let cciData = kLineModel.cci
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [cciData.cci],
          ['CCI'],
          kLineModel, IndicatorType.CCI
        )
        break
      }
      case IndicatorType.CR: {
        let crData = kLineModel.cr
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [crData.cr, crData.ma1, crData.ma2, crData.ma3, crData.ma4],
          ['CR', 'MA1', 'MA2', 'MA3', 'MA4'],
          kLineModel, IndicatorType.CR
        )
        break
      }
      case IndicatorType.DMA: {
        let dmaData = kLineModel.dma
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [dmaData.dif, dmaData.difMa],
          ['DIF', 'DIFMA'],
          kLineModel, IndicatorType.DMA
        )
        break
      }
      case IndicatorType.DMI: {
        let dmiData = kLineModel.dmi
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [dmiData.mdi, dmiData.pdi, dmiData.adx, dmiData.adxr],
          ['MDI', 'PDI', 'ADX', 'ADXR'],
          kLineModel, IndicatorType.DMI
        )
        break
      }
      case IndicatorType.KDJ: {
        let kdjData = kLineModel.kdj
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [kdjData.k, kdjData.d, kdjData.j],
          ['K', 'D', 'J'],
          kLineModel, IndicatorType.KDJ
        )
        break
      }
      case IndicatorType.KD: {
        let kdjData = kLineModel.kdj
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [kdjData.k, kdjData.d],
          ['K', 'D'],
          kLineModel, IndicatorType.KDJ
        )
        break
      }
      case IndicatorType.RSI: {
        let rsiData = kLineModel.rsi
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [rsiData.rsi1, rsiData.rsi2, rsiData.rsi3],
          ['RSI6', 'RSI12', 'RSI24'],
          kLineModel, IndicatorType.RSI
        )
        break
      }
      case IndicatorType.PSY: {
        let psyData = kLineModel.psy
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [psyData.psy],
          ['PSY'],
          kLineModel, IndicatorType.PSY
        )
        break
      }
      case IndicatorType.TRIX: {
        let trixData = kLineModel.trix
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [trixData.trix, trixData.maTrix],
          ['TRIX', 'MATRIX'],
          kLineModel, IndicatorType.TRIX
        )
        break
      }
      case IndicatorType.OBV: {
        let obvData = kLineModel.obv
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [obvData.obv, obvData.maObv],
          ['OBV', 'MAOBV'],
          kLineModel, IndicatorType.OBV
        )
        break
      }
      case IndicatorType.VR: {
        let vrModel = kLineModel.vr
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [vrModel.vr, vrModel.maVr],
          ['VR', 'MAVR'],
          kLineModel, IndicatorType.VR
        )
        break
      }
      case IndicatorType.WR: {
        let wrModel = kLineModel.wr
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [wrModel.wr1, wrModel.wr2, wrModel.wr3],
          ['WR1', 'WR2', 'WR3'],
          kLineModel, IndicatorType.WR
        )
        break
      }
      case IndicatorType.MTM: {
        let mtmModel = kLineModel.mtm
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [mtmModel.mtm, mtmModel.mtmMa],
          ['MTM', 'MTMMA'],
          kLineModel, IndicatorType.MTM
        )
        break
      }

      case IndicatorType.EMV: {
        let emvModel = kLineModel.emv
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [emvModel.emv, emvModel.maEmv],
          ['EMV', 'MAEMV'],
          kLineModel, IndicatorType.EMV
        )
        break
      }

      case IndicatorType.SAR: {
        let sarModel = kLineModel.sar
        this.drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [sarModel.sar],
          ['SAR'],
          kLineModel, IndicatorType.SAR
        )
        break
      }
    }
  }

  /**
   * 绘制指标提示文字
   * @param canvas
   * @param startX
   * @param startY
   * @param values
   * @param labels
   * @param kLineModel
   * @param indicatorType
   */
  drawIndicatorTooltipLabels (canvas, startX, startY, values, labels, kLineModel, indicatorType) {
    let labelX = startX
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
      let valueStr = '--'
      if (value || value === 0) {
        if (indicatorType === IndicatorType.VOL) {
          valueStr = value.toFixed(0)
        } else {
          valueStr = value.toFixed(2)
        }
      }
      if (this.tooltip.indicatorData.valueFormatter) {
        valueStr = this.tooltip.indicatorData.valueFormatter(indicatorType, value) || '--'
      }

      let text = labels[i] + ': ' + valueStr
      let textWidth = utils.calcTextWidth((this.tooltip.indicatorData.text.size || this.tooltip.textSize) * 2 + 'px Arial', text)
      canvas.fillStyle = this.indicator.lineColors[i]
      canvas.fillText(text, labelX, startY)
      labelX += this.tooltip.indicatorData.text.margin + textWidth
    }
  }

  /**
   * 设置会否显示cross
   */
  setCross (y, display) {
    this.crossPoint.y = y
    this.displayCross = display
  }
}

export default TooltipChart
