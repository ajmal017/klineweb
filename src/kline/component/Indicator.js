/**
 * 指标类型
 */
export const IndicatorType = {
  /**
   * 没有设置任何指标
   */
  NO: 'NO',

  /**
   * 均线
   */
  MA: 'MA',

  /**
   * 成交量
   */
  VOL: 'VOL',

  /**
   * 指数平滑异同平均线（MACD指标）
   */
  MACD: 'MACD',

  /**
   * 布林指标
   */
  BOLL: 'BOLL',

  /**
   * 随机指标(KDJ)
   */
  KDJ: 'KDJ',

  /**
   * 随机指标(KD)，同KDJ，只输出KD
   */
  KD: 'KD',

  /**
   * 强弱指标
   */
  RSI: 'RSI',

  /**
   * 乖离率（BIAS）是测量股价偏离均线大小程度的指标
   */
  BIAS: 'BIAS',

  /**
   * 情绪指标（BRAR）也称为人气意愿指标
   */
  BRAR: 'BRAR',

  /**
   * 顺势指标
   */
  CCI: 'CCI',

  /**
   * 动向指标
   */
  DMI: 'DMI',

  /**
   * 能量指标
   */
  CR: 'CR',

  /**
   * 心理线（PSY）指标是研究投资者对股市涨跌产生心理波动的情绪指标
   */
  PSY: 'PSY',

  /**
   * 平行线差指标
   */
  DMA: 'DMA',

  /**
   * 三重指数平滑平均线（TRIX）属于长线指标
   */
  TRIX: 'TRIX',

  /**
   * 平衡交易量指标
   */
  OBV: 'OBV',

  /**
   * 成交量变异率
   */
  VR: 'VR',

  /**
   * 威廉超买超卖指标
   */
  WR: 'WR',

  /**
   * 动量指标
   */
  MTM: 'MTM',

  /**
   * 简易波动指标
   */
  EMV: 'EMV',

  /**
   * 停损转向操作点指标
   */
  SAR: 'SAR'
}

class Indicator {
  constructor () {
    /**
     * 线的尺寸
     */
    this.lineSize = 1

    this.increasingColor = '#5DB300'

    this.decreasingColor = '#FF4A4A'

    this.lineColors = ['#898989', '#F5A623', '#F601FF', '#1587DD', '#50A300']
  }
}

export default Indicator
