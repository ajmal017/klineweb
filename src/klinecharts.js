import KLineChart from './chart/KLineChart'

const klinecharts = {
  init (dom) {
    return new KLineChart(dom)
  },
  version () {
    return process.env.K_LINE_CHARTS_VERSION
  }
}
export default klinecharts
