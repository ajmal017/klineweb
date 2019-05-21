const Type = {
  /**
   * 线的风格
   */
  LineStyle: {
    /**
     * 虚线
     */
    DASH: 'dash',

    /**
     * 实线
     */
    SOLID: 'solid'
  },

  /**
   * y轴位置
   */
  YAxisPosition: {
    /**
     * 左边
     */
    LEFT: 'left',
    /**
     * 右边
     */
    RIGHT: 'right'
  },

  /**
   * y轴上文字位置
   */
  YAxisTextPosition: {
    /**
     * 外部
     */
    OUTSIDE: 'outside',
    /**
     * 内部
     */
    INSIDE: 'inside'
  },

  CandleStyle: {
    /**
     * 全实心
     */
    SOLID: 'solid',

    /**
     * 全空心
     */
    STROKE: 'stroke',

    /**
     * 涨空心
     */
    INCREASING_STROKE: 'increasing_stroke',

    /**
     * 跌空心
     */
    DECREASING_STROKE: 'decreasing_stroke',

    /**
     * 美国线
     */
    OHLC: 'ohlc'
  },

  /**
   * 图表类型
   */
  ChartStyle: {
    /**
     * 蜡烛图
     */
    CANDLE: 'candle',

    /**
     * 分时线
     */
    TIME_LINE: 'time_line'
  },

  /**
   * 指标类型
   */
  IndicatorType: {
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
  },

  /**
   * 指标提示显示规则
   */
  IndicatorDisplayRule: {
    /**
     * 总是显示
     */
    ALWAYS: 'always',

    /**
     * 跟随十字光标显示
     */
    FOLLOW_CROSS: 'follow_cross',

    /**
     * 一直不显示
     */
    NONE: 'none'
  }

}

export default Type
