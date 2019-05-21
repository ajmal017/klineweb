import IndicatorChart from './IndicatorChart'
import Type from '../constant/Type'

class CandleChart extends IndicatorChart {
  constructor (candle, indicator, yAxis, dataBounds, viewPortHandler) {
    super(indicator, null, yAxis, dataBounds, viewPortHandler)
    this.candle = candle
  }

  /**
   * 绘制
   * @param canvas
   */
  draw (canvas) {
    this.yAxisChart.getYAxisDataMinMax(this.indicatorType, true, this.candle.chartStyle === Type.ChartStyle.TIME_LINE)
    this.yAxisChart.drawSeparatorLines(canvas)
    this.yAxisChart.drawTickLines(canvas)
    this.drawCandle(canvas)
    this.yAxisChart.drawAxisLine(canvas)
    this.yAxisChart.drawAxisLabels(canvas)
  }

  drawCandle (canvas) {
    canvas.lineWidth = 1
    let kLineDataList = this.dataBounds.dataList
    let startX = this.viewPortHandler.contentLeft()
    let i = this.dataBounds.min
    let candleSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate)
    let rect = []
    while (i < kLineDataList.length && i < this.dataBounds.min + this.dataBounds.range) {
      let endX = startX + candleSpace
      let x = (startX + endX) / 2
      let model = kLineDataList[i]
      let openY = this.getPriceY(model.open)
      let closeY = this.getPriceY(model.close)
      let highY = this.getPriceY(model.high)
      let lowY = this.getPriceY(model.low)
      if (model.close > model.open) {
        canvas.strokeStyle = this.candle.increasingColor
        canvas.fillStyle = this.candle.increasingColor
      } else {
        canvas.strokeStyle = this.candle.decreasingColor
        canvas.fillStyle = this.candle.decreasingColor
      }

      if (this.candle.candleStyle !== Type.CandleStyle.OHLC) {
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
        canvas.closePath()
        canvas.stroke()

        canvas.beginPath()
        canvas.moveTo(x, lowLine[0])
        canvas.lineTo(x, lowLine[1])
        canvas.closePath()
        canvas.stroke()
        switch (this.candle.candleStyle) {
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
        canvas.beginPath()
        canvas.moveTo(x, lowY)
        canvas.lineTo(x, highY)
        canvas.closePath()
        canvas.stroke()

        canvas.beginPath()
        canvas.moveTo(x, openY)
        canvas.lineTo(startX, openY)
        canvas.closePath()
        canvas.stroke()

        canvas.beginPath()
        canvas.moveTo(x, closeY)
        canvas.lineTo(endX, closeY)
        canvas.closePath()
        canvas.stroke()
      }
      startX += this.dataBounds.dataSpace
      ++i
    }
  }

  /**
   * 获取价格对应的y轴点
   * @param yValue
   * @returns {number}
   */
  getPriceY (yValue) {
    return this.getY(yValue, this.yAxisChart.axisMinimum, this.yAxisChart.axisRange)
  }
}

export default CandleChart
