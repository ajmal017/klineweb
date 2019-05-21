import React, { PureComponent } from 'react'
import KLine from './kline/KLine'

class App extends PureComponent {
  componentDidMount () {
    let kline = new KLine()
    kline.init(document.getElementById('kline'))
    kline.setDataList(this.getData())
  }

  getData () {
    let dataList = []
    let timestamp = new Date().getTime() - 12 * 24 * 3600
    let baseValue = Math.random() * 12000
    let prices = []
    for (let i = 0; i < 1000; i++) {
      baseValue = baseValue + Math.random() * 20 - 10
      for (let j = 0; j < 4; j++) {
        prices[j] = (Math.random() - 0.5) * 12 + baseValue
      }
      prices.sort()
      let openIdx = parseInt(Math.round(Math.random() * 3))
      let closeIdx = parseInt(Math.round(Math.random() * 2))
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
