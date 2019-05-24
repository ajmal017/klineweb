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
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.chartTop)
      canvas.lineTo(this.viewPortHandler.contentLeft(), this.chartTop + this.chartHeight)
    } else {
      canvas.moveTo(this.viewPortHandler.contentRight(), this.chartTop)
      canvas.lineTo(this.viewPortHandler.contentRight(), this.chartTop + this.chartHeight)
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

    canvas.font = this.yAxis.tickText.size * 2 + 'px Arial'
    canvas.fillStyle = this.yAxis.tickText.color || this.yAxis.color

    let labelHeight = this.yAxis.tickText.size * 2
    let halfLabelHeight = labelHeight / 2

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
        let startY = labelY + halfLabelHeight
        canvas.fillText(label, initX, startY)
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
        canvas.moveTo(this.viewPortHandler.contentLeft(), y)
        canvas.lineTo(this.viewPortHandler.contentRight(), y)
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
        canvas.moveTo(startX, y)
        canvas.lineTo(endX, y)
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
        minMaxArray[0] = Math.min(model.averagePrice, minMaxArray[0])
        minMaxArray[0] = Math.min(model.close, minMaxArray[0])
        minMaxArray[1] = Math.max(model.averagePrice, minMaxArray[1])
        minMaxArray[1] = Math.max(model.close, minMaxArray[1])
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
        minMaxArray[0] = Math.min(model.ma.ma5, minMaxArray[0])
        minMaxArray[0] = Math.min(model.ma.ma10, minMaxArray[0])
        minMaxArray[0] = Math.min(model.ma.ma20, minMaxArray[0])
        minMaxArray[0] = Math.min(model.ma.ma60, minMaxArray[0])
        minMaxArray[1] = Math.max(model.ma.ma5, minMaxArray[1])
        minMaxArray[1] = Math.max(model.ma.ma10, minMaxArray[1])
        minMaxArray[1] = Math.max(model.ma.ma20, minMaxArray[1])
        minMaxArray[1] = Math.max(model.ma.ma60, minMaxArray[1])
        break
      }
      case IndicatorType.MACD: {
        minMaxArray[0] = Math.min(model.macd.dea, minMaxArray[0])
        minMaxArray[0] = Math.min(model.macd.diff, minMaxArray[0])
        minMaxArray[0] = Math.min(model.macd.macd, minMaxArray[0])
        minMaxArray[1] = Math.max(model.macd.dea, minMaxArray[1])
        minMaxArray[1] = Math.max(model.macd.diff, minMaxArray[1])
        minMaxArray[1] = Math.max(model.macd.macd, minMaxArray[1])
        break
      }
      case IndicatorType.VOL: {
        minMaxArray[0] = Math.min(model.vol.ma5, 0)
        minMaxArray[0] = Math.min(model.vol.ma10, 0)
        minMaxArray[0] = Math.min(model.vol.ma20, 0)
        minMaxArray[0] = Math.min(model.vol.num, 0)
        minMaxArray[1] = Math.max(model.vol.ma5, minMaxArray[1])
        minMaxArray[1] = Math.max(model.vol.ma10, minMaxArray[1])
        minMaxArray[1] = Math.max(model.vol.ma20, minMaxArray[1])
        minMaxArray[1] = Math.max(model.vol.num, minMaxArray[1])
        break
      }
      case IndicatorType.BOLL: {
        minMaxArray[0] = Math.min(model.boll.up, minMaxArray[0])
        minMaxArray[0] = Math.min(model.boll.mid, minMaxArray[0])
        minMaxArray[0] = Math.min(model.boll.dn, minMaxArray[0])
        minMaxArray[0] = Math.min(model.low, minMaxArray[0])
        minMaxArray[1] = Math.max(model.boll.up, minMaxArray[1])
        minMaxArray[1] = Math.max(model.boll.mid, minMaxArray[1])
        minMaxArray[1] = Math.max(model.boll.dn, minMaxArray[1])
        minMaxArray[1] = Math.max(model.high, minMaxArray[1])
        break
      }
      case IndicatorType.BIAS: {
        minMaxArray[0] = Math.min(model.bias.bias1, minMaxArray[0])
        minMaxArray[0] = Math.min(model.bias.bias2, minMaxArray[0])
        minMaxArray[0] = Math.min(model.bias.bias3, minMaxArray[0])
        minMaxArray[1] = Math.max(model.bias.bias1, minMaxArray[1])
        minMaxArray[1] = Math.max(model.bias.bias2, minMaxArray[1])
        minMaxArray[1] = Math.max(model.bias.bias3, minMaxArray[1])
        break
      }
      case IndicatorType.BRAR: {
        minMaxArray[0] = Math.min(model.brar.br, minMaxArray[0])
        minMaxArray[0] = Math.min(model.brar.ar, minMaxArray[0])
        minMaxArray[1] = Math.max(model.brar.br, minMaxArray[1])
        minMaxArray[1] = Math.max(model.brar.ar, minMaxArray[1])
        break
      }
      case IndicatorType.CCI: {
        minMaxArray[0] = Math.min(model.cci.cci, minMaxArray[0])
        minMaxArray[1] = Math.max(model.cci.cci, minMaxArray[1])
        break
      }
      case IndicatorType.CR: {
        minMaxArray[0] = Math.min(model.cr.cr, minMaxArray[0])
        minMaxArray[0] = Math.min(model.cr.ma1, minMaxArray[0])
        minMaxArray[0] = Math.min(model.cr.ma2, minMaxArray[0])
        minMaxArray[0] = Math.min(model.cr.ma3, minMaxArray[0])
        minMaxArray[0] = Math.min(model.cr.ma4, minMaxArray[0])
        minMaxArray[1] = Math.max(model.cr.cr, minMaxArray[1])
        minMaxArray[1] = Math.max(model.cr.ma1, minMaxArray[1])
        minMaxArray[1] = Math.max(model.cr.ma2, minMaxArray[1])
        minMaxArray[1] = Math.max(model.cr.ma3, minMaxArray[1])
        minMaxArray[1] = Math.max(model.cr.ma4, minMaxArray[1])
        break
      }
      case IndicatorType.DMA: {
        minMaxArray[0] = Math.min(model.dma.dif, minMaxArray[0])
        minMaxArray[0] = Math.min(model.dma.difMa, minMaxArray[0])
        minMaxArray[1] = Math.max(model.dma.dif, minMaxArray[1])
        minMaxArray[1] = Math.max(model.dma.difMa, minMaxArray[1])
        break
      }
      case IndicatorType.DMI: {
        minMaxArray[0] = Math.min(model.dmi.pdi, minMaxArray[0])
        minMaxArray[0] = Math.min(model.dmi.mdi, minMaxArray[0])
        minMaxArray[0] = Math.min(model.dmi.adx, minMaxArray[0])
        minMaxArray[0] = Math.min(model.dmi.adxr, minMaxArray[0])
        minMaxArray[1] = Math.max(model.dmi.pdi, minMaxArray[1])
        minMaxArray[1] = Math.max(model.dmi.mdi, minMaxArray[1])
        minMaxArray[1] = Math.max(model.dmi.adx, minMaxArray[1])
        minMaxArray[1] = Math.max(model.dmi.adxr, minMaxArray[1])
        break
      }
      case IndicatorType.KDJ: {
        minMaxArray[0] = Math.min(model.kdj.k, minMaxArray[0])
        minMaxArray[0] = Math.min(model.kdj.d, minMaxArray[0])
        minMaxArray[0] = Math.min(model.kdj.j, minMaxArray[0])
        minMaxArray[1] = Math.max(model.kdj.k, minMaxArray[1])
        minMaxArray[1] = Math.max(model.kdj.d, minMaxArray[1])
        minMaxArray[1] = Math.max(model.kdj.j, minMaxArray[1])
        break
      }
      case IndicatorType.KD: {
        minMaxArray[0] = Math.min(model.kdj.k, minMaxArray[0])
        minMaxArray[0] = Math.min(model.kdj.d, minMaxArray[0])
        minMaxArray[1] = Math.max(model.kdj.k, minMaxArray[1])
        minMaxArray[1] = Math.max(model.kdj.d, minMaxArray[1])
        break
      }
      case IndicatorType.RSI: {
        minMaxArray[0] = Math.min(model.rsi.rsi1, minMaxArray[0])
        minMaxArray[0] = Math.min(model.rsi.rsi2, minMaxArray[0])
        minMaxArray[0] = Math.min(model.rsi.rsi3, minMaxArray[0])
        minMaxArray[1] = Math.max(model.rsi.rsi1, minMaxArray[1])
        minMaxArray[1] = Math.max(model.rsi.rsi2, minMaxArray[1])
        minMaxArray[1] = Math.max(model.rsi.rsi3, minMaxArray[1])
        break
      }
      case IndicatorType.PSY: {
        minMaxArray[0] = Math.min(model.psy.psy, minMaxArray[0])
        minMaxArray[1] = Math.max(model.psy.psy, minMaxArray[1])
        break
      }
      case IndicatorType.TRIX: {
        minMaxArray[0] = Math.min(model.trix.trix, minMaxArray[0])
        minMaxArray[0] = Math.min(model.trix.maTrix, minMaxArray[0])
        minMaxArray[1] = Math.max(model.trix.trix, minMaxArray[1])
        minMaxArray[1] = Math.max(model.trix.maTrix, minMaxArray[1])
        break
      }
      case IndicatorType.OBV: {
        minMaxArray[0] = Math.min(model.obv.obv, minMaxArray[0])
        minMaxArray[0] = Math.min(model.obv.maObv, minMaxArray[0])
        minMaxArray[1] = Math.max(model.obv.obv, minMaxArray[1])
        minMaxArray[1] = Math.max(model.obv.maObv, minMaxArray[1])
        break
      }
      case IndicatorType.VR: {
        minMaxArray[0] = Math.min(model.vr.vr, minMaxArray[0])
        minMaxArray[0] = Math.min(model.vr.maVr, minMaxArray[0])
        minMaxArray[1] = Math.max(model.vr.vr, minMaxArray[1])
        minMaxArray[1] = Math.max(model.vr.maVr, minMaxArray[1])
        break
      }
      case IndicatorType.WR: {
        minMaxArray[0] = Math.min(model.wr.wr1, minMaxArray[0])
        minMaxArray[0] = Math.min(model.wr.wr2, minMaxArray[0])
        minMaxArray[0] = Math.min(model.wr.wr3, minMaxArray[0])
        minMaxArray[1] = Math.max(model.wr.wr1, minMaxArray[1])
        minMaxArray[1] = Math.max(model.wr.wr2, minMaxArray[1])
        minMaxArray[1] = Math.max(model.wr.wr3, minMaxArray[1])
        break
      }
      case IndicatorType.MTM: {
        minMaxArray[0] = Math.min(model.mtm.mtm, minMaxArray[0])
        minMaxArray[0] = Math.min(model.mtm.mtmMa, minMaxArray[0])
        minMaxArray[1] = Math.max(model.mtm.mtm, minMaxArray[1])
        minMaxArray[1] = Math.max(model.mtm.mtmMa, minMaxArray[1])
        break
      }
      case IndicatorType.EMV: {
        minMaxArray[0] = Math.min(model.emv.emv, minMaxArray[0])
        minMaxArray[0] = Math.min(model.emv.maEmv, minMaxArray[0])
        minMaxArray[1] = Math.max(model.emv.emv, minMaxArray[1])
        minMaxArray[1] = Math.max(model.emv.maEmv, minMaxArray[1])
        break
      }
      case IndicatorType.SAR: {
        minMaxArray[0] = Math.min(model.sar.sar, minMaxArray[0])
        minMaxArray[1] = Math.max(model.sar.sar, minMaxArray[1])
        minMaxArray[0] = Math.min(model.low, minMaxArray[0])
        minMaxArray[1] = Math.max(model.high, minMaxArray[1])
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
