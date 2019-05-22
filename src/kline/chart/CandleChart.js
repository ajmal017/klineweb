import IndicatorChart from './IndicatorChart'
import Type from '../constant/Type'

class CandleChart extends IndicatorChart {
  constructor (candle, indicator, yAxis, dataBounds, viewPortHandler) {
    super(indicator, null, yAxis, dataBounds, viewPortHandler)
    this.candle = candle
    this.indicatorType = Type.IndicatorType.MA
    // 最高价标记数据
    this.highestMarkData = {}
    // 最低价标记数据
    this.lowestMarkData = {}
  }

  /**
   * 绘制
   * @param canvas
   */
  draw (canvas) {
    let isTimeLineChart = this.candle.chartStyle === Type.ChartStyle.TIME_LINE
    this.yAxisChart.getYAxisDataMinMax(this.indicatorType, true, isTimeLineChart)
    this.yAxisChart.drawSeparatorLines(canvas)
    this.yAxisChart.drawTickLines(canvas)
    if (!isTimeLineChart) {
      this.drawCandle(canvas)
      this.drawIndicator(canvas, true)
      this.drawHighestPriceMark(canvas)
      this.drawLowestPriceMark(canvas)
    } else {
      this.drawTimeLine(canvas)
    }
    this.drawLastPriceMark(canvas)
    this.yAxisChart.drawAxisLine(canvas)
    this.yAxisChart.drawAxisLabels(canvas)
  }

  /**
   * 绘制蜡烛图
   * @param canvas
   */
  drawCandle (canvas) {
    canvas.lineWidth = 1
    let kLineDataList = this.dataBounds.dataList
    let startX = this.viewPortHandler.contentLeft()
    let i = this.dataBounds.min
    let candleSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate)
    let halfSpace = candleSpace / 2
    let rect = []
    let markHighestPrice = Number.MIN_VALUE
    let markHighestPriceX = -1
    let markLowestPrice = Number.MAX_VALUE
    let markLowestPriceX = -1
    while (i < kLineDataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + candleSpace
      let x = (startX + endX) / 2
      let model = kLineDataList[i]
      let high = model.high
      let low = model.low

      if (markHighestPrice < high) {
        markHighestPrice = high
        markHighestPriceX = x
      }

      if (low < markLowestPrice) {
        markLowestPrice = low
        markLowestPriceX = x
      }

      let openY = this.getValueY(model.open)
      let closeY = this.getValueY(model.close)
      let highY = this.getValueY(high)
      let lowY = this.getValueY(low)
      if (model.close > model.open) {
        canvas.strokeStyle = this.candle.candleChart.increasingColor
        canvas.fillStyle = this.candle.candleChart.increasingColor
      } else {
        canvas.strokeStyle = this.candle.candleChart.decreasingColor
        canvas.fillStyle = this.candle.candleChart.decreasingColor
      }

      if (this.candle.candleChart.candleStyle !== Type.CandleStyle.OHLC) {
        let highLine = []
        let lowLine = []
        if (openY > closeY) {
          highLine[0] = highY
          highLine[1] = closeY
          lowLine[0] = openY
          lowLine[1] = lowY
          rect = [startX, closeY, endX - startX, openY - closeY]
        } else if (openY < closeY) {
          highLine[0] = highY
          highLine[1] = openY
          lowLine[0] = closeY
          lowLine[1] = lowY
          rect = [startX, openY, endX - startX, closeY - openY]
        } else {
          highLine[0] = highY
          highLine[1] = openY
          lowLine[0] = closeY
          lowLine[1] = lowY
          rect = [startX, openY, endX - startX, 1]
        }
        canvas.beginPath()
        canvas.moveTo(x, highLine[0])
        canvas.lineTo(x, highLine[1])
        canvas.stroke()
        canvas.closePath()

        canvas.beginPath()
        canvas.moveTo(x, lowLine[0])
        canvas.lineTo(x, lowLine[1])
        canvas.stroke()
        canvas.closePath()
        switch (this.candle.candleChart.candleStyle) {
          case Type.CandleStyle.SOLID: {
            canvas.fillRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case Type.CandleStyle.STROKE: {
            canvas.strokeRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case Type.CandleStyle.INCREASING_STROKE: {
            if (model.close > model.open) {
              canvas.strokeRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              canvas.fillRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
          case Type.CandleStyle.DECREASING_STROKE: {
            if (model.close > model.open) {
              canvas.fillRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              canvas.strokeRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
        }
      } else {
        this.drawOhlcLines(canvas, halfSpace, x, openY, closeY, highY, lowY)
      }
      startX += this.dataBounds.dataSpace
      ++i
    }
    this.highestMarkData = { x: markHighestPriceX, price: markHighestPrice }
    this.lowestMarkData = { x: markLowestPriceX, price: markLowestPrice }
  }

  /**
   * 绘制最高价标记
   * @param canvas
   */
  drawHighestPriceMark (canvas) {
    let price = this.highestMarkData.price
    if (price === Number.MIN_VALUE || !this.candle.highestPriceMark.display) {
      return
    }
    let color = this.candle.highestPriceMark.color || this.candle.lowestHighestPriceMarkTextColor
    let textSize = this.candle.highestPriceMark.textSize || this.candle.lowestHighestPriceMarkTextSize
    let valueFormatter = this.candle.highestPriceMark.valueFormatter || this.candle.lowestHighestValueFormatter
    this.drawLowestHighestPriceMark(canvas, this.highestMarkData.x, price, color, textSize, valueFormatter, true)
  }

  /**
   * 绘制最低价标记
   * @param canvas
   */
  drawLowestPriceMark (canvas) {
    let price = this.lowestMarkData.price
    if (price === Number.MAX_VALUE || !this.candle.lowestPriceMark.display) {
      return
    }
    let color = this.candle.lowestPriceMark.color || this.candle.lowestHighestPriceMarkTextColor
    let textSize = this.candle.lowestPriceMark.textSize || this.candle.lowestHighestPriceMarkTextSize
    let valueFormatter = this.candle.lowestPriceMark.valueFormatter || this.candle.lowestHighestValueFormatter
    this.drawLowestHighestPriceMark(canvas, this.lowestMarkData.x, price, color, textSize, valueFormatter)
  }

  /**
   * 绘制最高最低价格标记
   * @param canvas
   * @param x
   * @param price
   * @param color
   * @param textSize
   * @param valueFormatter
   * @param isHigh
   */
  drawLowestHighestPriceMark (canvas, x, price, color, textSize, valueFormatter, isHigh = false) {
    canvas.save()
    canvas.beginPath()
    canvas.rect(
      this.viewPortHandler.contentLeft(),
      this.viewPortHandler.contentTop(),
      this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(),
      this.chartTop + this.chartHeight
    )
    canvas.closePath()
    canvas.clip()
    let priceY = this.getValueY(price)
    let startX = x
    let startY = priceY + (isHigh ? -4 : 4)
    canvas.textAlign = 'left'
    canvas.lineWidth = 1
    canvas.strokeStyle = color
    canvas.fillStyle = color
    canvas.beginPath()
    canvas.moveTo(startX, startY)
    canvas.lineTo(startX - 4, startY + (isHigh ? -4 : 4))
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(startX, startY)
    canvas.lineTo(startX + 4, startY + (isHigh ? -4 : 4))
    canvas.stroke()
    canvas.closePath()
    // 绘制竖线
    canvas.beginPath()
    canvas.moveTo(startX, startY)
    startY = startY + (isHigh ? -10 : 10)
    canvas.lineTo(startX, startY)
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(startX, startY)
    canvas.lineTo(startX + 10, startY)
    canvas.stroke()
    canvas.closePath()

    canvas.font = textSize * 2 + 'px Arial'
    let value = price.toFixed(2)
    if (valueFormatter) {
      value = valueFormatter(price) + ''
    }
    canvas.fillText(value, startX + 14, priceY + (isHigh ? -textSize : textSize * 2))
    canvas.restore()
  }

  /**
   * 绘制最新价标记
   * @param canvas
   */
  drawLastPriceMark (canvas) {
    if (!this.candle.lastPriceMark.display || this.dataBounds.dataList.length === 0) {
      return
    }

    let lastPrice = this.dataBounds.dataList[this.dataBounds.dataList.length - 1].close
    let priceY = this.getValueY(lastPrice)
    priceY = Math.max(this.chartTop + this.chartHeight * 0.05, Math.min(priceY, this.chartTop + this.chartHeight * 0.98))

    canvas.strokeStyle = this.candle.lastPriceMark.lineColor
    canvas.lineWidth = this.candle.lastPriceMark.lineSize
    if (this.candle.lastPriceMark.lineStyle === Type.LineStyle.DASH) {
      canvas.setLineDash(this.candle.lastPriceMark.dashValue)
    }
    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), priceY)
    canvas.lineTo(this.viewPortHandler.contentRight(), priceY)
    canvas.stroke()
    canvas.closePath()
    canvas.setLineDash([])
  }

  /**
   * 绘制分时线
   * @param canvas
   */
  drawTimeLine (canvas) {
    let timeLinePoints = []
    let timeLineAreaPoints = [{ x: this.viewPortHandler.contentLeft(), y: this.chartTop + this.chartHeight }]
    let averageLinePoints = []

    canvas.lineWidth = this.candle.timeChart.timeLineSize

    let kLineDataList = this.dataBounds.dataList
    let startX = this.viewPortHandler.contentLeft()
    let i = this.dataBounds.min
    let dataSpace = this.dataBounds.dataSpace - this.dataBounds.dataMarginSpaceRate * this.dataBounds.dataSpace
    while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + dataSpace
      let x = (startX + endX) / 2
      let model = kLineDataList[i]
      let closeY = this.getValueY(model.close)
      let averagePriceY = this.getValueY(model.averagePrice)
      timeLinePoints.push({ x: x, y: closeY })
      if (model.averagePrice) {
        averageLinePoints.push({ x: x, y: averagePriceY })
      }
      if (i === this.dataBounds.min) {
        timeLineAreaPoints.push({ x: this.viewPortHandler.contentLeft(), y: closeY })
        timeLineAreaPoints.push({ x: x, y: closeY })
      } else if (i === this.dataBounds.min + this.dataBounds.range - 1) {
        timeLineAreaPoints.push({ x: x, y: closeY })
        timeLineAreaPoints.push({ x: this.viewPortHandler.contentRight(), y: closeY })
        timeLineAreaPoints.push({ x: this.viewPortHandler.contentRight(), y: this.chartHeight + this.chartTop })
      } else if (i === this.dataBounds.dataList.length - 1) {
        timeLineAreaPoints.push({ x: x, y: closeY })
        timeLineAreaPoints.push({ x: x, y: this.chartTop + this.chartHeight })
      } else {
        timeLineAreaPoints.push({ x: x, y: closeY })
      }
      startX += this.dataBounds.dataSpace
      ++i
    }
    if (timeLinePoints.length > 0) {
      // 绘制分时线
      canvas.strokeStyle = this.candle.timeChart.timeLineColor
      canvas.beginPath()
      canvas.moveTo(timeLinePoints[0].x, timeLinePoints[0].y)
      for (let i = 1; i < timeLinePoints.length; i++) {
        canvas.lineTo(timeLinePoints[i].x, timeLinePoints[i].y)
      }
      canvas.stroke()
      canvas.closePath()
    }

    if (timeLineAreaPoints.length > 0) {
      // 绘制分时线填充区域
      canvas.fillStyle = this.candle.timeChart.timeLineFillColor
      canvas.beginPath()
      canvas.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y)
      for (let i = 1; i < timeLineAreaPoints.length; i++) {
        canvas.lineTo(timeLineAreaPoints[i].x, timeLineAreaPoints[i].y)
      }
      canvas.closePath()
      canvas.fill()
    }

    if (averageLinePoints.length > 0) {
      // 绘制均线
      canvas.strokeStyle = this.candle.timeChart.timeAverageLineColor
      canvas.beginPath()
      canvas.moveTo(averageLinePoints[0].x, averageLinePoints[0].y)
      for (let i = 1; i < averageLinePoints.length; i++) {
        canvas.lineTo(averageLinePoints[i].x, averageLinePoints[i].y)
      }
      canvas.stroke()
      canvas.closePath()
    }
  }
}

export default CandleChart
