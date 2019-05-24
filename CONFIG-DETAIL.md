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
    // 'candle'|'time_line'
    chartType: 'candle',
    timeChart: {
      timeLineSize: 1,
      timeLineColor: '#D8D8D8',
      timeLineFillColor: '#f4f4f4',
      timeAverageLineColor: '#F5A623'
    },
    candleChart: {
      // 'solid'|'stroke'|'increasing_stroke'|'decreasing_stroke'|'ohlc'
      candleStyle: 'solid',
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
      // 'solid'|'dash'
      lineStyle: 'dash',
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
    // 'left'|'right'
    position: 'left',
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
      // 'inside'|'outside'
      position: 'inside',
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
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [8, 8]
    }
  },
  tooltip: {
    textSize: 12,
    crossLine: {
       // 'solid'|'dash'
      style: 'solid',
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
        // 'always'|'follow_cross'|'none'
        displayRule: 'always',
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
