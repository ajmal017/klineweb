import Chart from './Chart'
import YAxisChart from './YAxisChart'
import { IndicatorType } from '../component/Indicator'

class IndicatorChart extends Chart {
  constructor (indicator, xAxis, yAxis, dataBounds, viewPortHandler, indicatorType = IndicatorType.MACD) {
    super(dataBounds, viewPortHandler)
    this.indicator = indicator
    this.xAxis = xAxis
    this.yAxisChart = new YAxisChart(yAxis, dataBounds, viewPortHandler)
    this.indicatorType = indicatorType
  }

  setChartDimens (height, top) {
    super.setChartDimens(height, top)
    this.yAxisChart.setChartDimens(height, top)
  }

  draw (canvas) {
    this.drawChartHorizontalSeparatorLine(canvas)
    this.yAxisChart.getYAxisDataMinMax(this.indicatorType)
    this.yAxisChart.drawSeparatorLines(canvas)
    this.yAxisChart.drawTickLines(canvas)

    this.drawIndicator(canvas)

    this.yAxisChart.drawAxisLine(canvas)
    this.yAxisChart.drawAxisLabels(canvas)
  }

  /**
   * 绘制各图之间分割线
   * @param canvas
   */
  drawChartHorizontalSeparatorLine (canvas) {
    canvas.lineWidth = this.xAxis.axisLine.size
    canvas.strokeStyle = this.xAxis.axisLine.color
    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.chartTop)
    canvas.lineTo(this.viewPortHandler.contentRight(), this.chartTop)
    canvas.closePath()
    canvas.stroke()
  }

  /**
   * 绘制指标
   * @param canvas
   * @param isMainIndicator
   */
  drawIndicator (canvas, isMainIndicator = false) {
    switch (this.indicatorType) {
      case IndicatorType.MA: {
        this.drawLines(canvas, 'ma', ['ma5', 'ma10', 'ma20', 'ma60'])
        break
      }

      case IndicatorType.MACD: {
        this.drawBarLines(canvas, 'macd', 'macd', ['diff', 'dea'], (kLineModel, preKLineModel, barBuffer) => {
          let macd = (kLineModel.macd || {}).macd
          let preMacd = ((preKLineModel || {}).macd || {}).macd
          if (macd > 0) {
            canvas.strokeStyle = this.indicator.increasingColor
            canvas.fillStyle = this.indicator.increasingColor
          } else {
            canvas.strokeStyle = this.indicator.decreasingColor
            canvas.fillStyle = this.indicator.decreasingColor
          }
          if ((preMacd || preMacd === 0) && macd > preMacd) {
            canvas.strokeRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1])
          } else {
            canvas.fillRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1])
          }
        })
        break
      }

      case IndicatorType.VOL: {
        this.drawBarLines(canvas, 'vol', 'num', ['ma5', 'ma10', 'ma20'], (kLineModel, preKLineModel, barBuffer) => {
          let close = kLineModel.close
          let preClose = (preKLineModel || {}).close
          if ((preClose || preClose === 0) && close > preClose) {
            canvas.fillStyle = this.indicator.increasingColor
          } else {
            canvas.fillStyle = this.indicator.decreasingColor
          }
          canvas.fillRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1])
        })
        break
      }

      case IndicatorType.BOLL: {
        this.drawLines(canvas, 'boll', ['up', 'mid', 'dn'], (x, kLineModel) => {
          let halfSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate) / 2
          this.drawOhlc(canvas, halfSpace, x, kLineModel, isMainIndicator)
        })
        break
      }

      case IndicatorType.BIAS: {
        this.drawLines(canvas, 'bias', ['bias1', 'bias2', 'bias3'])
        break
      }

      case IndicatorType.BRAR: {
        this.drawLines(canvas, 'brar', ['br', 'ar'])
        break
      }

      case IndicatorType.CCI: {
        this.drawLines(canvas, 'cci', ['cci'])
        break
      }

      case IndicatorType.CR: {
        this.drawLines(canvas, 'cr', ['cr', 'ma1', 'ma2', 'ma3', 'ma4'])
        break
      }

      case IndicatorType.DMA: {
        this.drawLines(canvas, 'dma', ['dif', 'difMa'])
        break
      }

      case IndicatorType.DMI: {
        this.drawLines(canvas, 'dmi', ['mdi', 'pdi', 'adx', 'adxr'])
        break
      }

      case IndicatorType.KDJ: {
        this.drawLines(canvas, 'kdj', ['k', 'd', 'j'])
        break
      }

      case IndicatorType.KD: {
        this.drawLines(canvas, 'kd', ['k', 'd'])
        break
      }

      case IndicatorType.RSI: {
        this.drawLines(canvas, 'rsi', ['rsi1', 'rsi2', 'rsi3'])
        break
      }

      case IndicatorType.PSY: {
        this.drawLines(canvas, 'psy', ['psy'])
        break
      }

      case IndicatorType.TRIX: {
        this.drawLines(canvas, 'trix', ['trix', 'maTrix'])
        break
      }

      case IndicatorType.OBV: {
        this.drawLines(canvas, 'obv', ['obv', 'maObv'])
        break
      }

      case IndicatorType.VR: {
        this.drawLines(canvas, 'vr', ['vr', 'maVr'])
        break
      }

      case IndicatorType.WR: {
        this.drawLines(canvas, 'wr', ['wr1', 'wr2', 'wr3'])
        break
      }

      case IndicatorType.MTM: {
        this.drawLines(canvas, 'mtm', ['mtm', 'mtmMa'])
        break
      }

      case IndicatorType.EMV: {
        this.drawLines(canvas, 'emv', ['emv', 'maEmv'])
        break
      }

      case IndicatorType.SAR: {
        this.drawSar(canvas, isMainIndicator)
      }
    }
  }

  /**
   * 绘制Sar
   * @param canvas
   * @param isMainIndicator
   */
  drawSar (canvas, isMainIndicator) {
    canvas.save()
    canvas.beginPath()
    canvas.rect(
      this.viewPortHandler.contentLeft(),
      this.chartTop,
      this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(),
      this.viewPortHandler.contentBottom() - this.chartTop
    )
    canvas.closePath()
    canvas.clip()
    canvas.lineWidth = 1
    let startX = this.viewPortHandler.contentLeft()
    let dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate)
    let halfBarSpace = dataSpace / 2
    let i = this.dataBounds.min
    while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + dataSpace
      let x = (startX + endX) / 2
      let kLineModel = this.dataBounds.dataList[i]

      this.drawOhlc(canvas, halfBarSpace, x, kLineModel, isMainIndicator)

      let data = kLineModel.sar
      let sar = data.sar
      if (sar || sar === 0) {
        let dataY = this.getValueY(sar)
        if (sar < (kLineModel.high + kLineModel.low) / 2) {
          canvas.strokeStyle = this.indicator.increasingColor
        } else {
          canvas.strokeStyle = this.indicator.decreasingColor
        }
        canvas.beginPath()
        canvas.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true)
        canvas.stroke()
        canvas.closePath()
      }
      startX += this.dataBounds.dataSpace
      ++i
    }
    canvas.restore()
  }

  /**
   * 绘制有柱状图有线的指标
   * @param canvas
   * @param dataKey
   * @param barDataKey
   * @param lineDataKeys
   * @param drawRect
   */
  drawBarLines (canvas, dataKey, barDataKey, lineDataKeys, drawRect) {
    let startX = this.viewPortHandler.contentLeft()
    let dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate)
    let halfBarSpace = dataSpace / 2
    let i = this.dataBounds.min
    let barBuffer = []
    let lineValues = []
    while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + dataSpace
      let x = (startX + endX) / 2
      let kLineModel = this.dataBounds.dataList[i]
      let preKLineModel
      if (i > 0) {
        preKLineModel = this.dataBounds.dataList[i - 1]
      }
      let data = kLineModel[dataKey]
      let barData = data[barDataKey]
      if (barData || barData === 0) {
        barBuffer[0] = x - halfBarSpace
        barBuffer[2] = x + halfBarSpace
        let dataY = this.getValueY(barData)
        let zeroY = this.getValueY(0)
        barBuffer[1] = dataY
        barBuffer[3] = zeroY

        drawRect(kLineModel, preKLineModel, barBuffer)
      }
      for (let j = 0; j < lineDataKeys.length; j++) {
        let value = data[lineDataKeys[j]]
        let valueY = this.getValueY(value)
        if (!lineValues[j]) {
          lineValues[j] = [{ x: x, y: valueY }]
        } else {
          lineValues[j].push({ x: x, y: valueY })
        }
      }
      startX += this.dataBounds.dataSpace
      ++i
    }
    this.drawLine(canvas, lineValues)
  }

  /**
   * 绘制只有线的指标
   * @param canvas
   * @param dataKey
   * @param lineDataKeys
   * @param draw
   */
  drawLines (canvas, dataKey, lineDataKeys, draw) {
    let startX = this.viewPortHandler.contentLeft()
    let i = this.dataBounds.min
    let dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate)
    let lineValues = []
    while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + dataSpace
      let x = (startX + endX) / 2
      let kLineModel = this.dataBounds.dataList[i]
      if (draw) {
        draw(x, kLineModel)
      }
      let data = kLineModel[dataKey]
      for (let j = 0; j < lineDataKeys.length; j++) {
        let value = data[lineDataKeys[j]]
        let valueY = this.getValueY(value)
        if (!lineValues[j]) {
          lineValues[j] = [{ x: x, y: valueY }]
        } else {
          lineValues[j].push({ x: x, y: valueY })
        }
      }

      startX += this.dataBounds.dataSpace
      ++i
    }
    this.drawLine(canvas, lineValues)
  }

  /**
   * 绘制线
   * @param canvas
   * @param lineValues
   */
  drawLine (canvas, lineValues) {
    for (let i = 0; i < lineValues.length; i++) {
      let values = lineValues[i]
      if (values.length > 0) {
        canvas.strokeStyle = this.indicator.lineColors[i]
        canvas.beginPath()
        canvas.moveTo(values[0].x, values[0].y)
        for (let j = 1; j < values.length; j++) {
          canvas.lineTo(values[j].x, values[j].y)
        }
        canvas.stroke()
        canvas.closePath()
      }
    }
  }

  /**
   * 绘制指标图里面的开低高收价
   */
  drawOhlc (canvas, halfBarSpace, x, kLineModel, isMainIndicator) {
    if (!isMainIndicator) {
      let openY = this.getValueY(kLineModel.open)
      let closeY = this.getValueY(kLineModel.close)
      let highY = this.getValueY(kLineModel.high)
      let lowY = this.getValueY(kLineModel.low)
      if (kLineModel.close > kLineModel.open) {
        canvas.strokeStyle = this.indicator.increasingColor
      } else {
        canvas.strokeStyle = this.indicator.decreasingColor
      }
      this.drawOhlcLines(canvas, halfBarSpace, x, openY, closeY, highY, lowY)
    }
  }

  /**
   * 绘制ohlc线
   * @param canvas
   * @param halfBarSpace
   * @param x
   * @param openY
   * @param closeY
   * @param highY
   * @param lowY
   */
  drawOhlcLines (canvas, halfBarSpace, x, openY, closeY, highY, lowY) {
    canvas.beginPath()
    canvas.moveTo(x, highY)
    canvas.lineTo(x, lowY)
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(x - halfBarSpace, openY)
    canvas.lineTo(x, openY)
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(x + halfBarSpace, closeY)
    canvas.lineTo(x, closeY)
    canvas.stroke()
    canvas.closePath()
  }

  /**
   * 获取y点坐标
   * @param yValue Float
   */
  getValueY (yValue) {
    return this.getY(yValue, this.yAxisChart.axisMinimum, this.yAxisChart.axisRange)
  }

  /**
   * 是否显示图
   * @returns {boolean}
   */
  isDisplayChart () {
    return this.indicatorType !== IndicatorType.NO
  }
}

export default IndicatorChart
