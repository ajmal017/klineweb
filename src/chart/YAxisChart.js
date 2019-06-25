import AxisChart from './AxisChart'
import { IndicatorType } from '../component/Indicator'
import { YAxisPosition, YAxisTextPosition } from '../component/YAxis'
import { LineStyle } from '../component/Component'

class YAxisChart extends AxisChart {
  constructor (yAxis, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.axisMaximum = 0
    this.axisMinimum = 0
    this.axisRange = 0
    this.yAxis = yAxis
  }

  drawAxisLine (canvas) {
    if (!this.yAxis.display || !this.yAxis.axisLine.display) {
      return
    }
    canvas.strokeStyle = this.yAxis.axisLine.color || this.yAxis.color
    canvas.lineWidth = this.yAxis.axisLine.size
    canvas.beginPath()
    if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
      canvas.moveTo(this.viewPortHandler.contentLeft() + 0.5, this.chartTop)
      canvas.lineTo(this.viewPortHandler.contentLeft() + 0.5, this.chartTop + this.chartHeight)
    } else {
      canvas.moveTo(this.viewPortHandler.contentRight() + 0.5, this.chartTop)
      canvas.lineTo(this.viewPortHandler.contentRight() + 0.5, this.chartTop + this.chartHeight)
    }
    canvas.stroke()
    canvas.closePath()
  }

  /**
   * 绘制y轴上文字
   * @param canvas
   */
  drawAxisLabels (canvas) {
    if (!this.yAxis.display || !this.yAxis.tickText.display) {
      return
    }

    let initX
    if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
      if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
        if (this.yAxis.display && this.yAxis.tickLine.display) {
          initX = this.viewPortHandler.contentLeft() - this.yAxis.tickLine.size * 2 - this.yAxis.tickText.margin * 2
        } else {
          initX = this.viewPortHandler.contentLeft() - this.yAxis.tickText.margin * 2
        }
      } else {
        if (this.yAxis.display && this.yAxis.tickLine.display) {
          initX = this.viewPortHandler.contentLeft() + this.yAxis.tickLine.size * 2 + this.yAxis.tickText.margin * 2
        } else {
          initX = this.viewPortHandler.contentLeft() + this.yAxis.tickText.margin * 2
        }
      }
    } else {
      if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
        if (this.yAxis.display && this.yAxis.tickLine.display) {
          initX = this.viewPortHandler.contentRight() + this.yAxis.tickLine.size * 2 + this.yAxis.tickText.margin * 2
        } else {
          initX = this.viewPortHandler.contentRight() + this.yAxis.tickText.margin * 2
        }
      } else {
        if (this.yAxis.display && this.yAxis.tickLine.display) {
          initX = this.viewPortHandler.contentRight() - this.yAxis.tickLine.size * 2 - this.yAxis.tickText.margin * 2
        } else {
          initX = this.viewPortHandler.contentRight() - this.yAxis.tickText.margin * 2
        }
      }
    }
    canvas.textBaseline = 'middle'
    canvas.font = this.yAxis.tickText.size * 2 + 'px Arial'
    canvas.fillStyle = this.yAxis.tickText.color || this.yAxis.color

    let labelHeight = this.yAxis.tickText.size * 2

    let formatter = this.yAxis.tickText.valueFormatter
    for (let i = 0; i < this.values.length; i++) {
      let labelY = this.getValueY(this.values[i])
      let label = this.values[i].toString()
      if (formatter) {
        label = formatter(this.values[i]) || '--'
      }
      if (this.checkShowLabel(labelY, labelHeight)) {
        if ((this.yAxis.yAxisPosition === YAxisPosition.LEFT && this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) ||
          (this.yAxis.yAxisPosition === YAxisPosition.RIGHT && this.yAxis.tickText.position !== YAxisTextPosition.OUTSIDE)) {
          canvas.textAlign = 'right'
        } else {
          canvas.textAlign = 'left'
        }
        canvas.fillText(label, initX, labelY)
      }
    }
    canvas.textAlign = 'left'
  }

  /**
   * 绘制y轴分割线
   * @param canvas
   */
  drawSeparatorLines (canvas) {
    if (!this.yAxis.display || !this.yAxis.separatorLine.display) {
      return
    }
    canvas.strokeStyle = this.yAxis.separatorLine.color || this.yAxis.color
    canvas.lineWidth = this.yAxis.separatorLine.size

    let labelHeight = this.yAxis.tickText.size * 2

    if (this.yAxis.separatorLine.style === LineStyle.DASH) {
      canvas.setLineDash(this.yAxis.separatorLine.dashValue)
    }

    for (let i = 0; i < this.values.length; i++) {
      let y = this.getValueY(this.values[i])
      if (this.checkShowLabel(y, labelHeight)) {
        canvas.beginPath()
        canvas.moveTo(this.viewPortHandler.contentLeft(), y + 0.5)
        canvas.lineTo(this.viewPortHandler.contentRight(), y + 0.5)
        canvas.stroke()
        canvas.closePath()
      }
    }
    canvas.setLineDash([])
  }

  /**
   * 绘制刻度线
   * @param canvas
   */
  drawTickLines (canvas) {
    if (!this.yAxis.display || !this.yAxis.tickLine.display) {
      return
    }
    canvas.lineWidth = 1
    canvas.strokeStyle = this.yAxis.axisLine.color || this.yAxis.color
    let labelHeight = this.yAxis.tickText.size * 2
    let startX
    let endX
    if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
      startX = this.viewPortHandler.contentLeft()
      if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
        endX = startX - this.yAxis.tickLine.size * 2
      } else {
        endX = startX + this.yAxis.tickLine.size * 2
      }
    } else {
      startX = this.viewPortHandler.contentRight()
      if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
        endX = startX + this.yAxis.tickLine.size * 2
      } else {
        endX = startX - this.yAxis.tickLine.size * 2
      }
    }
    for (let i = 0; i < this.values.length; i++) {
      let y = this.getValueY(this.values[i])
      if (this.checkShowLabel(y, labelHeight)) {
        canvas.beginPath()
        canvas.moveTo(startX, y + 0.5)
        canvas.lineTo(endX, y + 0.5)
        canvas.stroke()
        canvas.closePath()
      }
    }
  }

  /**
   * 检查是否需要真正显示label及tick线 分割线
   * @param y
   * @param labelHeight
   */
  checkShowLabel (y, labelHeight) {
    return y > this.chartTop + labelHeight && y < this.chartTop + this.chartHeight - labelHeight
  }

  /**
   * 计算y轴数据的最大最小值
   * @param indicatorType
   * @param isMainChart
   * @param isTimeLine
   */
  getYAxisDataMinMax (indicatorType, isMainChart = false, isTimeLine = false) {
    let dataList = this.dataBounds.dataList
    let min = this.dataBounds.min
    let max = Math.min(min + this.dataBounds.range, dataList.length)
    let minMaxArray = [Number.MAX_VALUE, Number.MIN_VALUE]
    if (isTimeLine) {
      for (let i = min; i < max; i++) {
        let model = dataList[i]
        minMaxArray[0] = Math.min.apply(null, [model.averagePrice, model.close, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.averagePrice, model.close, minMaxArray[1]])
      }
    } else {
      for (let i = min; i < max; i++) {
        let model = dataList[i]
        this.calcIndexMinMax(model, indicatorType, minMaxArray)
        if (isMainChart) {
          minMaxArray[0] = Math.min(model.low, minMaxArray[0])
          minMaxArray[1] = Math.max(model.high, minMaxArray[1])
        }
      }
    }

    if (minMaxArray[0] !== Number.MAX_VALUE && minMaxArray[1] !== Number.MIN_VALUE) {
      this.axisMinimum = minMaxArray[0]
      this.axisMaximum = minMaxArray[1]
      this.computeAxis()
    }
  }

  /**
   * 计算指标值的最大最小值
   * @param model
   * @param indexType
   * @param minMaxArray
   * @returns {*}
   */
  calcIndexMinMax (model, indexType, minMaxArray) {
    switch (indexType) {
      case IndicatorType.MA: {
        minMaxArray[0] = Math.min.apply(null, [model.ma.ma5, model.ma.ma10, model.ma.ma20, model.ma.ma60, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.ma.ma5, model.ma.ma10, model.ma.ma20, model.ma.ma60, minMaxArray[1]])
        break
      }
      case IndicatorType.MACD: {
        minMaxArray[0] = Math.min.apply(null, [model.macd.dea, model.macd.diff, model.macd.macd, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.macd.dea, model.macd.diff, model.macd.macd, minMaxArray[1]])
        break
      }
      case IndicatorType.VOL: {
        minMaxArray[0] = Math.min.apply(null, [model.vol.ma5, model.vol.ma10, model.vol.ma20, model.vol.num, 0])
        minMaxArray[1] = Math.max.apply(null, [model.vol.ma5, model.vol.ma10, model.vol.ma20, model.vol.num, minMaxArray[1]])
        break
      }
      case IndicatorType.BOLL: {
        minMaxArray[0] = Math.min.apply(null, [model.boll.up, model.boll.mid, model.boll.dn, model.low, minMaxArray[0]])
        minMaxArray[0] = Math.max.apply(null, [model.boll.up, model.boll.mid, model.boll.dn, model.high, minMaxArray[1]])
        break
      }
      case IndicatorType.BIAS: {
        minMaxArray[0] = Math.min.apply(null, [model.bias.bias1, model.bias.bias2, model.bias.bias3, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.bias.bias1, model.bias.bias2, model.bias.bias3, minMaxArray[1]])
        break
      }
      case IndicatorType.BRAR: {
        minMaxArray[0] = Math.min.apply(null, [model.brar.br, model.brar.ar, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.brar.br, model.brar.ar, minMaxArray[1]])
        break
      }
      case IndicatorType.CCI: {
        minMaxArray[0] = Math.min(model.cci.cci, minMaxArray[0])
        minMaxArray[1] = Math.max(model.cci.cci, minMaxArray[1])
        break
      }
      case IndicatorType.CR: {
        minMaxArray[0] = Math.min.apply(null, [model.cr.cr, model.cr.ma1, model.cr.ma2, model.cr.ma3, model.cr.ma4, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.cr.cr, model.cr.ma1, model.cr.ma2, model.cr.ma3, model.cr.ma4, minMaxArray[1]])
        break
      }
      case IndicatorType.DMA: {
        minMaxArray[0] = Math.min.apply(null, [model.dma.dif, model.dma.difMa, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.dma.dif, model.dma.difMa, minMaxArray[1]])
        break
      }
      case IndicatorType.DMI: {
        minMaxArray[0] = Math.min.apply(null, [model.dmi.pdi, model.dmi.mdi, model.dmi.adx, model.dmi.adxr, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.dmi.pdi, model.dmi.mdi, model.dmi.adx, model.dmi.adxr, minMaxArray[1]])
        break
      }
      case IndicatorType.KDJ: {
        minMaxArray[0] = Math.min.apply(null, [model.kdj.k, model.kdj.d, model.kdj.j, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.kdj.k, model.kdj.d, model.kdj.j, minMaxArray[1]])
        break
      }
      case IndicatorType.KD: {
        minMaxArray[0] = Math.min.apply(null, [model.kdj.k, model.kdj.d, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.kdj.k, model.kdj.d, minMaxArray[1]])
        break
      }
      case IndicatorType.RSI: {
        minMaxArray[0] = Math.min.apply(null, [model.rsi.rsi1, model.rsi.rsi2, model.rsi.rsi3, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.rsi.rsi1, model.rsi.rsi2, model.rsi.rsi3, minMaxArray[1]])
        break
      }
      case IndicatorType.PSY: {
        minMaxArray[0] = Math.min(model.psy.psy, minMaxArray[0])
        minMaxArray[1] = Math.max(model.psy.psy, minMaxArray[1])
        break
      }
      case IndicatorType.TRIX: {
        minMaxArray[0] = Math.min.apply(null, [model.trix.trix, model.trix.maTrix, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.trix.trix, model.trix.maTrix, minMaxArray[1]])
        break
      }
      case IndicatorType.OBV: {
        minMaxArray[0] = Math.min.apply(null, [model.obv.obv, model.obv.maObv, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.obv.obv, model.obv.maObv, minMaxArray[1]])
        break
      }
      case IndicatorType.VR: {
        minMaxArray[0] = Math.min.apply(null, [model.vr.vr, model.vr.maVr, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.vr.vr, model.vr.maVr, minMaxArray[1]])
        break
      }
      case IndicatorType.WR: {
        minMaxArray[0] = Math.min.apply(null, [model.wr.wr1, model.wr.wr2, model.wr.wr3, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.wr.wr1, model.wr.wr2, model.wr.wr3, minMaxArray[1]])
        break
      }
      case IndicatorType.MTM: {
        minMaxArray[0] = Math.min.apply(null, [model.mtm.mtm, model.mtm.mtmMa, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.mtm.mtm, model.mtm.mtmMa, minMaxArray[1]])
        break
      }
      case IndicatorType.EMV: {
        minMaxArray[0] = Math.min.apply(null, [model.emv.emv, model.emv.maEmv, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.emv.emv, model.emv.maEmv, minMaxArray[1]])
        break
      }
      case IndicatorType.SAR: {
        minMaxArray[0] = Math.min.apply(null, [model.sar.sar, model.low, minMaxArray[0]])
        minMaxArray[1] = Math.max.apply(null, [model.sar.sar, model.high, minMaxArray[1]])
        break
      }
    }
    return minMaxArray
  }

  computeAxis () {
    let min = this.axisMinimum
    let max = this.axisMaximum

    let range = Math.abs(max - min)

    if (range === 0) {
      max += 1
      min -= 1
      range = Math.abs(max - min)
    }

    this.axisMinimum = min - (range / 100) * 10
    this.axisMaximum = max + (range / 100) * 20

    this.axisRange = Math.abs(this.axisMaximum - this.axisMinimum)

    this.computeAxisValues(this.axisMinimum, this.axisMaximum)
  }

  /**
   * 获取y点坐标
   * @param yValue Float
   * @return number
   */
  getValueY (yValue) {
    return this.getY(yValue, this.axisMinimum, this.axisRange)
  }
}

export default YAxisChart
