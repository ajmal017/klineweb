## Configuration Details
```js
config = {
  common: {
    maxVisibleRange: 500,
    minVisibleRange: 20,
    defaultVisibleRange: 200
  },
  grid: {
    display: true,
    lineSize: 1,
    lineColor: '#707070'
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
    },
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
        size: 12,
        rectStrokeLineSize: 1,
        rectStrokeLineColor: '#EDEDED',
        rectFillColor: '#505050',
        margin: 4,
        valueFormatter: null
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
  }
}
```
