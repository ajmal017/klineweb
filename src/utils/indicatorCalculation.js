/**
 * 计算均线数据
 * @param data
 * @returns {*}
 */
export function calculationMa (data) {
  let ma5Num = 0.0
  let ma10Num = 0.0
  let ma20Num = 0.0
  let ma60Num = 0.0

  let ma5
  let ma10
  let ma20
  let ma60

  let totalTurnover = 0.0
  let totalVolume = 0.0

  for (let i = 0; i < data.length; i++) {
    totalVolume += data[i].volume
    totalTurnover += (data[i].turnover || 0)
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let close = data[i].close
    ma5Num += close
    ma10Num += close
    ma20Num += close
    ma60Num += close
    if (i < 5) {
      ma5 = ma5Num / (i + 1)
    } else {
      ma5Num -= data[i - 5].close
      ma5 = ma5Num / 5
    }

    if (i < 10) {
      ma10 = ma10Num / (i + 1)
    } else {
      ma10Num -= data[i - 10].close
      ma10 = ma10Num / 10
    }

    if (i < 20) {
      ma20 = ma20Num / (i + 1)
    } else {
      ma20Num -= data[i - 20].close
      ma20 = ma20Num / 20
    }

    if (i < 60) {
      ma60 = ma60Num / (i + 1)
    } else {
      ma60Num -= data[i - 60].close
      ma60 = ma60Num / 60
    }
    data[i].ma = { ma5, ma10, ma20, ma60 }
  }
  return data
}

/**
 * 计算成交量包含ma5、ma10、ma20
 *
 * @param data
 * @return
 */
export function calculationVol (data) {
  let ma5s = 0
  let ma10s = 0
  let ma20s = 0
  let ma5
  let ma10
  let ma20

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let num = data[i].volume
    ma5s += num
    ma10s += num
    ma20s += num

    if (i < 5) {
      ma5 = ma5s / (i + 1)
    } else {
      ma5s -= data[i - 5].volume
      ma5 = ma5s / 5
    }

    if (i < 10) {
      ma10 = ma10s / (i + 1)
    } else {
      ma10s -= data[i - 10].volume
      ma10 = ma10s / 10
    }

    if (i < 20) {
      ma20 = ma20s / (i + 1)
    } else {
      ma20s -= data[i - 20].volume
      ma20 = ma20s / 20
    }
    data[i].vol = { num, ma5, ma10, ma20 }
  }
  return data
}

/**
 * 计算MACD指标
 *
 * @param data
 * @return
 */
export function calculationMacd (data) {
  // MACD：参数快线移动平均、慢线移动平均、移动平均，
  // 参数值12、26、9。
  // 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
  // ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
  // ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
  // ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0红色，小于0绿色。
  let ema12
  let ema26
  let oldEma12 = 0
  let oldEma26 = 0
  let diff = 0
  let dea = 0
  let oldDea = 0
  let macd = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    if (i > 0) {
      ema12 = (2 * closePrice + 11 * oldEma12) / 13
      ema26 = (2 * closePrice + 25 * oldEma26) / 27
      diff = ema12 - ema26
      dea = (diff * 2 + oldDea * 8) / 10
      macd = (diff - dea) * 2
      oldEma12 = ema12
      oldEma26 = ema26
      oldDea = dea
    }
    data[i].macd = { diff, dea, macd }
  }
  return data
}

/**
 * 计算BOLL指标
 *
 * @param data
 * @return
 */
export function calculationBoll (data) {
  let closes26 = 0// MA
  let closes25 = 0
  let ma// 中轨线
  let mb
  let md// 标准差
  let up// 上轨线
  let dn// 下轨线

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    checkData(data[i])
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    closes26 += closePrice
    closes25 += closePrice
    if (i >= 24) {
      mb = closes25 / 25
      closes25 -= data[i - 24].close
    } else {
      mb = closes25 / (i + 1)
    }
    if (i >= 25) {
      ma = closes26 / 26
      md = getBollMd(data.slice(i - 25, i + 1), ma)
      closes26 -= data[i - 25].close
    } else {
      ma = closes26 / (i + 1)
      md = getBollMd(data.slice(0, i + 1), ma)
    }
    up = mb + 2 * md
    dn = mb - 2 * md
    data[i].boll = { up, mid: ma, dn }
  }
  return data
}

/**
 * 计算KDJ
 *
 * @param data
 * @return
 */
export function calculationKdj (data) {
  let k
  let d
  let j

  // n日内最低价
  let ln
  // n日内最高价
  let hn

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    // n日收盘价
    let cn = data[i].close

    if (i < 8) {
      ln = getLow(data.slice(0, i + 1))
      hn = getHigh(data.slice(0, i + 1))
    } else {
      ln = getLow(data.slice(i - 8, i + 1))
      hn = getHigh(data.slice(i - 8, i + 1))
    }
    let rsv = (cn - ln) / (hn - ln === 0 ? 1 : hn - ln) * 100
    // 当日K值=2/3×前一日K值+1/3×当日RSV
    // 当日D值=2/3×前一日D值+1/3×当日K值
    // 若无前一日K 值与D值，则可分别用50来代替。
    // J值=3*当日K值-2*当日D值
    k = 2.0 / 3.0 * (i < 8 ? 50.0 : data[i - 1].kdj.k) + 1.0 / 3.0 * rsv
    d = 2.0 / 3.0 * (i < 8 ? 50.0 : data[i - 1].kdj.d) + 1.0 / 3.0 * k
    j = 3.0 * k - 2.0 * d
    data[i].kdj = { k, d, j }
  }
  return data
}

/**
 * 计算RSI
 *
 * @param data
 * @return
 */
export function calculationRsi (data) {
  // N日RSI =
  // N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
  let rsi1 = 0// 参数6
  let rsi2 = 0// 参数12
  let rsi3 = 0// 参数24

  let sumCloseA = 0
  let sumCloseB = 0

  let a1
  let b1
  let oldA1 = 0
  let oldB1 = 0

  let a2
  let b2
  let oldA2 = 0
  let oldB2 = 0

  let a3
  let b3
  let oldA3 = 0
  let oldB3 = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i > 0) {
      let tmp = data[i].close - data[i - 1].close
      if (tmp > 0) {
        sumCloseA += tmp
      } else {
        sumCloseB += tmp
      }
      let AA = tmp > 0 ? tmp : 0
      let BB = Math.abs(tmp)

      if (i < 6) {
        a1 = sumCloseA / (i + 1)
        b1 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1)
      } else {
        a1 = (AA + 5 * oldA1) / 6
        b1 = (BB + 5 * oldB1) / 6
      }
      oldA1 = a1
      oldB1 = b1
      rsi1 = a1 / b1 * 100

      if (i < 12) {
        a2 = sumCloseA / (i + 1)
        b2 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1)
      } else {
        a2 = (AA + 11 * oldA2) / 12
        b2 = (BB + 11 * oldB2) / 12
      }
      oldA2 = a2
      oldB2 = b2
      rsi2 = a2 / b2 * 100

      if (i < 24) {
        a3 = sumCloseA / (i + 1)
        b3 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1)
      } else {
        a3 = (AA + 23 * oldA3) / 24
        b3 = (BB + 23 * oldB3) / 24
      }
      oldA3 = a3
      oldB3 = b3
      rsi3 = a3 / b3 * 100
    }
    data[i].rsi = { rsi1, rsi2, rsi3 }
  }
  return data
}

/**
 * 计算BIAS指标
 *
 * @param data
 * @return
 */
export function calculationBias (data) {
  // 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
  // 参数：6，12、24
  let bias1
  let bias2
  let bias3
  let closes1 = 0
  let closes2 = 0
  let closes3 = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    closes1 += closePrice
    closes2 += closePrice
    closes3 += closePrice

    if (i < 6) {
      let mean6 = closes1 / (i + 1)
      bias1 = ((closePrice - mean6) / mean6) * 100
    } else {
      closes1 -= data[i - 6].close
      let mean6 = closes1 / 6
      bias1 = ((closePrice - mean6) / mean6) * 100
    }

    if (i < 12) {
      let mean12 = closes2 / (i + 1)
      bias2 = ((closePrice - mean12) / mean12) * 100
    } else {
      closes2 -= data[i - 12].close
      let mean12 = closes2 / 12
      bias2 = ((closePrice - mean12) / mean12) * 100
    }

    if (i < 24) {
      let mean24 = closes3 / (i + 1)
      bias3 = ((closePrice - mean24) / mean24) * 100
    } else {
      closes3 -= data[i - 24].close
      let mean24 = closes3 / 24
      bias3 = ((closePrice - mean24) / mean24) * 100
    }

    data[i].bias = { bias1, bias2, bias3 }
  }
  return data
}

/**
 * 计算BRAR指标
 *
 * @param data
 * @return
 */
export function calculationBrar (data) {
  // 参数是26。
  // 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
  // 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
  // N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
  // 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
  let br = 0
  let ar = 0
  let hcy = 0
  let cyl = 0
  let ho = 0
  let ol = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let highestPrice = data[i].high
    let lowestPrice = data[i].low
    let openPrice = data[i].open

    ho += (highestPrice - openPrice)
    ol += (openPrice - lowestPrice)

    if (i > 25) {
      ho -= (data[i - 26].high - data[i - 26].open)
      ol -= (data[i - 26].open - data[i - 26].low)
    }

    if (ol !== 0) {
      ar = ho / ol * 100
    }

    if (i > 0) {
      let preClosePrice = data[i - 1].close
      let highSubPreClose = highestPrice - preClosePrice
      if (highSubPreClose < 0) {
        highSubPreClose = 0
      }
      hcy += highSubPreClose
      let preCloseSubLow = preClosePrice - lowestPrice
      if (preCloseSubLow < 0) {
        preCloseSubLow = 0
      }
      cyl += preCloseSubLow
      if (cyl !== 0) {
        br = hcy / cyl * 100
      }
    }
    data[i].brar = { br, ar }
  }
  return data
}

/**
 * 计算CCI指标
 *
 * @param data
 * @return
 */
export function calculationCci (data) {
  // 中价与 中价的N日内移动平均 的差 除以 N日内中价的平均绝对偏差
  // 其中，中价等于最高价、最低价和收盘价之和除以3
  // ={【79-（79+62+45+90+25）/5）】
  // +【62-（79+62+45+90+25）/5）】
  // +【45-（79+62+45+90+25）/5）】
  // +【90-（79+62+45+90+25）/5）】
  // +【25-（79+62+45+90+25）/5）】}/5
  let TYPEs = 0
  let cci

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let TYP = (data[i].high + data[i].low + data[i].close) / 3
    TYPEs += TYP
    if (i >= 13) {
      let TYPEsMean = TYPEs / 14
      TYPEs -= (data[i - 13].high + data[i - 13].low + data[i - 13].close) / 3

      let types = 0
      for (let j = i - 13; j < i + 1; j++) {
        let typ = (data[j].high + data[j].low + data[j].close) / 3
        types += Math.abs(typ - TYPEsMean)
      }
      let MD = types / 14
      if (MD === 0) {
        cci = 0
      } else {
        cci = 200 * (TYP - TYPEsMean) / 3 / MD
      }
    } else {
      let TYPEsMean = TYPEs / (i + 1)
      let types = 0
      for (let j = 0; j < i + 1; j++) {
        let typ = (data[j].high + data[j].low + data[j].close) / 3
        types += Math.abs(typ - TYPEsMean)
      }
      let MD = types / (i + 1)
      if (MD === 0) {
        cci = 0
      } else {
        cci = 200 * (TYP - TYPEsMean) / 3 / MD
      }
    }
    data[i].cci = { cci }
  }
  return data
}

/**
 * 计算DMI
 *
 * @param data
 * @return
 */
export function calculationDmi (data) {
  // 参数 14，6
  // MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
  // HD :=HIGH-REF(HIGH,1);
  // LD :=REF(LOW,1)-LOW;
  // DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
  // DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
  //
  // PDI: DMP*100/MTR;
  // MDI: DMM*100/MTR;
  // ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
  // ADXR:EXPMEMA(ADX,MM);
  // 公式含义：
  // MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
  // HD赋值:最高价-昨日最高价
  // LD赋值:昨日最低价-最低价
  // DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
  // DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
  // 输出PDI:DMP*100/MTR
  // 输出MDI:DMM*100/MTR
  // 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
  // 输出ADXR:ADX的MM日指数平滑移动平均
  let pdi = 0
  let mdi = 0
  let adx = 0
  let adxr = 0

  let HD
  let LD
  let refClose
  let sumMax = []
  let sumMaxDmp = []
  let sumMaxDmm = []
  let sumAdx = []
  let sumAdxr = []

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i > 0) {
      refClose = data[i - 1].close
      HD = data[i].high - data[i - 1].high
      LD = data[i - 1].low - data[i].low

      let max1 = data[i].high - data[i].low > Math.abs(data[i].high - refClose)
        ? data[i].high - data[i].low
        : Math.abs(data[i].high - refClose)
      let max2 = max1 > Math.abs(refClose) - data[i].low
        ? max1
        : Math.abs(refClose) - data[i].low
      sumMax.push(max2)

      let H
      if (HD > 0 && HD > LD) {
        H = HD
      } else {
        H = 0
      }
      sumMaxDmp.push(H)

      let L
      if (LD > 0 && LD > HD) {
        L = LD
      } else {
        L = 0
      }
      sumMaxDmm.push(L)

      let sumMax1 = 0
      let sumMaxDmp1 = 0
      let sumMaxDmm1 = 0
      for (let j = 0; j < sumMax.length; j++) {
        sumMax1 += sumMax[j]
        sumMaxDmp1 += sumMaxDmp[j]
        sumMaxDmm1 += sumMaxDmm[j]
      }
      let mtr = sumMax1
      let dmp = sumMaxDmp1
      let dmm = sumMaxDmm1

      pdi = dmp * 100 / mtr
      mdi = dmm * 100 / mtr
      let adxN1 = Math.abs((mdi - pdi)) / (mdi + pdi) * 100
      sumAdx.push(adxN1)

      let sum = 0
      for (let j = 0; j < sumAdx.length; j++) {
        sum += sumAdx[j]
      }
      adx = sum / 6
      sumAdxr.push(adx)

      let sum1 = 0
      sum1 += sumAdxr[0]
      sum1 += sumAdxr[sumAdxr.length - 1]
      adxr = sum1 / 2

      if (i >= 14) {
        sumMax.splice(0, 1)
        sumMaxDmp.splice(0, 1)
        sumMaxDmm.splice(0, 1)
      }
      if (i >= 19) {
        sumAdx.splice(0, 1)
      }
      if (i >= 25) {
        sumAdxr.splice(0, 1)
      }
    }
    data[i].dmi = { pdi, mdi, adx, adxr }
  }
  return data
}

/**
 * 计算CR
 *
 * @param data
 * @return
 */
export function calculationCr (data) {
  // 参数26、10、20、40、60
  // MID:=REF(HIGH+LOW,1)/2;
  // CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
  // MA1:REF(MA(CR,M1),M1/2.5+1);
  // MA2:REF(MA(CR,M2),M2/2.5+1);
  // MA3:REF(MA(CR,M3),M3/2.5+1);
  // MA4:REF(MA(CR,M4),M4/2.5+1);
  // MID赋值:(昨日最高价+昨日最低价)/2
  // 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
  // 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
  // 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
  // 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
  // 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
  let cr = 0
  let ma1
  let ma2
  let ma3
  let ma4
  let p1 = 0
  let p2 = 0
  let ma10Sum = 0
  let ma10
  let ma10List = []
  let ma20Sum = 0
  let ma20
  let ma20List = []
  let ma40Sum = 0
  let ma40
  let ma40List = []
  let ma60Sum = 0
  let ma60
  let ma60List = []

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i > 0) {
      let preHighestPrice = data[i - 1].high
      let preLowestPrice = data[i - 1].low
      let preClosePrice = data[i - 1].close
      let preOpenPrice = data[i - 1].open
      let preMidPrice = (preHighestPrice + preClosePrice + preLowestPrice + preOpenPrice) / 4

      let highestPrice = data[i].high
      let lowestPrice = data[i].low

      let highSubPreMid = highestPrice - preMidPrice
      if (highSubPreMid < 0) {
        highSubPreMid = 0
      }
      p1 += highSubPreMid

      let preMidSubLow = preMidPrice - lowestPrice
      if (preMidSubLow < 0) {
        preMidSubLow = 0
      }
      p2 += preMidSubLow

      if (i > 26) {
        let firstHighestPrice = data[i - 27].high
        let firstLowestPrice = data[i - 27].low
        let firstClosePrice = data[i - 27].close
        let firstOpenPrice = data[i - 27].open
        let firstMidPrice = (firstHighestPrice + firstLowestPrice + firstClosePrice + firstOpenPrice) / 4

        let secondHighestPrice = data[i - 26].high
        let secondLowestPrice = data[i - 26].low

        let secondHighSubFirstMid = secondHighestPrice - firstMidPrice
        if (secondHighSubFirstMid < 0) {
          secondHighSubFirstMid = 0
        }

        let firstMidSubSecondLow = firstMidPrice - secondLowestPrice
        if (firstMidSubSecondLow < 0) {
          firstMidSubSecondLow = 0
        }
        p1 -= secondHighSubFirstMid
        p2 -= firstMidSubSecondLow
      }

      if (p2 !== 0) {
        cr = p1 / p2 * 100
      }

      let YM = (data[i - 1].high + data[i - 1].low + data[i - 1].close) / 3
      let HYM = data[i].high - YM
      p1 += (HYM <= 0 ? 0 : HYM)
      let LYM = YM - data[i].low
      p2 += (LYM <= 0 ? 0 : LYM)
    }
    ma10Sum += cr
    ma20Sum += cr
    ma40Sum += cr
    ma60Sum += cr

    if (i < 10) {
      ma10 = ma10Sum / (i + 1)
    } else {
      ma10Sum -= data[i - 10].cr.cr
      ma10 = ma10Sum / 10
    }
    ma10List.push(ma10)

    if (i < 20) {
      ma20 = ma20Sum / (i + 1)
    } else {
      ma20Sum -= data[i - 20].cr.cr
      ma20 = ma20Sum / 20
    }
    ma20List.push(ma20)

    if (i < 40) {
      ma40 = ma40Sum / (i + 1)
    } else {
      ma40Sum -= data[i - 40].cr.cr
      ma40 = ma40Sum / 40
    }
    ma40List.push(ma40)

    if (i < 60) {
      ma60 = ma60Sum / (i + 1)
    } else {
      ma60Sum -= data[i - 60].cr.cr
      ma60 = ma60Sum / 60
    }
    ma60List.push(ma60)

    if (i < 5) {
      ma1 = ma10List[0]
    } else {
      ma1 = ma10List[i - 5]
    }

    if (i < 9) {
      ma2 = ma20List[0]
    } else {
      ma2 = ma20List[i - 9]
    }

    if (i < 17) {
      ma3 = ma40List[0]
    } else {
      ma3 = ma40List[i - 17]
    }

    if (i < 25) {
      ma4 = ma60List[0]
    } else {
      ma4 = ma60List[i - 25]
    }
    data[i].cr = { cr, ma1, ma2, ma3, ma4 }
  }
  return data
}

/**
 * 计算PSY
 *
 * @param data
 * @return
 */
export function calculationPsy (data) {
  // PSY：参数是12。公式：PSY=N日内的上涨天数/N×100%。
  let psy = 0
  let upDay = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i > 0) {
      upDay += (data[i].close - data[i - 1].close > 0 ? 1 : 0)
      if (i >= 12) {
        psy = upDay / 12 * 100
        upDay -= (data[i - 11].close - data[i - 12].close > 0 ? 1 : 0)
      } else {
        psy = upDay / i * 100
      }
    }
    data[i].psy = { psy }
  }
  return data
}

/**
 * 计算DMA
 *
 * @param data
 * @return
 */
export function calculationDma (data) {
  // 参数是10、50、10。公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
  let dif
  let difMa
  let ma10s = 0
  let ma10
  let ma50s = 0
  let ma50
  let dif10s = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close

    ma10s += closePrice
    ma50s += closePrice

    if (i < 10) {
      ma10 = ma10s / (i + 1)
    } else {
      ma10s -= data[i - 10].close
      ma10 = ma10s / 10
    }

    if (i < 50) {
      ma50 = ma50s / (i + 1)
    } else {
      ma50s -= data[i - 50].close
      ma50 = ma50s / 50
    }
    dif = ma10 - ma50
    dif10s += dif

    if (i < 10) {
      difMa = dif10s / (i + 1)
    } else {
      dif10s -= data[i - 10].dma.dif
      difMa = dif10s / 10
    }

    data[i].dma = { dif, difMa }
  }
  return data
}

/**
 * 计算TRIX
 *
 * @param data
 * @return
 */
export function calculationTrix (data) {
  // TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
  // TRIX=(TR-昨日TR)/昨日TR*100；
  // MATRIX=TRIX的M日简单移动平均；
  // 参数N设为12，参数M设为20；
  // 参数12、20
  // 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
  // TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
  // TRMA:MA(TRIX,M)
  let trix = 0
  let maTrix
  let sumTrix = 0

  let sumClose = 0
  let emaClose
  let oldEmaClose = 0
  let sumEmaClose = 0
  let ema2
  let oldEma2 = 0
  let sumEma2 = 0
  let ema3
  let oldEma3 = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    sumClose += closePrice
    if (i < 12) {
      emaClose = sumClose / (i + 1)
    } else {
      emaClose = (closePrice * 2 + oldEmaClose * 11) / 13
    }
    oldEmaClose = emaClose
    sumEmaClose += emaClose

    if (i < 12) {
      ema2 = sumEmaClose / (i + 1)
    } else {
      ema2 = (emaClose * 2 + oldEma2 * 11) / 13
    }
    oldEma2 = ema2
    sumEma2 += ema2
    if (i < 12) {
      ema3 = sumEma2 / (i + 1)
    } else {
      ema3 = (ema2 * 2 + oldEma3 * 11) / 13
    }
    if (oldEma3 !== 0) {
      trix = (ema3 - oldEma3) / oldEma3 * 100
    }
    sumTrix += trix
    oldEma3 = ema3
    if (i < 20) {
      maTrix = sumTrix / (i + 1)
    } else {
      maTrix = sumTrix / 20
      sumTrix -= data[i - 19].trix.trix
    }
    data[i].trix = { trix, maTrix }
  }
  return data
}

/**
 * 计算obv指标
 * 计算公式： V × [（C - L）- （H - C）]/（H - C）
 * V: 成交量, C: 收盘价， L: 最低价, H: 最高价
 * @param data
 * @return
 */
export function calculationObv (data) {
  let sumObv = 0
  let maObv

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    let highestPrice = data[i].high
    let highSubClose = highestPrice - closePrice
    let obv = data[i].volume * (closePrice - data[i].low - highSubClose) / highestPrice
    sumObv += obv
    if (i < 30) {
      maObv = sumObv / (i + 1)
    } else {
      sumObv = sumObv - data[i - 30].obv.obv
      maObv = sumObv / 30
    }
    data[i].obv = { obv, maObv }
  }
  return data
}

/**
 * 计算vr指标
 * 默认参数24 ， 30
 * VR=（AVS+1/2CVS）/（BVS+1/2CVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为AVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为BVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为CVS
 * @param data
 * @return
 */
export function calculationVr (data) {
  let avs = 0
  let bvs = 0
  let cvs = 0
  let vr = 0
  let maVr
  let sumVr = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i < 24) {
      let closePrice = data[i].close
      let openPrice = data[i].open
      let volume = data[i].volume
      if (closePrice > openPrice) {
        avs += volume
      } else if (closePrice < openPrice) {
        bvs += volume
      } else {
        cvs += volume
      }
    } else {
      for (let j = i - 24; j < i; j++) {
        let closePrice = data[j].close
        let openPrice = data[j].open
        let volume = data[j].volume
        if (j === i - 24) {
          avs = 0
          bvs = 0
          cvs = 0
        }
        if (closePrice > openPrice) {
          avs += volume
        } else if (closePrice < openPrice) {
          bvs += volume
        } else {
          cvs += volume
        }
      }
    }
    let v = bvs + 1 / 2 * cvs
    if (v !== 0) {
      vr = (avs + 1 / 2 * cvs) / v * 100
    }
    sumVr += vr
    if (i < 30) {
      maVr = sumVr / (i + 1)
    } else {
      sumVr -= data[i - 30].vr.vr
      maVr = sumVr / 30
    }
    data[i].vr = { vr, maVr }
  }
  return data
}

/**
 * 计算wr指标
 * 默认参数13 34 89
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 * @param data
 * @return
 */
export function calculationWr (data) {
  let wr1 = 0
  let wr2 = 0
  let wr3 = 0
  let wr1HighestPrice = Number.MIN_VALUE
  let wr1LowestPrice = Number.MAX_VALUE
  let wr2HighestPrice = Number.MIN_VALUE
  let wr2LowestPrice = Number.MAX_VALUE
  let wr3HighestPrice = Number.MIN_VALUE
  let wr3LowestPrice = Number.MAX_VALUE

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    if (i < 13) {
      let highPrice = data[i].high
      let lowPrice = data[i].low
      wr1HighestPrice = Math.max(highPrice, wr1HighestPrice)
      wr1LowestPrice = Math.min(lowPrice, wr1LowestPrice)
      wr2HighestPrice = Math.max(highPrice, wr2HighestPrice)
      wr2LowestPrice = Math.min(lowPrice, wr2LowestPrice)
      wr3HighestPrice = Math.max(highPrice, wr3HighestPrice)
      wr3LowestPrice = Math.min(lowPrice, wr3LowestPrice)
      let highSubLow = wr1HighestPrice - wr1LowestPrice
      if (highSubLow !== 0) {
        wr1 = (wr1HighestPrice - closePrice) / highSubLow * 100
      }
      wr2 = wr1
      wr3 = wr1
    } else {
      for (let j = i - 13; j < i; j++) {
        if (j === i - 13) {
          wr1HighestPrice = data[j].high
          wr1LowestPrice = data[j].low
        } else {
          wr1HighestPrice = Math.max(data[j].high, wr1HighestPrice)
          wr1LowestPrice = Math.min(data[j].low, wr1LowestPrice)
        }
        let highSubLow = wr1HighestPrice - wr1LowestPrice
        if (highSubLow !== 0) {
          wr1 = (wr1HighestPrice - closePrice) / highSubLow * 100
        }
      }
      if (i < 34) {
        let highPrice = data[i].high
        let lowPrice = data[i].low
        wr2HighestPrice = Math.max(highPrice, wr2HighestPrice)
        wr2LowestPrice = Math.min(lowPrice, wr2LowestPrice)
        wr3HighestPrice = Math.max(highPrice, wr3HighestPrice)
        wr3LowestPrice = Math.min(lowPrice, wr3LowestPrice)
        let highSubLow = wr2HighestPrice - wr2LowestPrice
        if (highSubLow !== 0) {
          wr2 = (wr2HighestPrice - closePrice) / highSubLow * 100
        }
        wr3 = wr2
      } else {
        for (let j = i - 34; j < i; j++) {
          if (j === i - 34) {
            wr2HighestPrice = data[j].high
            wr2LowestPrice = data[j].low
          } else {
            wr2HighestPrice = Math.max(data[j].high, wr2HighestPrice)
            wr2LowestPrice = Math.min(data[j].low, wr2LowestPrice)
          }
          let highSubLow = wr2HighestPrice - wr2LowestPrice
          if (highSubLow !== 0) {
            wr2 = (wr2HighestPrice - closePrice) / highSubLow * 100
          }
        }
        if (i < 89) {
          let highPrice = data[i].high
          let lowPrice = data[i].low
          wr3HighestPrice = Math.max(highPrice, wr3HighestPrice)
          wr3LowestPrice = Math.min(lowPrice, wr3LowestPrice)
          let highSubLow = wr3HighestPrice - wr3LowestPrice
          if (highSubLow !== 0) {
            wr3 = (wr3HighestPrice - closePrice) / highSubLow * 100
          }
        } else {
          for (let j = i - 89; j < i; j++) {
            if (j === i - 89) {
              wr3HighestPrice = data[j].high
              wr3LowestPrice = data[j].low
            } else {
              wr3HighestPrice = Math.max(data[j].high, wr3HighestPrice)
              wr3LowestPrice = Math.min(data[j].low, wr3LowestPrice)
            }
            let highSubLow = wr3HighestPrice - wr3LowestPrice
            if (highSubLow !== 0) {
              wr3 = (wr3HighestPrice - closePrice) / highSubLow * 100
            }
          }
        }
      }
    }
    data[i].wr = { wr1, wr2, wr3 }
  }
  return data
}

/**
 * 计算mtm指标
 * 默认参数6 10
 * 公式 MTM（N日）=C－CN
 * @param data
 * @return
 */
export function calculationMtm (data) {
  let mtm
  let mtmSum = 0
  let mtmMa

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    let closePrice = data[i].close
    if (i < 6) {
      mtm = closePrice - data[0].close
    } else {
      mtm = closePrice - data[i - 6].close
    }
    mtmSum += mtm
    if (i < 10) {
      mtmMa = mtmSum / (i + 1)
    } else {
      mtmSum -= data[i - 10].mtm.mtm
      mtmMa = mtmSum / 10
    }
    data[i].mtm = { mtm, mtmMa }
  }
  return data
}

/**
 * 简易波动指标
 * 默认参数N为14，参数M为9
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 * @param data
 * @return
 */
export function calculationEmv (data) {
  let emv = 0
  let maEmv
  let sumEmv = 0
  let em = 0

  let emList = []

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    if (i > 0) {
      let highestPrice = data[i].high
      let lowestPrice = data[i].low
      let preHighestPrice = data[i - 1].high
      let preLowestPrice = data[i - 1].low
      let highSubLow = highestPrice - lowestPrice
      let halfHighAddLow = (highestPrice + lowestPrice) / 2
      let preHalfHighAddLow = (preHighestPrice + preLowestPrice) / 2
      em = (halfHighAddLow - preHalfHighAddLow) * highSubLow / turnover
    }
    emList.push(em)
    if (i < 14) {
      emv += em
    } else {
      emv -= emList[i - 14]
    }
    sumEmv += emv
    if (i < 9) {
      maEmv = sumEmv / (i + 1)
    } else {
      sumEmv -= data[i - 9].emv.emv
      maEmv = sumEmv / 9
    }
    data[i].emv = { emv, maEmv }
  }
  return data
}

/**
 * 计算sar
 * @param data
 * @return
 */
export function calculationSar (data) {
  // 加速因子
  let af = 0
  // 极值
  let ep = -100
  // 判断是上涨还是下跌  false：下跌
  let isIncreasing = false
  let sar = 0

  let totalTurnover = 0
  let totalVolume = 0

  for (let i = 0; i < data.length; i++) {
    let turnover = data[i].turnover
    totalVolume += data[i].volume
    totalTurnover += turnover
    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume
    }

    // 上一个周期的sar
    let preSar = sar
    let highestPrice = data[i].high
    let lowestPrice = data[i].low
    if (isIncreasing) {
      // 上涨
      if (ep === -100 || ep < highestPrice) {
        // 重新初始化值
        ep = highestPrice
        af = Math.min(af + 0.02, 2)
      }
      sar = preSar + af * (ep - preSar)
      let lowestPriceMin = Math.min(data[Math.max(1, i) - 1].low, lowestPrice)
      if (sar > data[i].low) {
        sar = ep
        // 重新初始化值
        af = 0
        ep = -100
        isIncreasing = !isIncreasing
      } else if (sar > lowestPriceMin) {
        sar = lowestPriceMin
      }
    } else {
      if (ep === -100 || ep > lowestPrice) {
        // 重新初始化值
        ep = lowestPrice
        af = Math.min(af + 0.02, 0.2)
      }
      sar = preSar + af * (ep - preSar)
      let highestPriceMax = Math.max(data[Math.max(1, i) - 1].high, highestPrice)
      if (sar < data[i].high) {
        sar = ep
        // 重新初始化值
        af = 0
        ep = -100
        isIncreasing = !isIncreasing
      } else if (sar < highestPriceMax) {
        sar = highestPriceMax
      }
    }
    data[i].sar = { sar }
  }
  return data
}

/**
 * 计算布林指标中的标准差
 *
 * @param list
 * @param ma
 * @return
 */
function getBollMd (list, ma) {
  let sum = 0
  for (let i = 0; i < list.length; i++) {
    let closeMa = list[i].close - ma
    sum += closeMa * closeMa
  }
  let b = sum > 0
  sum = Math.abs(sum)
  let md = Math.sqrt(sum / list.length)
  return b ? md : -1 * md
}

/**
 * 获取list中的最大的最高价
 *
 * @param list
 * @return
 */
function getHigh (list) {
  let high = 0
  if (list && list.length > 0) {
    let size = list.length
    high = list[0].high
    for (let i = 1; i < size; i++) {
      high = Math.max(list[i].high, high)
    }
  }
  return high
}

/**
 * 获取list中的最小的最低价
 *
 * @param list
 * @return
 */
function getLow (list) {
  let low = 0
  if (list && list.length > 0) {
    let size = list.length
    low = list[0].low
    for (let i = 1; i < size; i++) {
      low = Math.min(list[i].low, low)
    }
  }
  return low
}
