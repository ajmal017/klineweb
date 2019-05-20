import React, { PureComponent } from 'react'
import KLine from './kline/KLine'

class App extends PureComponent {
  componentDidMount () {
    let kline = new KLine()
    kline.init(document.getElementById('kline'))
  }

  render () {
    return (
      <div id="kline" style={{ height: 500 }}/>
    )
  }
}

export default App
