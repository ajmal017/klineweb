# KLineChart
[![Build Status](https://travis-ci.org/liihuu/klineweb.svg?branch=master)](https://travis-ci.org/liihuu/klineweb)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)  
A klinecharts library for browser. As with [Android KLineChart](https://github.com/liihuu/kline).
## Browser Support
The library is built on canvas, and as long as the browser supports canvas, it is theoretically supported.The same is true of mobile browsers.
## Installing
Using npm:

```bash
$ npm install klinecharts
```

Using yarn:

```bash
$ yarn add klinecharts
```

## API
##### init
```js
var chart= klinecharts.init(document.getElementById('div'))
```
##### config([details](./CONFIG-DETAIL.md))
```js
chart.setCofig(config)
```

##### data
```js
chart.setDataList(dataList)
```
DataList is an array in which objects within an array need to contain open, close, high, low, timestamp, volume and turnover.

##### setting indicator
```js
chart.setMainIndicatorType(indicatorType)
chart.setSubIndicatorType(indicatorType)
```
## Indicator Support
<table>
    <tbody>
        <tr>
            <th>MA</th>
            <th>VOL</th>
            <th>MACD</th>
            <th>BOLL</th>
            <th>KDJ</th>
            <th>KD</th>
            <th>RSI</th>
            <th>BIAS</th>
            <th>BRAR</th>
            <th>CCI</th>
        </tr>
        <tr>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
        </tr>
        <tr>
            <th>DMI</th>
            <th>CR</th>
            <th>PSY</th>
            <th>DMA</th>
            <th>TRIX</th>
            <th>OBV</th>
            <th>VR</th>
            <th>WR</th>
            <th>MTM</th>
            <th>SAR</th>
        </tr>
        <tr>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
            <th>✅</th>
        </tr>
    </tbody>
</table>

## Sample
[https://liihuu.github.io/#/kline](https://liihuu.github.io/#/kline)

## License
Copyright (c) 2019 lihu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
