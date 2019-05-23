import React, { PureComponent } from 'react'
import kline, { ChartStyle, LineStyle, CandleStyle, YAxisPosition, YAxisTextPosition, IndicatorDisplayRule } from './kline/kline'

class App extends PureComponent {
  componentDidMount () {
    let chart = kline.init(document.getElementById('kline'))
    window.onresize = () => {
      chart.resize()
    }
    chart.setConfig({
      common: {
        maxVisibleRange: 500,
        minVisibleRange: 20,
        defaultVisibleRange: 200
      },
      candle: {
        chartType: ChartStyle.CANDLE,
        timeChart: {
          timeLineSize: 1,
          timeLineColor: '#D8D8D8',
          timeLineFillColor: '#f4f4f4',
          timeAverageLineColor: '#F5A623'
        },
        candleChart: {
          candleStyle: CandleStyle.SOLID,
          increasingColor: '#5DB300',
          decreasingColor: '#FF4A4A'
        },
        lowestHighestPriceMarkTextColor: '#898989',
        lowestHighestPriceMarkTextSize: 10,
        lowestHighestValueFormatter: null,
        highestPriceMark: {
          display: true,
          color: '#898989',
          textSize: 10,
          valueFormatter: null
        },
        lowestPriceMark: {
          display: true,
          color: '#898989',
          textSize: 10,
          valueFormatter: null
        },
        lastPriceMark: {
          display: true,
          lineStyle: LineStyle.DASH,
          dashValue: [8, 8],
          lineSize: 1,
          lineColor: '#B9B9B9'
        }
      },
      indicator: {
        lineSize: 1,
        increasingColor: '#5DB300',
        decreasingColor: '#FF4A4A',
        lineColors: ['#898989', '#F5A623', '#F601FF', '#1587DD', '#50A300']
      },
      xAxis: {
        display: true,
        color: '#707070',
        maxHeight: 40,
        minHeight: 20,
        axisLine: {
          display: true,
          color: '#707070',
          size: 1
        },
        tickText: {
          display: true,
          color: '#707070',
          size: 10,
          margin: 3,
          valueFormatter: null
        },
        tickLine: {
          display: true,
          size: 3,
          color: '#707070'
        },
        separatorLine: {
          display: false,
          size: 1,
          color: '#B8B8B8',
          style: LineStyle.DASH,
          dashValue: [8, 8]
        }
      },
      yAxis: {
        display: true,
        position: YAxisPosition.LEFT,
        color: '#707070',
        maxWidth: 40,
        minWidth: 20,
        axisLine: {
          display: true,
          color: '#707070',
          size: 1
        },
        tickText: {
          display: true,
          position: YAxisTextPosition.INSIDE,
          color: '#707070',
          size: 10,
          margin: 3,
          valueFormatter: null
        },
        tickLine: {
          display: true,
          size: 3,
          color: '#707070'
        },
        separatorLine: {
          display: false,
          size: 1,
          color: '#B8B8B8',
          style: LineStyle.DASH,
          dashValue: [8, 8]
        }
      },
      tooltip: {
        textSize: 12,
        crossLine: {
          style: LineStyle.SOLID,
          dashValue: [8, 8],
          size: 1,
          color: '#505050',
          text: {
            color: '#EDEDED',
            size: 10,
            rectStrokeLineSize: 1,
            rectStrokeLineColor: '#EDEDED',
            rectFillColor: '#505050'
          }
        },
        generalData: {
          labels: ['时间', '开', '收', '高', '低'],
          values: null,
          valueFormatter: null,
          text: {
            size: 12,
            color: '#898989',
            margin: 20
          }
        },
        indicatorData: {
          displayRule: IndicatorDisplayRule.ALWAYS,
          valueFormatter: null,
          text: {
            size: 12,
            margin: 20
          }
        }
      }
    })
    chart.setDataList(this.getData())
  }

  getData () {
    let dataList = []
    let timestamp = new Date().getTime() - 12 * 24 * 3600
    let baseValue = Math.random() * 12000
    let prices = []
    for (let i = 0; i < 10000; i++) {
      baseValue = baseValue + Math.random() * 20 - 10
      for (let j = 0; j < 4; j++) {
        prices[j] = (Math.random() - 0.5) * 12 + baseValue
      }
      prices.sort()
      let openIdx = +Math.round(Math.random() * 3).toFixed(0)
      let closeIdx = +Math.round(Math.random() * 2).toFixed(0)
      if (closeIdx === openIdx) {
        closeIdx++
      }
      let volume = Math.random() * 100

      timestamp += 60 * 1000

      let kLineModel = {
        open: prices[openIdx],
        low: prices[0],
        high: prices[3],
        close: prices[closeIdx],
        volume,
        timestamp,
        turnover: prices[closeIdx] * volume
      }
      dataList.push(kLineModel)
    }
    return dataList
  }

  render () {
    return (
      <div id="kline" style={{ height: 500 }}/>
    )
  }
}

export default App
