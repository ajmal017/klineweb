import Chart from './Chart'
import Type from '../constant/Type'

import utils from '../utils/utils'

class TooltipChart extends Chart {
  constructor (tooltip, indicator, yAxis, candleChart, volChart, indicatorChart, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.displayCross = false
    this.crossPoint = { x: 0, y: 0 }
    this.tooltip = tooltip
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
        canvas.font = this.tooltip.crossTextSize * 2 + 'px Arial'

        this.drawCrossHorizontalLine(canvas)
        this.drawCrossVerticalLine(canvas, kLineModel)
        this.drawGeneralDataTooltip(canvas, kLineModel)
      }

      if (this.tooltip.indicatorDisplayRule === Type.IndicatorDisplayRule.ALWAYS ||
        (this.tooltip.indicatorDisplayRule === Type.IndicatorDisplayRule.FOLLOW_CROSS && this.displayCross)) {
        let textHeight = this.tooltip.tooltipTextSize * 2
        let startX = this.viewPortHandler.contentLeft() + 6
        if (this.candle.chartStyle !== Type.ChartStyle.TIME_LINE) {
          // 绘制主图的指标提示文字
          this.drawIndicatorTooltip(
            canvas, startX,
            this.candleChart.chartTop + 4 + textHeight,
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
    let isDrawYAxisTextOutside = this.yAxis.yAxisTextPosition === Type.YAxisTextPosition.OUTSIDE
    let yAxisDataLabelWidth = utils.calcTextWidth(this.tooltip.crossTextSize * 2 + 'px Arial', yAxisDataLabel)
    let halfLabelHeight = this.tooltip.crossTextSize
    let labelStartX
    let labelStartY = this.crossPoint.y + halfLabelHeight

    let lineStartX = this.viewPortHandler.contentLeft()
    let lineEndX = this.viewPortHandler.contentRight()

    let centerPoint = this.viewPortHandler.getContentCenter()
    let crossTextMarginSpace = 6
    if (this.yAxis.yAxisPosition === Type.YAxisPosition.LEFT) {
      if (this.crossPoint.x > centerPoint.x) {
        // 左边
        if (!isDrawYAxisTextOutside) {
          lineStartX = this.viewPortHandler.contentLeft() +
            this.tooltip.crossTextRectStrokeLineSize * 2 + crossTextMarginSpace * 3 + yAxisDataLabelWidth
        }
        labelStartX = lineStartX - crossTextMarginSpace * 2 - yAxisDataLabelWidth
      } else {
        // 右边
        lineEndX = this.viewPortHandler.contentRight() -
          this.tooltip.crossTextRectStrokeLineSize * 2 -
          crossTextMarginSpace * 3 - yAxisDataLabelWidth
        labelStartX = lineEndX + crossTextMarginSpace * 2
      }
    } else {
      if (this.crossPoint.x > centerPoint.x) {
        // 左边
        lineStartX = this.viewPortHandler.contentLeft() +
          this.tooltip.crossTextRectStrokeLineSize * 2 +
          crossTextMarginSpace * 3 + yAxisDataLabelWidth
        labelStartX = this.viewPortHandler.contentLeft() +
          crossTextMarginSpace + this.tooltip.crossTextRectStrokeLineSize
      } else {
        // 右边
        if (!isDrawYAxisTextOutside) {
          lineEndX = this.viewPortHandler.contentRight() -
            this.tooltip.crossTextRectStrokeLineSize * 2 -
            crossTextMarginSpace * 3 - yAxisDataLabelWidth
        }
        labelStartX = lineEndX + crossTextMarginSpace * 2
      }
    }

    if (this.crossPoint.x > centerPoint.x) {
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
    canvas.lineWidth = this.tooltip.crossLineSize
    canvas.strokeStyle = this.tooltip.crossLineColor
    if (this.tooltip.crossLineStyle === Type.LineStyle.DASH) {
      canvas.setLineDash([8, 8])
    }
    canvas.beginPath()
    canvas.moveTo(lineStartX, this.crossPoint.y)
    canvas.lineTo(lineEndX, this.crossPoint.y)
    canvas.closePath()
    canvas.stroke()
    canvas.setLineDash(null)

    // 绘制y轴文字外的边框
    canvas.fillStyle = this.tooltip.crossTextRectFillColor
    canvas.beginPath()
    canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y)
    for (let i = 1; i < this.yAxisLabelStrokePathPoints.length; i++) {
      canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x, this.yAxisLabelStrokePathPoints[i].y)
    }
    canvas.closePath()
    canvas.fill()

    canvas.lineWidth = this.tooltip.crossTextRectStrokeLineSize
    canvas.strokeStyle = this.tooltip.crossTextRectStrokeLineColor
    canvas.beginPath()
    canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y)
    for (let i = 1; i < this.yAxisLabelStrokePathPoints.length; i++) {
      canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x, this.yAxisLabelStrokePathPoints[i].y)
    }
    canvas.closePath()
    canvas.stroke()

    canvas.fillStyle = this.tooltip.crossTextColor
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

      return text
    } else if (eventY > volChartTop && eventY < volChartTop + volChartHeight) {
      let volIndicatorChartYAxisDataMin = volChartYAxis.axisMinimum
      let volIndicatorChartYAxisDataMax = volChartYAxis.axisMaximum
      let yData = (1 - (eventY - volChartTop) / volChartHeight) * (volIndicatorChartYAxisDataMax - volIndicatorChartYAxisDataMin) + volIndicatorChartYAxisDataMin
      let text = yData.toFixed(0)
      return text
    } else if (eventY > indicatorChartTop && eventY < indicatorChartTop + indicatorChartHeight) {
      let indicatorChartYAxisDataMin = indicatorChartYAxis.axisMinimum
      let indicatorChartYAxisDataMax = indicatorChartYAxis.axisMaximum
      let yData = (1 - (eventY - indicatorChartTop) / indicatorChartHeight) * (indicatorChartYAxisDataMax - indicatorChartYAxisDataMin) + indicatorChartYAxisDataMin
      if (this.indicatorChart.indicatorType === Type.IndicatorType.VOL) {
        return yData.toFixed(0)
      }
      return yData.toFixed(2)
    }
    return null
  }

  /**
   * 绘制十字光标垂直线
   * @param canvas Canvas
   * @param kLineModel KLineModel
   */
  drawCrossVerticalLine (canvas, kLineModel) {
    canvas.lineWidth = this.tooltip.crossLineSize
    canvas.strokeStyle = this.tooltip.crossLineColor

    if (this.tooltip.crossLineStyle === Type.LineStyle.DASH) {
      canvas.setLineDash([8, 8])
    }

    canvas.beginPath()
    canvas.moveTo(this.crossPoint.x, this.viewPortHandler.contentTop())
    canvas.lineTo(this.crossPoint.x, this.viewPortHandler.contentBottom())
    canvas.closePath()
    canvas.stroke()
    canvas.setLineDash(null)

    let timestamp = kLineModel.timestamp
    let label = utils.formatDate(timestamp)
    let labelWidth = utils.calcTextWidth(this.tooltip.crossTextSize * 2 + 'px Arial', label)
    let xAxisLabelX = this.crossPoint.x - labelWidth.width() / 2
    let crossTextMarginSpace = 6
    // 保证整个x轴上的提示文字总是完全显示
    if (xAxisLabelX < this.viewPortHandler.contentLeft() + crossTextMarginSpace + this.tooltip.crossTextRectStrokeLineSize) {
      xAxisLabelX = this.viewPortHandler.contentLeft()
    } else if (xAxisLabelX > this.viewPortHandler.contentRight() - labelWidth - this.tooltip.crossTextRectStrokeLineSize) {
      xAxisLabelX = this.viewPortHandler.contentRight() - labelWidth - this.tooltip.crossTextRectStrokeLineSize
    }

    let rectLeft = xAxisLabelX - this.tooltip.crossTextRectStrokeLineSize - crossTextMarginSpace
    let rectTop = this.viewPortHandler.contentBottom()
    let rectRight = xAxisLabelX + labelWidth + crossTextMarginSpace + this.tooltip.crossTextRectStrokeLineSize
    let rectBottom = this.viewPortHandler.contentBottom() + labelWidth + this.tooltip.crossTextRectStrokeLineSize + crossTextMarginSpace * 2
    canvas.fillStyle = this.tooltip.crossTextRectFillColor
    canvas.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    canvas.lineWidth = this.tooltip.crossTextRectStrokeLineSize
    canvas.strokeStyle = this.tooltip.crossTextRectStrokeLineColor
    canvas.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    // 绘制轴上的提示文字
    canvas.fillStyle = this.tooltip.crossTextColor
    canvas.fillText(
      label,
      xAxisLabelX,
      this.viewPortHandler.contentBottom() + labelWidth + this.tooltip.crossTextRectStrokeLineSize + crossTextMarginSpace
    )
  }

  /**
   * 绘制指标提示文字
   * @param canvas
   * @param startX
   * @param startY
   * @param kLineModel
   * @param indicatorType
   */
  drawIndicatorTooltip(canvas, startX, startY, kLineModel, indicatorType) {
    switch (indicatorType) {
      case Type.IndicatorType.MA: {
        let maData = kLineModel.ma
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [maData.ma5, maData.ma10, maData.ma20, maData.ma60],
          ['MA5', 'MA10', 'MA20', 'MA60'],
          kLineModel, Type.IndicatorType.MA
        )
      }
      case Type.IndicatorType.MACD: {
        let macdData = kLineModel.macd
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [macdData.diff, macdData.dea, macdData.macd],
          ['DIFF', 'DEA', 'MACD'],
          kLineModel, Type.IndicatorType.MACD
        )
      }
      case Type.IndicatorType.VOL: {
        let volData = kLineModel.vol
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [volData.ma5, volData.ma10, volData.ma20, volData.num],
          ['MA5', 'MA10', 'MA20', 'VOLUME'],
          kLineModel, Type.IndicatorType.VOL
        )
      }
      case Type.IndicatorType.BOLL: {
        let bollData = kLineModel.boll
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [bollData.up, bollData.mid, bollData.dn],
          ['UP', 'MID', 'DN'],
          kLineModel, Type.IndicatorType.BOLL
        )
      }
      case Type.IndicatorType.BIAS: {
        let biasData = kLineModel.bias
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [biasData.bias1, biasData.bias2, biasData.bias3],
          ['BIAS6', 'BIAS12', 'BIAS24'],
          kLineModel, Type.IndicatorType.BIAS
        )
      }
      case Type.IndicatorType.BRAR: {
        let brarData = kLineModel.brar
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [brarData.br, brarData.ar],
          ['BR', 'AR'],
          kLineModel, Type.IndicatorType.BRAR
        )
      }
      case Type.IndicatorType.CCI: {
        let cciData = kLineModel.cci
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [cciData.cci],
          ['CCI'],
          kLineModel, Type.IndicatorType.CCI
        )
      }
      case Type.IndicatorType.CR: {
        let crData = kLineModel.cr
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [crData.cr, crData.ma1, crData.ma2, crData.ma3, crData.ma4],
          ['CR', 'MA1', 'MA2', 'MA3', 'MA4'],
          kLineModel, Type.IndicatorType.CR
        )
      }
      case Type.IndicatorType.DMA: {
        let dmaData = kLineModel.dma
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [dmaData.dif, dmaData.difMa],
          ['DIF', 'DIFMA'],
          kLineModel, Type.IndicatorType.DMA
        )
      }
      case Type.IndicatorType.DMI: {
        let dmiData = kLineModel.dmi
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [dmiData.mdi, dmiData.pdi, dmiData.adx, dmiData.adxr],
          ['MDI', 'PDI', 'ADX', 'ADXR'],
          kLineModel, Type.IndicatorType.DMI
        )
      }
      case Type.IndicatorType.KDJ: {
        let kdjData = kLineModel.kdj
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [kdjData.k, kdjData.d, kdjData.j],
          ['K', 'D', 'J'],
          kLineModel, Type.IndicatorType.KDJ
        )
      }
      case Type.IndicatorType.KD: {
        let kdjData = kLineModel.kdj
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [kdjData.k, kdjData.d],
          ['K', 'D'],
          kLineModel, Type.IndicatorType.KDJ
        )
      }
      case Type.IndicatorType.RSI: {
        let rsiData = kLineModel.rsi
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [rsiData.rsi1, rsiData.rsi2, rsiData.rsi3],
          ['RSI6', 'RSI12', 'RSI24'],
          kLineModel, Type.IndicatorType.RSI
        )
      }
      case Type.IndicatorType.PSY: {
        let psyData = kLineModel.psy
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [psyData.psy],
          ['PSY'],
          kLineModel, Type.IndicatorType.PSY
        )
      }
      case Type.IndicatorType.TRIX: {
        let trixData = kLineModel.trix
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [trixData.trix, trixData.maTrix],
          ['TRIX', 'MATRIX'],
          kLineModel, Type.IndicatorType.TRIX
        )
      }
      case Type.IndicatorType.OBV: {
        let obvData = kLineModel.obv
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [obvData.obv, obvData.maObv],
          ['OBV', 'MAOBV'],
          kLineModel, Type.IndicatorType.OBV
        )
        break
      }
      case Type.IndicatorType.VR: {
        let vrModel = kLineModel.vr
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [vrModel.vr, vrModel.maVr],
          ['VR','MAVR'],
          kLineModel, Type.IndicatorType.VR
        )
        break
      }
      case Type.IndicatorType.WR: {
        let wrModel = kLineModel.wr
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [wrModel.wr1, wrModel.wr2, wrModel.wr3],
          ['WR1', 'WR2', 'WR3'],
          kLineModel, Type.IndicatorType.WR
        )
      }
      case Type.IndicatorType.MTM: {
        let mtmModel = kLineModel.mtm
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [mtmModel.mtm, mtmModel.mtmMa],
          ['MTM', 'MTMMA'],
          kLineModel, Type.IndicatorType.MTM
        )
        break
      }

      case Type.IndicatorType.EMV: {
        let emvModel = kLineModel.emv
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          mutableListOf(emvModel?.emv, emvModel?.maEmv),
          ['EMV', 'MAEMV'],
          kLineModel, Type.IndicatorType.EMV
        )
        break
      }

      case Type.IndicatorType.SAR: {
        let sarModel = kLineModel.sar
        drawIndicatorTooltipLabels(
          canvas, startX, startY,
          [sarModel.sar]
          ['SAR'],
          kLineModel, Type.IndicatorType.SAR
        )
        break
      }
    }
  }

  /**
   * 绘制指标提示文字
   * @param canvas Canvas
   * @param startX Float
   * @param startY Float
   * @param values MutableList<Double?>
   * @param labels MutableList<String>
   * @param indicatorType Int
   */
  drawIndicatorTooltipLabels(canvas, startX, startY, values, labels, kLineModel, indicatorType) {
  let labelX = startX
  for (let i = 0; i < values.length; i++) {
    let valueStr
  if (value != null) {
  valueStr = if (indicatorType == Indicator.IndicatorType.VOL) {
  "${values[i]?.toInt() ?: "--"}"
} else {
  String.format("%.2f", values[i])
}
}
valueStr = tooltip.valueFormatter?.formatter(
  ValueFormatter.FORMATTER_TYPE_INDICATOR,
  kLineModel,
  value, indicatorType
) ?: valueStr
val text = "${labels[i]}: $valueStr"
val textWidth = Utils.calcTextWidth(mPaint, text)
mPaint.color = indicator.lineColors[i]
canvas.drawText(text, labelX, startY, mPaint)
labelX += dp8ToPx + textWidth
}
}

  /**
   * 设置会否显示cross
   */
  setCross(y, display) {
    this.crossPoint.y = y
    this.displayCross = display
  }
}

export default TooltipChart
