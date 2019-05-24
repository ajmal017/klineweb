(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/internal/ViewPortHandler.js
class ViewPortHandler{constructor(){// 绘制区域参数
this.contentRect={left:0,right:0,top:0,bottom:0// 整个view的高度
};this.viewHeight=0;// 整个view的宽度
this.viewWidth=0;}/**
   * 设置尺寸
   * @param width
   * @param height
   */setChartDimens(width,height){this.viewWidth=width;this.viewHeight=height;this.restrainViewPort(this.contentLeft(),this.contentTop(),width-this.contentRight(),height-this.contentBottom());}restrainViewPort(offsetLeft,offsetTop,offsetRight,offsetBottom){this.contentRect.left=offsetLeft;this.contentRect.right=this.viewWidth-offsetRight;this.contentRect.top=offsetTop;this.contentRect.bottom=this.viewHeight-offsetBottom;}contentTop(){return this.contentRect.top;}contentLeft(){return this.contentRect.left;}contentRight(){return this.contentRect.right;}contentBottom(){return this.contentRect.bottom;}/**
   * 获取中间点坐标
   */getContentCenter(){let point={};point.x=(this.contentRect.left+this.contentRect.right)/2;point.y=(this.contentRect.top+this.contentRect.bottom)/2;return point;}isInBoundsX(x){return this.isInBoundsLeft(x)&&this.isInBoundsRight(x);}isInBoundsLeft(x){return this.contentRect.left<=x+1;}isInBoundsRight(x){let tx=parseInt(x*100)/100;return this.contentRect.right>=tx-1;}}/* harmony default export */ var internal_ViewPortHandler = (ViewPortHandler);
// CONCATENATED MODULE: ./src/internal/DataBounds.js
class DataBounds{constructor(viewPortHandler){this.viewPortHandler=viewPortHandler;// 数据源
this.dataList=[];// 数据绘制起始位置
this.min=0;// 绘制的数据条数
this.range=120;// 最大绘制条数
this.maxRange=180;// 最小绘制条数
this.minRange=20;// 没条数据的所占的空间
this.dataSpace=0;// 每条数据之间的距离比例
this.dataMarginSpaceRate=0.2;// 当前数据的位置
this.currentDataPos=0;}/**
   * 获取柱状图之间的间隙
   */space(){this.dataSpace=(this.viewPortHandler.contentRight()-this.viewPortHandler.contentLeft())/this.range;}moveToLast(){if(this.dataList.length>this.range){this.min=this.dataList.length-this.range;this.currentDataPos=this.dataList.length-1;}else{this.min=0;}}/**
   * 计算当前数据的索引
   * @param x
   */calcCurrentDataIndex(x){let range=+Math.ceil(x/this.dataSpace).toFixed(0);this.currentDataPos=this.min+range-1;}}/* harmony default export */ var internal_DataBounds = (DataBounds);
// CONCATENATED MODULE: ./src/chart/Chart.js
class Chart{constructor(dataBounds,viewPortHandler){this.dataBounds=dataBounds;this.viewPortHandler=viewPortHandler;this.chartTop=0;this.chartHeight=0;}/**
   * 设置图尺寸
   * @param height
   * @param top
   */setChartDimens(height,top){this.chartHeight=height;this.chartTop=top;}/**
   * 获取y点坐标
   * @param yValue
   * @param yMin
   * @param interval
   * @returns {number}
   */getY(yValue,yMin,interval){return this.chartTop+(1-(yValue-yMin)/interval)*this.chartHeight;}}/* harmony default export */ var chart_Chart = (Chart);
// CONCATENATED MODULE: ./src/chart/GridChart.js
class GridChart_GridChart extends chart_Chart{constructor(grid,dataBounds,viewPortHandler){super(dataBounds,viewPortHandler);this.grid=grid;}draw(canvas){if(!this.grid.display){return;}canvas.strokeStyle=this.grid.lineColor;canvas.lineWidth=this.grid.lineSize;canvas.beginPath();canvas.moveTo(this.viewPortHandler.contentLeft(),this.viewPortHandler.contentTop());canvas.lineTo(this.viewPortHandler.contentRight(),this.viewPortHandler.contentTop());canvas.lineTo(this.viewPortHandler.contentRight(),this.viewPortHandler.contentBottom());canvas.lineTo(this.viewPortHandler.contentLeft(),this.viewPortHandler.contentBottom());canvas.lineTo(this.viewPortHandler.contentLeft(),this.viewPortHandler.contentTop());canvas.stroke();canvas.closePath();}}/* harmony default export */ var chart_GridChart = (GridChart_GridChart);
// CONCATENATED MODULE: ./src/utils/utils.js
const utils={canvas:document.createElement('canvas').getContext('2d'),formatDate(timestamp){let date=new Date(timestamp);let month=(date.getMonth()+1).toString();let day=date.getDate().toString();let hours=date.getHours().toString();let minutes=date.getMinutes().toString();return(month.length===1?'0'+month:month)+'-'+(day.length===1?'0'+day:day)+' '+(hours.length===1?'0'+hours:hours)+':'+(minutes.length===1?'0'+minutes:minutes);},/**
   * 测量文字的宽度
   * @param font
   * @param text
   * @returns {number}
   */calcTextWidth(font,text){this.canvas.font=font;return this.canvas.measureText(text).width;},nice(value){let exponent=Math.floor(Math.log(value)/Math.log(10.0));let exp10=Math.pow(10.0,exponent);let f=value/exp10;// 1 <= f < 10
let nf=0;if(f<1){nf=1;}else if(f<2){nf=2;}else if(f<3){nf=3;}else if(f<5){nf=5;}else{nf=10;}value=nf*exp10;return exponent>=-20?+value.toFixed(exponent<0?-exponent:0):value;},getIntervalPrecision(value){let str=value.toString();// Consider scientific notation: '3.4e-12' '3.4e+12'
let eIndex=str.indexOf('e');if(eIndex>0){let precision=+str.slice(eIndex+1);return precision<0?-precision:0;}else{let dotIndex=str.indexOf('.');return dotIndex<0?0:str.length-1-dotIndex;}},round(x,precision){if(precision==null){precision=10;}// Avoid range error
precision=Math.min(Math.max(0,precision),20);x=(+x).toFixed(precision);return x;}};/* harmony default export */ var utils_utils = (utils);
// CONCATENATED MODULE: ./src/chart/AxisChart.js
class AxisChart_AxisChart extends chart_Chart{constructor(dataBounds,viewPortHandler){super(dataBounds,viewPortHandler);this.values=[];this.valueCount=0;}/**
   * 计算x轴上的值
   * @param min
   * @param max
   */computeAxisValues(min,max){let span=max-min;if(span<0){this.values=[];this.valueCount=0;return;}let interval=+utils_utils.nice(span/5.0);let precision=utils_utils.getIntervalPrecision(interval);let first=+utils_utils.round(Math.ceil(min/interval)*interval,precision);let last=+utils_utils.round(Math.floor(max/interval)*interval,precision);let n=0;let f=first;if(interval!==0){while(f<=+last){++n;f+=interval;}}this.valueCount=n;this.values=[];let i=0;f=first;while(i<n){this.values[i]=f;f+=interval;++i;}}}/* harmony default export */ var chart_AxisChart = (AxisChart_AxisChart);
// CONCATENATED MODULE: ./src/component/Indicator.js
/**
 * 指标类型
 */const IndicatorType={/**
   * 没有设置任何指标
   */NO:'NO',/**
   * 均线
   */MA:'MA',/**
   * 成交量
   */VOL:'VOL',/**
   * 指数平滑异同平均线（MACD指标）
   */MACD:'MACD',/**
   * 布林指标
   */BOLL:'BOLL',/**
   * 随机指标(KDJ)
   */KDJ:'KDJ',/**
   * 随机指标(KD)，同KDJ，只输出KD
   */KD:'KD',/**
   * 强弱指标
   */RSI:'RSI',/**
   * 乖离率（BIAS）是测量股价偏离均线大小程度的指标
   */BIAS:'BIAS',/**
   * 情绪指标（BRAR）也称为人气意愿指标
   */BRAR:'BRAR',/**
   * 顺势指标
   */CCI:'CCI',/**
   * 动向指标
   */DMI:'DMI',/**
   * 能量指标
   */CR:'CR',/**
   * 心理线（PSY）指标是研究投资者对股市涨跌产生心理波动的情绪指标
   */PSY:'PSY',/**
   * 平行线差指标
   */DMA:'DMA',/**
   * 三重指数平滑平均线（TRIX）属于长线指标
   */TRIX:'TRIX',/**
   * 平衡交易量指标
   */OBV:'OBV',/**
   * 成交量变异率
   */VR:'VR',/**
   * 威廉超买超卖指标
   */WR:'WR',/**
   * 动量指标
   */MTM:'MTM',/**
   * 简易波动指标
   */EMV:'EMV',/**
   * 停损转向操作点指标
   */SAR:'SAR'};class Indicator{constructor(){/**
     * 线的尺寸
     */this.lineSize=1;this.increasingColor='#5DB300';this.decreasingColor='#FF4A4A';this.lineColors=['#898989','#F5A623','#F601FF','#1587DD','#50A300'];}}/* harmony default export */ var component_Indicator = (Indicator);
// CONCATENATED MODULE: ./src/component/Component.js
/**
 * 线的风格
 */const LineStyle={/**
   * 虚线
   */DASH:'dash',/**
   * 实线
   */SOLID:'solid'};
// CONCATENATED MODULE: ./src/component/Axis.js
class Axis_Axis{constructor(){/**
     * 是否显示整个轴
     */this.display=true;/**
     * 整个轴的颜色
     */this.color='#707070';/**
     * 轴线配置
     */this.axisLine={display:true,color:'#707070',size:1/**
     * 分割文字配置
     */};this.tickText={display:true,position:YAxisTextPosition.OUTSIDE,color:'#707070',size:12,margin:3,valueFormatter:null/**
     * 分割tick线配置
     */};this.tickLine={display:true,size:3,color:'#707070'/**
     * 分割线配置
     */};this.separatorLine={display:false,size:1,color:'#B8B8B8',style:LineStyle.DASH,dashValue:[8,8]};}}/* harmony default export */ var component_Axis = (Axis_Axis);
// CONCATENATED MODULE: ./src/component/YAxis.js
/**
 * y轴位置
 */const YAxisPosition={/**
   * 左边
   */LEFT:'left',/**
   * 右边
   */RIGHT:'right'/**
 * y轴上文字位置
 */};const YAxisTextPosition={/**
   * 外部
   */OUTSIDE:'outside',/**
   * 内部
   */INSIDE:'inside'};class YAxis_YAxis extends component_Axis{constructor(){super();/**
     * y轴位置
     */this.yAxisPosition=YAxisPosition.RIGHT;/**
     * y轴最大宽度
     */this.yAxisMaxWidth=80;/**
     * y轴最小宽度
     */this.yAxisMinWidth=40;}/**
   * 是否需要留间距绘制y轴
   * @return Boolean
   */needsOffset(){return((this.tickText.display||this.tickLine.display||this.tickText.margin>0)&&this.tickText.position===YAxisTextPosition.OUTSIDE||this.axisLine.display)&&this.display;}/**
   * 获取y轴需要的宽度
   * @return number
   */getRequiredWidthSpace(){let width=0;if(this.tickText.position===YAxisTextPosition.OUTSIDE){width+=utils_utils.calcTextWidth(this.tickText.size*2,'0000000')+this.tickText.margin*2;if(this.display&&this.tickLine.display){width+=this.tickLine.size*2;}}if(this.display&&this.axisLine.display){width+=this.axisLine.size;}if(width===this.axisLine.size){return width;}let maxWidth=width;if(maxWidth>0){maxWidth=this.yAxisMaxWidth*2;width=Math.min(maxWidth,Math.max(width,this.yAxisMinWidth*2));}return width;}}/* harmony default export */ var component_YAxis = (YAxis_YAxis);
// CONCATENATED MODULE: ./src/chart/YAxisChart.js
class YAxisChart_YAxisChart extends chart_AxisChart{constructor(yAxis,dataBounds,viewPortHandler){super(dataBounds,viewPortHandler);this.axisMaximum=0;this.axisMinimum=0;this.axisRange=0;this.yAxis=yAxis;}drawAxisLine(canvas){if(!this.yAxis.display||!this.yAxis.axisLine.display){return;}canvas.strokeStyle=this.yAxis.axisLine.color||this.yAxis.color;canvas.lineWidth=this.yAxis.axisLine.size;canvas.beginPath();if(this.yAxis.yAxisPosition===YAxisPosition.LEFT){canvas.moveTo(this.viewPortHandler.contentLeft(),this.chartTop);canvas.lineTo(this.viewPortHandler.contentLeft(),this.chartTop+this.chartHeight);}else{canvas.moveTo(this.viewPortHandler.contentRight(),this.chartTop);canvas.lineTo(this.viewPortHandler.contentRight(),this.chartTop+this.chartHeight);}canvas.stroke();canvas.closePath();}/**
   * 绘制y轴上文字
   * @param canvas
   */drawAxisLabels(canvas){if(!this.yAxis.display||!this.yAxis.tickText.display){return;}let initX;if(this.yAxis.yAxisPosition===YAxisPosition.LEFT){if(this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE){if(this.yAxis.display&&this.yAxis.tickLine.display){initX=this.viewPortHandler.contentLeft()-this.yAxis.tickLine.size*2-this.yAxis.tickText.margin*2;}else{initX=this.viewPortHandler.contentLeft()-this.yAxis.tickText.margin*2;}}else{if(this.yAxis.display&&this.yAxis.tickLine.display){initX=this.viewPortHandler.contentLeft()+this.yAxis.tickLine.size*2+this.yAxis.tickText.margin*2;}else{initX=this.viewPortHandler.contentLeft()+this.yAxis.tickText.margin*2;}}}else{if(this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE){if(this.yAxis.display&&this.yAxis.tickLine.display){initX=this.viewPortHandler.contentRight()+this.yAxis.tickLine.size*2+this.yAxis.tickText.margin*2;}else{initX=this.viewPortHandler.contentRight()+this.yAxis.tickText.margin*2;}}else{if(this.yAxis.display&&this.yAxis.tickLine.display){initX=this.viewPortHandler.contentRight()-this.yAxis.tickLine.size*2-this.yAxis.tickText.margin*2;}else{initX=this.viewPortHandler.contentRight()-this.yAxis.tickText.margin*2;}}}canvas.font=this.yAxis.tickText.size*2+'px Arial';canvas.fillStyle=this.yAxis.tickText.color||this.yAxis.color;let labelHeight=this.yAxis.tickText.size*2;let halfLabelHeight=labelHeight/2;let formatter=this.yAxis.tickText.valueFormatter;for(let i=0;i<this.values.length;i++){let labelY=this.getValueY(this.values[i]);let label=this.values[i].toString();if(formatter){label=formatter(this.values[i])||'--';}if(this.checkShowLabel(labelY,labelHeight)){if(this.yAxis.yAxisPosition===YAxisPosition.LEFT&&this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE||this.yAxis.yAxisPosition===YAxisPosition.RIGHT&&this.yAxis.tickText.position!==YAxisTextPosition.OUTSIDE){canvas.textAlign='right';}else{canvas.textAlign='left';}let startY=labelY+halfLabelHeight;canvas.fillText(label,initX,startY);}}canvas.textAlign='left';}/**
   * 绘制y轴分割线
   * @param canvas
   */drawSeparatorLines(canvas){if(!this.yAxis.display||!this.yAxis.separatorLine.display){return;}canvas.strokeStyle=this.yAxis.separatorLine.color||this.yAxis.color;canvas.lineWidth=this.yAxis.separatorLine.size;let labelHeight=this.yAxis.tickText.size*2;if(this.xAxis.separatorLine.style===LineStyle.DASH){canvas.setLineDash(this.xAxis.separatorLine.dashValue);}for(let i=0;i<this.values.length;i++){let y=this.getValueY(this.values[i]);if(this.checkShowLabel(y,labelHeight)){canvas.beginPath();canvas.moveTo(this.viewPortHandler.contentLeft(),y);canvas.lineTo(this.viewPortHandler.contentRight(),y);canvas.stroke();canvas.closePath();}}canvas.setLineDash([]);}/**
   * 绘制刻度线
   * @param canvas
   */drawTickLines(canvas){if(!this.yAxis.display||!this.yAxis.tickLine.display){return;}canvas.lineWidth=1;canvas.strokeStyle=this.yAxis.axisLine.color||this.yAxis.color;let labelHeight=this.yAxis.tickText.size*2;let startX;let endX;if(this.yAxis.yAxisPosition===YAxisPosition.LEFT){startX=this.viewPortHandler.contentLeft();if(this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE){endX=startX-this.yAxis.tickLine.size*2;}else{endX=startX+this.yAxis.tickLine.size*2;}}else{startX=this.viewPortHandler.contentRight();if(this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE){endX=startX+this.yAxis.tickLine.size*2;}else{endX=startX-this.yAxis.tickLine.size*2;}}for(let i=0;i<this.values.length;i++){let y=this.getValueY(this.values[i]);if(this.checkShowLabel(y,labelHeight)){canvas.beginPath();canvas.moveTo(startX,y);canvas.lineTo(endX,y);canvas.stroke();canvas.closePath();}}}/**
   * 检查是否需要真正显示label及tick线 分割线
   * @param y
   * @param labelHeight
   */checkShowLabel(y,labelHeight){return y>this.chartTop+labelHeight&&y<this.chartTop+this.chartHeight-labelHeight;}/**
   * 计算y轴数据的最大最小值
   * @param indicatorType
   * @param isMainChart
   * @param isTimeLine
   */getYAxisDataMinMax(indicatorType,isMainChart=false,isTimeLine=false){let dataList=this.dataBounds.dataList;let min=this.dataBounds.min;let max=Math.min(min+this.dataBounds.range,dataList.length);let minMaxArray=[Number.MAX_VALUE,Number.MIN_VALUE];if(isTimeLine){for(let i=min;i<max;i++){let model=dataList[i];minMaxArray[0]=Math.min(model.averagePrice,minMaxArray[0]);minMaxArray[0]=Math.min(model.close,minMaxArray[0]);minMaxArray[1]=Math.max(model.averagePrice,minMaxArray[1]);minMaxArray[1]=Math.max(model.close,minMaxArray[1]);}}else{for(let i=min;i<max;i++){let model=dataList[i];this.calcIndexMinMax(model,indicatorType,minMaxArray);if(isMainChart){minMaxArray[0]=Math.min(model.low,minMaxArray[0]);minMaxArray[1]=Math.max(model.high,minMaxArray[1]);}}}if(minMaxArray[0]!==Number.MAX_VALUE&&minMaxArray[1]!==Number.MIN_VALUE){this.axisMinimum=minMaxArray[0];this.axisMaximum=minMaxArray[1];this.computeAxis();}}/**
   * 计算指标值的最大最小值
   * @param model
   * @param indexType
   * @param minMaxArray
   * @returns {*}
   */calcIndexMinMax(model,indexType,minMaxArray){switch(indexType){case IndicatorType.MA:{minMaxArray[0]=Math.min(model.ma.ma5,minMaxArray[0]);minMaxArray[0]=Math.min(model.ma.ma10,minMaxArray[0]);minMaxArray[0]=Math.min(model.ma.ma20,minMaxArray[0]);minMaxArray[0]=Math.min(model.ma.ma60,minMaxArray[0]);minMaxArray[1]=Math.max(model.ma.ma5,minMaxArray[1]);minMaxArray[1]=Math.max(model.ma.ma10,minMaxArray[1]);minMaxArray[1]=Math.max(model.ma.ma20,minMaxArray[1]);minMaxArray[1]=Math.max(model.ma.ma60,minMaxArray[1]);break;}case IndicatorType.MACD:{minMaxArray[0]=Math.min(model.macd.dea,minMaxArray[0]);minMaxArray[0]=Math.min(model.macd.diff,minMaxArray[0]);minMaxArray[0]=Math.min(model.macd.macd,minMaxArray[0]);minMaxArray[1]=Math.max(model.macd.dea,minMaxArray[1]);minMaxArray[1]=Math.max(model.macd.diff,minMaxArray[1]);minMaxArray[1]=Math.max(model.macd.macd,minMaxArray[1]);break;}case IndicatorType.VOL:{minMaxArray[0]=Math.min(model.vol.ma5,0);minMaxArray[0]=Math.min(model.vol.ma10,0);minMaxArray[0]=Math.min(model.vol.ma20,0);minMaxArray[0]=Math.min(model.vol.num,0);minMaxArray[1]=Math.max(model.vol.ma5,minMaxArray[1]);minMaxArray[1]=Math.max(model.vol.ma10,minMaxArray[1]);minMaxArray[1]=Math.max(model.vol.ma20,minMaxArray[1]);minMaxArray[1]=Math.max(model.vol.num,minMaxArray[1]);break;}case IndicatorType.BOLL:{minMaxArray[0]=Math.min(model.boll.up,minMaxArray[0]);minMaxArray[0]=Math.min(model.boll.mid,minMaxArray[0]);minMaxArray[0]=Math.min(model.boll.dn,minMaxArray[0]);minMaxArray[0]=Math.min(model.low,minMaxArray[0]);minMaxArray[1]=Math.max(model.boll.up,minMaxArray[1]);minMaxArray[1]=Math.max(model.boll.mid,minMaxArray[1]);minMaxArray[1]=Math.max(model.boll.dn,minMaxArray[1]);minMaxArray[1]=Math.max(model.high,minMaxArray[1]);break;}case IndicatorType.BIAS:{minMaxArray[0]=Math.min(model.bias.bias1,minMaxArray[0]);minMaxArray[0]=Math.min(model.bias.bias2,minMaxArray[0]);minMaxArray[0]=Math.min(model.bias.bias3,minMaxArray[0]);minMaxArray[1]=Math.max(model.bias.bias1,minMaxArray[1]);minMaxArray[1]=Math.max(model.bias.bias2,minMaxArray[1]);minMaxArray[1]=Math.max(model.bias.bias3,minMaxArray[1]);break;}case IndicatorType.BRAR:{minMaxArray[0]=Math.min(model.brar.br,minMaxArray[0]);minMaxArray[0]=Math.min(model.brar.ar,minMaxArray[0]);minMaxArray[1]=Math.max(model.brar.br,minMaxArray[1]);minMaxArray[1]=Math.max(model.brar.ar,minMaxArray[1]);break;}case IndicatorType.CCI:{minMaxArray[0]=Math.min(model.cci.cci,minMaxArray[0]);minMaxArray[1]=Math.max(model.cci.cci,minMaxArray[1]);break;}case IndicatorType.CR:{minMaxArray[0]=Math.min(model.cr.cr,minMaxArray[0]);minMaxArray[0]=Math.min(model.cr.ma1,minMaxArray[0]);minMaxArray[0]=Math.min(model.cr.ma2,minMaxArray[0]);minMaxArray[0]=Math.min(model.cr.ma3,minMaxArray[0]);minMaxArray[0]=Math.min(model.cr.ma4,minMaxArray[0]);minMaxArray[1]=Math.max(model.cr.cr,minMaxArray[1]);minMaxArray[1]=Math.max(model.cr.ma1,minMaxArray[1]);minMaxArray[1]=Math.max(model.cr.ma2,minMaxArray[1]);minMaxArray[1]=Math.max(model.cr.ma3,minMaxArray[1]);minMaxArray[1]=Math.max(model.cr.ma4,minMaxArray[1]);break;}case IndicatorType.DMA:{minMaxArray[0]=Math.min(model.dma.dif,minMaxArray[0]);minMaxArray[0]=Math.min(model.dma.difMa,minMaxArray[0]);minMaxArray[1]=Math.max(model.dma.dif,minMaxArray[1]);minMaxArray[1]=Math.max(model.dma.difMa,minMaxArray[1]);break;}case IndicatorType.DMI:{minMaxArray[0]=Math.min(model.dmi.pdi,minMaxArray[0]);minMaxArray[0]=Math.min(model.dmi.mdi,minMaxArray[0]);minMaxArray[0]=Math.min(model.dmi.adx,minMaxArray[0]);minMaxArray[0]=Math.min(model.dmi.adxr,minMaxArray[0]);minMaxArray[1]=Math.max(model.dmi.pdi,minMaxArray[1]);minMaxArray[1]=Math.max(model.dmi.mdi,minMaxArray[1]);minMaxArray[1]=Math.max(model.dmi.adx,minMaxArray[1]);minMaxArray[1]=Math.max(model.dmi.adxr,minMaxArray[1]);break;}case IndicatorType.KDJ:{minMaxArray[0]=Math.min(model.kdj.k,minMaxArray[0]);minMaxArray[0]=Math.min(model.kdj.d,minMaxArray[0]);minMaxArray[0]=Math.min(model.kdj.j,minMaxArray[0]);minMaxArray[1]=Math.max(model.kdj.k,minMaxArray[1]);minMaxArray[1]=Math.max(model.kdj.d,minMaxArray[1]);minMaxArray[1]=Math.max(model.kdj.j,minMaxArray[1]);break;}case IndicatorType.KD:{minMaxArray[0]=Math.min(model.kdj.k,minMaxArray[0]);minMaxArray[0]=Math.min(model.kdj.d,minMaxArray[0]);minMaxArray[1]=Math.max(model.kdj.k,minMaxArray[1]);minMaxArray[1]=Math.max(model.kdj.d,minMaxArray[1]);break;}case IndicatorType.RSI:{minMaxArray[0]=Math.min(model.rsi.rsi1,minMaxArray[0]);minMaxArray[0]=Math.min(model.rsi.rsi2,minMaxArray[0]);minMaxArray[0]=Math.min(model.rsi.rsi3,minMaxArray[0]);minMaxArray[1]=Math.max(model.rsi.rsi1,minMaxArray[1]);minMaxArray[1]=Math.max(model.rsi.rsi2,minMaxArray[1]);minMaxArray[1]=Math.max(model.rsi.rsi3,minMaxArray[1]);break;}case IndicatorType.PSY:{minMaxArray[0]=Math.min(model.psy.psy,minMaxArray[0]);minMaxArray[1]=Math.max(model.psy.psy,minMaxArray[1]);break;}case IndicatorType.TRIX:{minMaxArray[0]=Math.min(model.trix.trix,minMaxArray[0]);minMaxArray[0]=Math.min(model.trix.maTrix,minMaxArray[0]);minMaxArray[1]=Math.max(model.trix.trix,minMaxArray[1]);minMaxArray[1]=Math.max(model.trix.maTrix,minMaxArray[1]);break;}case IndicatorType.OBV:{minMaxArray[0]=Math.min(model.obv.obv,minMaxArray[0]);minMaxArray[0]=Math.min(model.obv.maObv,minMaxArray[0]);minMaxArray[1]=Math.max(model.obv.obv,minMaxArray[1]);minMaxArray[1]=Math.max(model.obv.maObv,minMaxArray[1]);break;}case IndicatorType.VR:{minMaxArray[0]=Math.min(model.vr.vr,minMaxArray[0]);minMaxArray[0]=Math.min(model.vr.maVr,minMaxArray[0]);minMaxArray[1]=Math.max(model.vr.vr,minMaxArray[1]);minMaxArray[1]=Math.max(model.vr.maVr,minMaxArray[1]);break;}case IndicatorType.WR:{minMaxArray[0]=Math.min(model.wr.wr1,minMaxArray[0]);minMaxArray[0]=Math.min(model.wr.wr2,minMaxArray[0]);minMaxArray[0]=Math.min(model.wr.wr3,minMaxArray[0]);minMaxArray[1]=Math.max(model.wr.wr1,minMaxArray[1]);minMaxArray[1]=Math.max(model.wr.wr2,minMaxArray[1]);minMaxArray[1]=Math.max(model.wr.wr3,minMaxArray[1]);break;}case IndicatorType.MTM:{minMaxArray[0]=Math.min(model.mtm.mtm,minMaxArray[0]);minMaxArray[0]=Math.min(model.mtm.mtmMa,minMaxArray[0]);minMaxArray[1]=Math.max(model.mtm.mtm,minMaxArray[1]);minMaxArray[1]=Math.max(model.mtm.mtmMa,minMaxArray[1]);break;}case IndicatorType.EMV:{minMaxArray[0]=Math.min(model.emv.emv,minMaxArray[0]);minMaxArray[0]=Math.min(model.emv.maEmv,minMaxArray[0]);minMaxArray[1]=Math.max(model.emv.emv,minMaxArray[1]);minMaxArray[1]=Math.max(model.emv.maEmv,minMaxArray[1]);break;}case IndicatorType.SAR:{minMaxArray[0]=Math.min(model.sar.sar,minMaxArray[0]);minMaxArray[1]=Math.max(model.sar.sar,minMaxArray[1]);minMaxArray[0]=Math.min(model.low,minMaxArray[0]);minMaxArray[1]=Math.max(model.high,minMaxArray[1]);break;}}return minMaxArray;}computeAxis(){let min=this.axisMinimum;let max=this.axisMaximum;let range=Math.abs(max-min);if(range===0){max+=1;min-=1;range=Math.abs(max-min);}this.axisMinimum=min-range/100*10;this.axisMaximum=max+range/100*20;this.axisRange=Math.abs(this.axisMaximum-this.axisMinimum);this.computeAxisValues(this.axisMinimum,this.axisMaximum);}/**
   * 获取y点坐标
   * @param yValue Float
   * @return number
   */getValueY(yValue){return this.getY(yValue,this.axisMinimum,this.axisRange);}}/* harmony default export */ var chart_YAxisChart = (YAxisChart_YAxisChart);
// CONCATENATED MODULE: ./src/chart/IndicatorChart.js
class IndicatorChart_IndicatorChart extends chart_Chart{constructor(indicator,xAxis,yAxis,dataBounds,viewPortHandler,indicatorType=IndicatorType.MACD){super(dataBounds,viewPortHandler);this.indicator=indicator;this.xAxis=xAxis;this.yAxisChart=new chart_YAxisChart(yAxis,dataBounds,viewPortHandler);this.indicatorType=indicatorType;}setChartDimens(height,top){super.setChartDimens(height,top);this.yAxisChart.setChartDimens(height,top);}draw(canvas){this.drawChartHorizontalSeparatorLine(canvas);this.yAxisChart.getYAxisDataMinMax(this.indicatorType);this.yAxisChart.drawSeparatorLines(canvas);this.yAxisChart.drawTickLines(canvas);this.drawIndicator(canvas);this.yAxisChart.drawAxisLine(canvas);this.yAxisChart.drawAxisLabels(canvas);}/**
   * 绘制各图之间分割线
   * @param canvas
   */drawChartHorizontalSeparatorLine(canvas){canvas.lineWidth=this.xAxis.axisLine.size;canvas.strokeStyle=this.xAxis.axisLine.color;canvas.beginPath();canvas.moveTo(this.viewPortHandler.contentLeft(),this.chartTop);canvas.lineTo(this.viewPortHandler.contentRight(),this.chartTop);canvas.closePath();canvas.stroke();}/**
   * 绘制指标
   * @param canvas
   * @param isMainIndicator
   */drawIndicator(canvas,isMainIndicator=false){switch(this.indicatorType){case IndicatorType.MA:{this.drawLines(canvas,'ma',['ma5','ma10','ma20','ma60']);break;}case IndicatorType.MACD:{this.drawBarLines(canvas,'macd','macd',['diff','dea'],(kLineModel,preKLineModel,barBuffer)=>{let macd=(kLineModel.macd||{}).macd;let preMacd=((preKLineModel||{}).macd||{}).macd;if(macd>0){canvas.strokeStyle=this.indicator.increasingColor;canvas.fillStyle=this.indicator.increasingColor;}else{canvas.strokeStyle=this.indicator.decreasingColor;canvas.fillStyle=this.indicator.decreasingColor;}if((preMacd||preMacd===0)&&macd>preMacd){canvas.strokeRect(barBuffer[0],barBuffer[1],barBuffer[2]-barBuffer[0],barBuffer[3]-barBuffer[1]);}else{canvas.fillRect(barBuffer[0],barBuffer[1],barBuffer[2]-barBuffer[0],barBuffer[3]-barBuffer[1]);}});break;}case IndicatorType.VOL:{this.drawBarLines(canvas,'vol','num',['ma5','ma10','ma20'],(kLineModel,preKLineModel,barBuffer)=>{let close=kLineModel.close;let preClose=(preKLineModel||{}).close;if((preClose||preClose===0)&&close>preClose){canvas.fillStyle=this.indicator.increasingColor;}else{canvas.fillStyle=this.indicator.decreasingColor;}canvas.fillRect(barBuffer[0],barBuffer[1],barBuffer[2]-barBuffer[0],barBuffer[3]-barBuffer[1]);});break;}case IndicatorType.BOLL:{this.drawLines(canvas,'boll',['up','mid','dn'],(x,kLineModel)=>{let halfSpace=this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate)/2;this.drawOhlc(canvas,halfSpace,x,kLineModel,isMainIndicator);});break;}case IndicatorType.BIAS:{this.drawLines(canvas,'bias',['bias1','bias2','bias3']);break;}case IndicatorType.BRAR:{this.drawLines(canvas,'brar',['br','ar']);break;}case IndicatorType.CCI:{this.drawLines(canvas,'cci',['cci']);break;}case IndicatorType.CR:{this.drawLines(canvas,'cr',['cr','ma1','ma2','ma3','ma4']);break;}case IndicatorType.DMA:{this.drawLines(canvas,'dma',['dif','difMa']);break;}case IndicatorType.DMI:{this.drawLines(canvas,'dmi',['mdi','pdi','adx','adxr']);break;}case IndicatorType.KDJ:{this.drawLines(canvas,'kdj',['k','d','j']);break;}case IndicatorType.KD:{this.drawLines(canvas,'kd',['k','d']);break;}case IndicatorType.RSI:{this.drawLines(canvas,'rsi',['rsi1','rsi2','rsi3']);break;}case IndicatorType.PSY:{this.drawLines(canvas,'psy',['psy']);break;}case IndicatorType.TRIX:{this.drawLines(canvas,'trix',['trix','maTrix']);break;}case IndicatorType.OBV:{this.drawLines(canvas,'obv',['obv','maObv']);break;}case IndicatorType.VR:{this.drawLines(canvas,'vr',['vr','maVr']);break;}case IndicatorType.WR:{this.drawLines(canvas,'wr',['wr1','wr2','wr3']);break;}case IndicatorType.MTM:{this.drawLines(canvas,'mtm',['mtm','mtmMa']);break;}case IndicatorType.EMV:{this.drawLines(canvas,'emv',['emv','maEmv']);break;}case IndicatorType.SAR:{this.drawSar(canvas,isMainIndicator);}}}/**
   * 绘制Sar
   * @param canvas
   * @param isMainIndicator
   */drawSar(canvas,isMainIndicator){canvas.save();canvas.beginPath();canvas.rect(this.viewPortHandler.contentLeft(),this.chartTop,this.viewPortHandler.contentRight()-this.viewPortHandler.contentLeft(),this.viewPortHandler.contentBottom()-this.chartTop);canvas.closePath();canvas.clip();canvas.lineWidth=1;let startX=this.viewPortHandler.contentLeft();let dataSpace=this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate);let halfBarSpace=dataSpace/2;let i=this.dataBounds.min;while(i<this.dataBounds.dataList.length&&i<this.dataBounds.min+this.dataBounds.range){let endX=startX+dataSpace;let x=(startX+endX)/2;let kLineModel=this.dataBounds.dataList[i];this.drawOhlc(canvas,halfBarSpace,x,kLineModel,isMainIndicator);let data=kLineModel.sar;let sar=data.sar;if(sar||sar===0){let dataY=this.getValueY(sar);if(sar<(kLineModel.high+kLineModel.low)/2){canvas.strokeStyle=this.indicator.increasingColor;}else{canvas.strokeStyle=this.indicator.decreasingColor;}canvas.beginPath();canvas.arc(x,dataY,halfBarSpace,Math.PI*2,0,true);canvas.stroke();canvas.closePath();}startX+=this.dataBounds.dataSpace;++i;}canvas.restore();}/**
   * 绘制有柱状图有线的指标
   * @param canvas
   * @param dataKey
   * @param barDataKey
   * @param lineDataKeys
   * @param drawRect
   */drawBarLines(canvas,dataKey,barDataKey,lineDataKeys,drawRect){let startX=this.viewPortHandler.contentLeft();let dataSpace=this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate);let halfBarSpace=dataSpace/2;let i=this.dataBounds.min;let barBuffer=[];let lineValues=[];while(i<this.dataBounds.dataList.length&&i<this.dataBounds.min+this.dataBounds.range){let endX=startX+dataSpace;let x=(startX+endX)/2;let kLineModel=this.dataBounds.dataList[i];let preKLineModel;if(i>0){preKLineModel=this.dataBounds.dataList[i-1];}let data=kLineModel[dataKey];let barData=data[barDataKey];if(barData||barData===0){barBuffer[0]=x-halfBarSpace;barBuffer[2]=x+halfBarSpace;let dataY=this.getValueY(barData);let zeroY=this.getValueY(0);barBuffer[1]=dataY;barBuffer[3]=zeroY;drawRect(kLineModel,preKLineModel,barBuffer);}for(let j=0;j<lineDataKeys.length;j++){let value=data[lineDataKeys[j]];let valueY=this.getValueY(value);if(!lineValues[j]){lineValues[j]=[{x:x,y:valueY}];}else{lineValues[j].push({x:x,y:valueY});}}startX+=this.dataBounds.dataSpace;++i;}this.drawLine(canvas,lineValues);}/**
   * 绘制只有线的指标
   * @param canvas
   * @param dataKey
   * @param lineDataKeys
   * @param draw
   */drawLines(canvas,dataKey,lineDataKeys,draw){let startX=this.viewPortHandler.contentLeft();let i=this.dataBounds.min;let dataSpace=this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate);let lineValues=[];while(i<this.dataBounds.dataList.length&&i<this.dataBounds.min+this.dataBounds.range){let endX=startX+dataSpace;let x=(startX+endX)/2;let kLineModel=this.dataBounds.dataList[i];if(draw){draw(x,kLineModel);}let data=kLineModel[dataKey];for(let j=0;j<lineDataKeys.length;j++){let value=data[lineDataKeys[j]];let valueY=this.getValueY(value);if(!lineValues[j]){lineValues[j]=[{x:x,y:valueY}];}else{lineValues[j].push({x:x,y:valueY});}}startX+=this.dataBounds.dataSpace;++i;}this.drawLine(canvas,lineValues);}/**
   * 绘制线
   * @param canvas
   * @param lineValues
   */drawLine(canvas,lineValues){for(let i=0;i<lineValues.length;i++){let values=lineValues[i];if(values.length>0){canvas.strokeStyle=this.indicator.lineColors[i];canvas.beginPath();canvas.moveTo(values[0].x,values[0].y);for(let j=1;j<values.length;j++){canvas.lineTo(values[j].x,values[j].y);}canvas.stroke();canvas.closePath();}}}/**
   * 绘制指标图里面的开低高收价
   */drawOhlc(canvas,halfBarSpace,x,kLineModel,isMainIndicator){if(!isMainIndicator){let openY=this.getValueY(kLineModel.open);let closeY=this.getValueY(kLineModel.close);let highY=this.getValueY(kLineModel.high);let lowY=this.getValueY(kLineModel.low);if(kLineModel.close>kLineModel.open){canvas.strokeStyle=this.indicator.increasingColor;}else{canvas.strokeStyle=this.indicator.decreasingColor;}this.drawOhlcLines(canvas,halfBarSpace,x,openY,closeY,highY,lowY);}}/**
   * 绘制ohlc线
   * @param canvas
   * @param halfBarSpace
   * @param x
   * @param openY
   * @param closeY
   * @param highY
   * @param lowY
   */drawOhlcLines(canvas,halfBarSpace,x,openY,closeY,highY,lowY){canvas.beginPath();canvas.moveTo(x,highY);canvas.lineTo(x,lowY);canvas.stroke();canvas.closePath();canvas.beginPath();canvas.moveTo(x-halfBarSpace,openY);canvas.lineTo(x,openY);canvas.stroke();canvas.closePath();canvas.beginPath();canvas.moveTo(x+halfBarSpace,closeY);canvas.lineTo(x,closeY);canvas.stroke();canvas.closePath();}/**
   * 获取y点坐标
   * @param yValue Float
   */getValueY(yValue){return this.getY(yValue,this.yAxisChart.axisMinimum,this.yAxisChart.axisRange);}/**
   * 是否显示图
   * @returns {boolean}
   */isDisplayChart(){return this.indicatorType!==IndicatorType.NO;}}/* harmony default export */ var chart_IndicatorChart = (IndicatorChart_IndicatorChart);
// CONCATENATED MODULE: ./src/component/Candle.js
/**
 * 蜡烛图样式
 */const CandleStyle={/**
   * 全实心
   */SOLID:'solid',/**
   * 全空心
   */STROKE:'stroke',/**
   * 涨空心
   */INCREASING_STROKE:'increasing_stroke',/**
   * 跌空心
   */DECREASING_STROKE:'decreasing_stroke',/**
   * 美国线
   */OHLC:'ohlc'/**
 * 图表类型
 */};const ChartStyle={/**
   * 蜡烛图
   */CANDLE:'candle',/**
   * 分时线
   */TIME_LINE:'time_line'};class Candle_Candle{constructor(){/**
     * 图类型
     */this.chartStyle=ChartStyle.CANDLE;/**
     * 分时图配置
     */this.timeChart={/**
       * 分时线尺寸
       */timeLineSize:1,/**
       * 分时线颜色
       */timeLineColor:'#D8D8D8',/**
       * 分时线填充色
       */timeLineFillColor:'#f4f4f4',/**
       * 分时均线颜色
       */timeAverageLineColor:'#F5A623'/**
     * 蜡烛图配置
     */};this.candleChart={/**
       * 蜡烛图样式
       */candleStyle:CandleStyle.SOLID,/**
       * 上涨颜色
       */increasingColor:'#5DB300',/**
       * 下跌颜色
       */decreasingColor:'#FF4A4A'/**
     * 最低最高价格标记文字颜色
     */};this.lowestHighestPriceMarkTextColor='#898989';/**
     * 最低最高价格标记文字大小
     */this.lowestHighestPriceMarkTextSize=10;/**
     * 最高最低价格标记值格式化
     */this.lowestHighestValueFormatter=null;/**
     * 最大价格标记参数
     */this.highestPriceMark={display:true,color:'#898989',textSize:10,valueFormatter:null/**
     * 最小价格标记参数
     */};this.lowestPriceMark={display:true,color:'#898989',textSize:10,valueFormatter:null/**
     * 最新价标记参数
     */};this.lastPriceMark={display:true,lineStyle:LineStyle.DASH,dashValue:[8,8],lineSize:1,lineColor:'#B9B9B9'};}}/* harmony default export */ var component_Candle = (Candle_Candle);
// CONCATENATED MODULE: ./src/chart/CandleChart.js
class CandleChart_CandleChart extends chart_IndicatorChart{constructor(candle,indicator,yAxis,dataBounds,viewPortHandler){super(indicator,null,yAxis,dataBounds,viewPortHandler);this.candle=candle;this.indicatorType=IndicatorType.MA;// 最高价标记数据
this.highestMarkData={};// 最低价标记数据
this.lowestMarkData={};}/**
   * 绘制
   * @param canvas
   */draw(canvas){let isTimeLineChart=this.candle.chartStyle===ChartStyle.TIME_LINE;this.yAxisChart.getYAxisDataMinMax(this.indicatorType,true,isTimeLineChart);this.yAxisChart.drawSeparatorLines(canvas);this.yAxisChart.drawTickLines(canvas);if(!isTimeLineChart){this.drawCandle(canvas);this.drawIndicator(canvas,true);this.drawHighestPriceMark(canvas);this.drawLowestPriceMark(canvas);}else{this.drawTimeLine(canvas);}this.drawLastPriceMark(canvas);this.yAxisChart.drawAxisLine(canvas);this.yAxisChart.drawAxisLabels(canvas);}/**
   * 绘制蜡烛图
   * @param canvas
   */drawCandle(canvas){canvas.lineWidth=1;let kLineDataList=this.dataBounds.dataList;let startX=this.viewPortHandler.contentLeft();let i=this.dataBounds.min;let candleSpace=this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate);let halfSpace=candleSpace/2;let rect=[];let markHighestPrice=Number.MIN_VALUE;let markHighestPriceX=-1;let markLowestPrice=Number.MAX_VALUE;let markLowestPriceX=-1;while(i<kLineDataList.length&&i<this.dataBounds.min+this.dataBounds.range){let endX=startX+candleSpace;let x=(startX+endX)/2;let model=kLineDataList[i];let high=model.high;let low=model.low;if(markHighestPrice<high){markHighestPrice=high;markHighestPriceX=x;}if(low<markLowestPrice){markLowestPrice=low;markLowestPriceX=x;}let openY=this.getValueY(model.open);let closeY=this.getValueY(model.close);let highY=this.getValueY(high);let lowY=this.getValueY(low);if(model.close>model.open){canvas.strokeStyle=this.candle.candleChart.increasingColor;canvas.fillStyle=this.candle.candleChart.increasingColor;}else{canvas.strokeStyle=this.candle.candleChart.decreasingColor;canvas.fillStyle=this.candle.candleChart.decreasingColor;}if(this.candle.candleChart.candleStyle!==CandleStyle.OHLC){let highLine=[];let lowLine=[];if(openY>closeY){highLine[0]=highY;highLine[1]=closeY;lowLine[0]=openY;lowLine[1]=lowY;rect=[startX,closeY,endX-startX,openY-closeY];}else if(openY<closeY){highLine[0]=highY;highLine[1]=openY;lowLine[0]=closeY;lowLine[1]=lowY;rect=[startX,openY,endX-startX,closeY-openY];}else{highLine[0]=highY;highLine[1]=openY;lowLine[0]=closeY;lowLine[1]=lowY;rect=[startX,openY,endX-startX,1];}canvas.beginPath();canvas.moveTo(x,highLine[0]);canvas.lineTo(x,highLine[1]);canvas.stroke();canvas.closePath();canvas.beginPath();canvas.moveTo(x,lowLine[0]);canvas.lineTo(x,lowLine[1]);canvas.stroke();canvas.closePath();switch(this.candle.candleChart.candleStyle){case CandleStyle.SOLID:{canvas.fillRect(rect[0],rect[1],rect[2],rect[3]);break;}case CandleStyle.STROKE:{canvas.strokeRect(rect[0],rect[1],rect[2],rect[3]);break;}case CandleStyle.INCREASING_STROKE:{if(model.close>model.open){canvas.strokeRect(rect[0],rect[1],rect[2],rect[3]);}else{canvas.fillRect(rect[0],rect[1],rect[2],rect[3]);}break;}case CandleStyle.DECREASING_STROKE:{if(model.close>model.open){canvas.fillRect(rect[0],rect[1],rect[2],rect[3]);}else{canvas.strokeRect(rect[0],rect[1],rect[2],rect[3]);}break;}}}else{this.drawOhlcLines(canvas,halfSpace,x,openY,closeY,highY,lowY);}startX+=this.dataBounds.dataSpace;++i;}this.highestMarkData={x:markHighestPriceX,price:markHighestPrice};this.lowestMarkData={x:markLowestPriceX,price:markLowestPrice};}/**
   * 绘制最高价标记
   * @param canvas
   */drawHighestPriceMark(canvas){let price=this.highestMarkData.price;if(price===Number.MIN_VALUE||!this.candle.highestPriceMark.display){return;}let color=this.candle.highestPriceMark.color||this.candle.lowestHighestPriceMarkTextColor;let textSize=this.candle.highestPriceMark.textSize||this.candle.lowestHighestPriceMarkTextSize;let valueFormatter=this.candle.highestPriceMark.valueFormatter||this.candle.lowestHighestValueFormatter;this.drawLowestHighestPriceMark(canvas,this.highestMarkData.x,price,color,textSize,valueFormatter,true);}/**
   * 绘制最低价标记
   * @param canvas
   */drawLowestPriceMark(canvas){let price=this.lowestMarkData.price;if(price===Number.MAX_VALUE||!this.candle.lowestPriceMark.display){return;}let color=this.candle.lowestPriceMark.color||this.candle.lowestHighestPriceMarkTextColor;let textSize=this.candle.lowestPriceMark.textSize||this.candle.lowestHighestPriceMarkTextSize;let valueFormatter=this.candle.lowestPriceMark.valueFormatter||this.candle.lowestHighestValueFormatter;this.drawLowestHighestPriceMark(canvas,this.lowestMarkData.x,price,color,textSize,valueFormatter);}/**
   * 绘制最高最低价格标记
   * @param canvas
   * @param x
   * @param price
   * @param color
   * @param textSize
   * @param valueFormatter
   * @param isHigh
   */drawLowestHighestPriceMark(canvas,x,price,color,textSize,valueFormatter,isHigh=false){canvas.save();canvas.beginPath();canvas.rect(this.viewPortHandler.contentLeft(),this.viewPortHandler.contentTop(),this.viewPortHandler.contentRight()-this.viewPortHandler.contentLeft(),this.chartTop+this.chartHeight);canvas.closePath();canvas.clip();let priceY=this.getValueY(price);let startX=x;let startY=priceY+(isHigh?-4:4);canvas.textAlign='left';canvas.lineWidth=1;canvas.strokeStyle=color;canvas.fillStyle=color;canvas.beginPath();canvas.moveTo(startX,startY);canvas.lineTo(startX-4,startY+(isHigh?-4:4));canvas.stroke();canvas.closePath();canvas.beginPath();canvas.moveTo(startX,startY);canvas.lineTo(startX+4,startY+(isHigh?-4:4));canvas.stroke();canvas.closePath();// 绘制竖线
canvas.beginPath();canvas.moveTo(startX,startY);startY=startY+(isHigh?-10:10);canvas.lineTo(startX,startY);canvas.stroke();canvas.closePath();canvas.beginPath();canvas.moveTo(startX,startY);canvas.lineTo(startX+10,startY);canvas.stroke();canvas.closePath();canvas.font=textSize*2+'px Arial';let value=price.toFixed(2);if(valueFormatter){value=valueFormatter(price)+'';}canvas.fillText(value,startX+14,priceY+(isHigh?-textSize:textSize*2));canvas.restore();}/**
   * 绘制最新价标记
   * @param canvas
   */drawLastPriceMark(canvas){if(!this.candle.lastPriceMark.display||this.dataBounds.dataList.length===0){return;}let lastPrice=this.dataBounds.dataList[this.dataBounds.dataList.length-1].close;let priceY=this.getValueY(lastPrice);priceY=Math.max(this.chartTop+this.chartHeight*0.05,Math.min(priceY,this.chartTop+this.chartHeight*0.98));canvas.strokeStyle=this.candle.lastPriceMark.lineColor;canvas.lineWidth=this.candle.lastPriceMark.lineSize;if(this.candle.lastPriceMark.lineStyle===LineStyle.DASH){canvas.setLineDash(this.candle.lastPriceMark.dashValue);}canvas.beginPath();canvas.moveTo(this.viewPortHandler.contentLeft(),priceY);canvas.lineTo(this.viewPortHandler.contentRight(),priceY);canvas.stroke();canvas.closePath();canvas.setLineDash([]);}/**
   * 绘制分时线
   * @param canvas
   */drawTimeLine(canvas){let timeLinePoints=[];let timeLineAreaPoints=[{x:this.viewPortHandler.contentLeft(),y:this.chartTop+this.chartHeight}];let averageLinePoints=[];canvas.lineWidth=this.candle.timeChart.timeLineSize;let kLineDataList=this.dataBounds.dataList;let startX=this.viewPortHandler.contentLeft();let i=this.dataBounds.min;let dataSpace=this.dataBounds.dataSpace-this.dataBounds.dataMarginSpaceRate*this.dataBounds.dataSpace;while(i<this.dataBounds.dataList.length&&i<this.dataBounds.min+this.dataBounds.range){let endX=startX+dataSpace;let x=(startX+endX)/2;let model=kLineDataList[i];let closeY=this.getValueY(model.close);let averagePriceY=this.getValueY(model.averagePrice);timeLinePoints.push({x:x,y:closeY});if(model.averagePrice){averageLinePoints.push({x:x,y:averagePriceY});}if(i===this.dataBounds.min){timeLineAreaPoints.push({x:this.viewPortHandler.contentLeft(),y:closeY});timeLineAreaPoints.push({x:x,y:closeY});}else if(i===this.dataBounds.min+this.dataBounds.range-1){timeLineAreaPoints.push({x:x,y:closeY});timeLineAreaPoints.push({x:this.viewPortHandler.contentRight(),y:closeY});timeLineAreaPoints.push({x:this.viewPortHandler.contentRight(),y:this.chartHeight+this.chartTop});}else if(i===this.dataBounds.dataList.length-1){timeLineAreaPoints.push({x:x,y:closeY});timeLineAreaPoints.push({x:x,y:this.chartTop+this.chartHeight});}else{timeLineAreaPoints.push({x:x,y:closeY});}startX+=this.dataBounds.dataSpace;++i;}if(timeLinePoints.length>0){// 绘制分时线
canvas.strokeStyle=this.candle.timeChart.timeLineColor;canvas.beginPath();canvas.moveTo(timeLinePoints[0].x,timeLinePoints[0].y);for(let i=1;i<timeLinePoints.length;i++){canvas.lineTo(timeLinePoints[i].x,timeLinePoints[i].y);}canvas.stroke();canvas.closePath();}if(timeLineAreaPoints.length>0){// 绘制分时线填充区域
canvas.fillStyle=this.candle.timeChart.timeLineFillColor;canvas.beginPath();canvas.moveTo(timeLineAreaPoints[0].x,timeLineAreaPoints[0].y);for(let i=1;i<timeLineAreaPoints.length;i++){canvas.lineTo(timeLineAreaPoints[i].x,timeLineAreaPoints[i].y);}canvas.closePath();canvas.fill();}if(averageLinePoints.length>0){// 绘制均线
canvas.strokeStyle=this.candle.timeChart.timeAverageLineColor;canvas.beginPath();canvas.moveTo(averageLinePoints[0].x,averageLinePoints[0].y);for(let i=1;i<averageLinePoints.length;i++){canvas.lineTo(averageLinePoints[i].x,averageLinePoints[i].y);}canvas.stroke();canvas.closePath();}}}/* harmony default export */ var chart_CandleChart = (CandleChart_CandleChart);
// CONCATENATED MODULE: ./src/chart/XAxisChart.js
class XAxisChart_XAxisChart extends chart_AxisChart{constructor(xAxis,dataBounds,viewPortHandler){super(dataBounds,viewPortHandler);this.xAxis=xAxis;}/**
   * 绘制
   * @param canvas
   */draw(canvas){this.computeAxis();this.drawAxisLine(canvas);this.drawTickLines(canvas);this.drawAxisLabels(canvas);this.drawSeparatorLines(canvas);}/**
   * 绘制轴线
   * @param canvas
   */drawAxisLine(canvas){if(!this.xAxis.display||!this.xAxis.axisLine.display){return;}canvas.strokeStyle=this.xAxis.axisLine.color||this.xAxis.color;canvas.lineWidth=this.xAxis.axisLine.size;canvas.beginPath();canvas.moveTo(this.viewPortHandler.contentLeft(),this.viewPortHandler.contentBottom());canvas.lineTo(this.viewPortHandler.contentRight(),this.viewPortHandler.contentBottom());canvas.stroke();canvas.closePath();}/**
   * 绘制坐标轴上的文字
   * @param canvas Canvas
   */drawAxisLabels(canvas){if(!this.xAxis.display||!this.xAxis.tickText.display){return;}canvas.font=this.xAxis.tickText.size*2+'px Arial';canvas.textAlign='center';canvas.fillStyle=this.xAxis.tickText.color||this.xAxis.color;let positions=this.pointValuesToPixel();let labelHeight=this.xAxis.tickText.size*2;let startY=this.viewPortHandler.contentBottom()+this.xAxis.tickText.margin*2+labelHeight;if(this.display&&this.xAxis.tickLine.display){startY+=this.xAxis.tickLine.size*2;}let formatter=this.xAxis.tickText.valueFormatter;for(let i=0;i<positions.length;i+=2){let x=positions[i];if(this.viewPortHandler.isInBoundsX(x)){let kLineModel=this.dataBounds.dataList[parseInt(this.values[i/2])];let timestamp=kLineModel.timestamp;let label=utils_utils.formatDate(timestamp);if(formatter){label=formatter(kLineModel);}canvas.fillText(label,x,startY);}}}/**
   * 绘制分割线
   * @param canvas Canvas
   */drawSeparatorLines(canvas){if(!this.xAxis.display||!this.xAxis.separatorLine.display){return;}canvas.strokeStyle=this.xAxis.separatorLine.color||this.xAxis.color;canvas.lineWidth=this.xAxis.separatorLine.size;if(this.xAxis.separatorLine.style===LineStyle.DASH){canvas.setLineDash(this.xAxis.separatorLine.dashValue);}let positions=this.pointValuesToPixel();for(let i=0;i<positions.length;i+=2){let x=positions[i];if(this.viewPortHandler.isInBoundsX(x)){canvas.beginPath();canvas.moveTo(x,this.viewPortHandler.contentTop());canvas.lineTo(x,this.viewPortHandler.contentBottom());canvas.stroke();canvas.closePath();}}canvas.setLineDash([]);}/**
   * 绘制tick线
   * @param canvas Canvas
   */drawTickLines(canvas){if(!this.xAxis.display||!this.xAxis.tickLine.display){return;}canvas.lineWidth=1;canvas.strokeStyle=this.xAxis.axisLine.color||this.xAxis.color;let positions=this.pointValuesToPixel();let startY=this.viewPortHandler.contentBottom();let endY=startY+this.xAxis.tickLine.size*2;for(let i=0;i<positions.length;i+=2){let x=positions[i];if(this.viewPortHandler.isInBoundsX(x)){canvas.beginPath();canvas.moveTo(x,startY);canvas.lineTo(x,endY);canvas.stroke();canvas.closePath();}}}/**
   * 获取值对应的坐标点值
   * @return Array
   */pointValuesToPixel(){let positions=[];for(let i=0;i<this.valueCount*2;i+=2){let pos=this.values[i/2];positions[i]=(pos-this.dataBounds.min)*this.dataBounds.dataSpace+this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate)/2;}return positions;}computeAxis(){let dataMin=this.dataBounds.min;let max=Math.min(dataMin+this.dataBounds.range-1,this.dataBounds.dataList.length-1);this.computeAxisValues(dataMin,max);}}/* harmony default export */ var chart_XAxisChart = (XAxisChart_XAxisChart);
// CONCATENATED MODULE: ./src/component/Tooltip.js
/**
 * 指标提示显示规则
 */const IndicatorDisplayRule={/**
   * 总是显示
   */ALWAYS:'always',/**
   * 跟随十字光标显示
   */FOLLOW_CROSS:'follow_cross',/**
   * 一直不显示
   */NONE:'none'};class Tooltip_Tooltip{constructor(){/**
     * 文字大小
     */this.textSize=12;/**
     * 光标线配置
     */this.crossLine={style:LineStyle.SOLID,dashValue:[8,8],size:1,color:'#505050',text:{color:'#EDEDED',size:12,rectStrokeLineSize:1,rectStrokeLineColor:'#EDEDED',rectFillColor:'#505050',margin:4,valueFormatter:null}/**
     * 基础数据显示配置
     */};this.generalData={labels:['时间','开','收','高','低'],values:null,valueFormatter:null,text:{size:12,color:'#898989',margin:20}/**
     * 指标数据显示配置
     */};this.indicatorData={displayRule:IndicatorDisplayRule.ALWAYS,valueFormatter:null,text:{size:12,margin:20}};}}/* harmony default export */ var component_Tooltip = (Tooltip_Tooltip);
// CONCATENATED MODULE: ./src/chart/TooltipChart.js
class TooltipChart_TooltipChart extends chart_Chart{constructor(tooltip,candle,indicator,yAxis,candleChart,volChart,indicatorChart,dataBounds,viewPortHandler){super(dataBounds,viewPortHandler);this.displayCross=false;this.crossPoint={x:0,y:0};this.tooltip=tooltip;this.candle=candle;this.indicator=indicator;this.yAxis=yAxis;this.candleChart=candleChart;this.volChart=volChart;this.indicatorChart=indicatorChart;this.yAxisLabelStrokePathPoints=[];}draw(canvas){if(this.dataBounds.currentDataPos<this.dataBounds.dataList.length){let kLineModel=this.dataBounds.dataList[this.dataBounds.currentDataPos];if(this.displayCross){this.crossPoint.x=this.viewPortHandler.contentLeft()+this.dataBounds.dataSpace*(this.dataBounds.currentDataPos-this.dataBounds.min)+this.dataBounds.dataSpace*(1-this.dataBounds.dataMarginSpaceRate)/2;canvas.font=(this.tooltip.crossLine.text.size||this.tooltip.textSize)*2+'px Arial';this.drawCrossHorizontalLine(canvas);this.drawCrossVerticalLine(canvas,kLineModel);}if(this.tooltip.indicatorData.displayRule===IndicatorDisplayRule.ALWAYS||this.tooltip.indicatorData.displayRule===IndicatorDisplayRule.FOLLOW_CROSS&&this.displayCross){let textHeight=(this.tooltip.indicatorData.text.size||this.tooltip.textSize)*2;let startX=this.viewPortHandler.contentLeft()+10;canvas.font=textHeight+'px Arial';this.drawGeneralDataTooltip(canvas,startX,kLineModel);if(this.candle.chartStyle!==ChartStyle.TIME_LINE){// 绘制主图的指标提示文字
this.drawIndicatorTooltip(canvas,startX,this.candleChart.chartTop+10+textHeight+10+(this.tooltip.generalData.text.size||this.tooltip.textSize)*2,kLineModel,this.candleChart.indicatorType);}// 绘制成交量指标提示文字
this.drawIndicatorTooltip(canvas,startX,this.volChart.chartTop+4+textHeight,kLineModel,this.volChart.indicatorType);// 绘制副图指标提示文字
this.drawIndicatorTooltip(canvas,startX,this.indicatorChart.chartTop+4+textHeight,kLineModel,this.indicatorChart.indicatorType);}}}/**
   * 绘制水平线
   * @param canvas Canvas
   */drawCrossHorizontalLine(canvas){let yAxisDataLabel=this.getCrossYAxisLabel();if(yAxisDataLabel==null){return;}let isDrawYAxisTextOutside=this.yAxis.tickText.position===YAxisTextPosition.OUTSIDE;let textSize=this.tooltip.crossLine.text.size||this.tooltip.textSize;let yAxisDataLabelWidth=utils_utils.calcTextWidth(textSize*2+'px Arial',yAxisDataLabel);let halfLabelHeight=textSize;let labelStartX;let labelStartY=this.crossPoint.y+halfLabelHeight;let lineStartX=this.viewPortHandler.contentLeft();let lineEndX=this.viewPortHandler.contentRight();let centerPoint=this.viewPortHandler.getContentCenter();let crossTextMarginSpace=this.tooltip.crossLine.text.margin;let rectStrokeLineSize=this.tooltip.crossLine.text.rectStrokeLineSize;if(isDrawYAxisTextOutside){if(this.yAxis.yAxisPosition===YAxisPosition.LEFT){labelStartX=lineStartX-rectStrokeLineSize-crossTextMarginSpace*2-yAxisDataLabelWidth;}else{labelStartX=lineEndX+rectStrokeLineSize+crossTextMarginSpace*2;}}else{if(this.crossPoint.x>centerPoint.x){// 左边
lineStartX=this.viewPortHandler.contentLeft()+rectStrokeLineSize*2+crossTextMarginSpace*3+yAxisDataLabelWidth;labelStartX=this.viewPortHandler.contentLeft()+rectStrokeLineSize+crossTextMarginSpace;}else{lineEndX=this.viewPortHandler.contentRight()-rectStrokeLineSize*2-crossTextMarginSpace*3-yAxisDataLabelWidth;labelStartX=lineEndX+rectStrokeLineSize+crossTextMarginSpace*2;}}if(!isDrawYAxisTextOutside&&this.crossPoint.x>centerPoint.x||isDrawYAxisTextOutside&&this.yAxis.yAxisPosition===YAxisPosition.LEFT){// 左边
this.yAxisLabelStrokePathPoints[0]={x:lineStartX,y:this.crossPoint.y};this.yAxisLabelStrokePathPoints[1]={x:lineStartX-crossTextMarginSpace,y:this.crossPoint.y-halfLabelHeight-crossTextMarginSpace};this.yAxisLabelStrokePathPoints[2]={x:lineStartX-crossTextMarginSpace*3-yAxisDataLabelWidth,y:this.yAxisLabelStrokePathPoints[1].y};this.yAxisLabelStrokePathPoints[3]={x:this.yAxisLabelStrokePathPoints[2].x,y:this.crossPoint.y+halfLabelHeight+crossTextMarginSpace};this.yAxisLabelStrokePathPoints[4]={x:this.yAxisLabelStrokePathPoints[1].x,y:this.yAxisLabelStrokePathPoints[3].y};}else{// 右边
this.yAxisLabelStrokePathPoints[0]={x:lineEndX,y:this.crossPoint.y};this.yAxisLabelStrokePathPoints[1]={x:lineEndX+crossTextMarginSpace,y:this.crossPoint.y-halfLabelHeight-crossTextMarginSpace};this.yAxisLabelStrokePathPoints[2]={x:lineEndX+crossTextMarginSpace*3+yAxisDataLabelWidth,y:this.yAxisLabelStrokePathPoints[1].y};this.yAxisLabelStrokePathPoints[3]={x:this.yAxisLabelStrokePathPoints[2].x,y:this.crossPoint.y+halfLabelHeight+crossTextMarginSpace};this.yAxisLabelStrokePathPoints[4]={x:this.yAxisLabelStrokePathPoints[1].x,y:this.yAxisLabelStrokePathPoints[3].y};}// 绘制十字光标垂直线
canvas.lineWidth=this.tooltip.crossLine.size;canvas.strokeStyle=this.tooltip.crossLine.color;if(this.tooltip.crossLine.style===LineStyle.DASH){canvas.setLineDash(this.tooltip.crossLine.dashValue);}canvas.beginPath();canvas.moveTo(lineStartX,this.crossPoint.y);canvas.lineTo(lineEndX,this.crossPoint.y);canvas.stroke();canvas.closePath();canvas.setLineDash([]);// 绘制y轴文字外的边框
canvas.fillStyle=this.tooltip.crossLine.rectFillColor;canvas.beginPath();canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x,this.yAxisLabelStrokePathPoints[0].y);for(let i=1;i<this.yAxisLabelStrokePathPoints.length;i++){canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x,this.yAxisLabelStrokePathPoints[i].y);}canvas.closePath();canvas.fill();canvas.lineWidth=this.tooltip.crossLine.rectStrokeLineSize;canvas.strokeStyle=this.tooltip.crossLine.rectStrokeLineColor;canvas.beginPath();canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x,this.yAxisLabelStrokePathPoints[0].y);for(let i=1;i<this.yAxisLabelStrokePathPoints.length;i++){canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x,this.yAxisLabelStrokePathPoints[i].y);}canvas.closePath();canvas.stroke();canvas.fillStyle=this.tooltip.crossLine.text.color;canvas.fillText(yAxisDataLabel,labelStartX,labelStartY);}/**
   * 获取十字光标y轴上的文字
   */getCrossYAxisLabel(){let candleChartYAxis=this.candleChart.yAxisChart;let candleChartHeight=candleChartYAxis.chartHeight;let candleChartTop=candleChartYAxis.chartTop;let volChartYAxis=this.volChart.yAxisChart;let volChartHeight=volChartYAxis.chartHeight;let volChartTop=volChartYAxis.chartTop;let indicatorChartYAxis=this.indicatorChart.yAxisChart;let indicatorChartHeight=indicatorChartYAxis.chartHeight;let indicatorChartTop=indicatorChartYAxis.chartTop;let eventY=this.crossPoint.y;if(eventY>candleChartTop&&eventY<candleChartHeight+candleChartTop){let candleChartYAxisDataMin=candleChartYAxis.axisMinimum;let candleChartYAxisDataMax=candleChartYAxis.axisMaximum;let yData=(1-(eventY-candleChartTop)/candleChartHeight)*(candleChartYAxisDataMax-candleChartYAxisDataMin)+candleChartYAxisDataMin;let text=yData.toFixed(2);if(this.tooltip.crossLine.text.valueFormatter){text=this.tooltip.crossLine.text.valueFormatter('y',yData)||'--';}return text;}else if(eventY>volChartTop&&eventY<volChartTop+volChartHeight){let volIndicatorChartYAxisDataMin=volChartYAxis.axisMinimum;let volIndicatorChartYAxisDataMax=volChartYAxis.axisMaximum;let yData=(1-(eventY-volChartTop)/volChartHeight)*(volIndicatorChartYAxisDataMax-volIndicatorChartYAxisDataMin)+volIndicatorChartYAxisDataMin;let text=yData.toFixed(0);if(this.tooltip.crossLine.text.valueFormatter){text=this.tooltip.crossLine.text.valueFormatter('y',yData)||'--';}return text;}else if(eventY>indicatorChartTop&&eventY<indicatorChartTop+indicatorChartHeight){let indicatorChartYAxisDataMin=indicatorChartYAxis.axisMinimum;let indicatorChartYAxisDataMax=indicatorChartYAxis.axisMaximum;let yData=(1-(eventY-indicatorChartTop)/indicatorChartHeight)*(indicatorChartYAxisDataMax-indicatorChartYAxisDataMin)+indicatorChartYAxisDataMin;let text=yData.toFixed(2);if(this.indicatorChart.indicatorType===IndicatorType.VOL){text=yData.toFixed(0);}if(this.tooltip.crossLine.text.valueFormatter){text=this.tooltip.crossLine.text.valueFormatter('y',yData)||'--';}return text;}return null;}/**
   * 绘制十字光标垂直线
   * @param canvas Canvas
   * @param kLineModel KLineModel
   */drawCrossVerticalLine(canvas,kLineModel){canvas.lineWidth=this.tooltip.crossLine.size;canvas.strokeStyle=this.tooltip.crossLine.color;if(this.tooltip.crossLine.style===LineStyle.DASH){canvas.setLineDash(this.tooltip.crossLine.dashValue);}canvas.beginPath();canvas.moveTo(this.crossPoint.x,this.viewPortHandler.contentTop());canvas.lineTo(this.crossPoint.x,this.viewPortHandler.contentBottom());canvas.stroke();canvas.closePath();canvas.setLineDash([]);let timestamp=kLineModel.timestamp;let label=utils_utils.formatDate(timestamp);if(this.tooltip.crossLine.text.valueFormatter){label=this.tooltip.crossLine.text.valueFormatter('x',kLineModel)||'--';}let textSize=this.tooltip.crossLine.text.size||this.tooltip.textSize;let labelWidth=utils_utils.calcTextWidth(textSize*2+'px Arial',label);let xAxisLabelX=this.crossPoint.x-labelWidth/2;let crossTextMarginSpace=this.tooltip.crossLine.text.margin;let rectStrokeLineSize=this.tooltip.crossLine.text.rectStrokeLineSize;// 保证整个x轴上的提示文字总是完全显示
if(xAxisLabelX<this.viewPortHandler.contentLeft()+crossTextMarginSpace+rectStrokeLineSize){xAxisLabelX=this.viewPortHandler.contentLeft();}else if(xAxisLabelX>this.viewPortHandler.contentRight()-labelWidth-rectStrokeLineSize){xAxisLabelX=this.viewPortHandler.contentRight()-labelWidth-rectStrokeLineSize;}let rectLeft=xAxisLabelX-rectStrokeLineSize-crossTextMarginSpace;let rectTop=this.viewPortHandler.contentBottom();let rectRight=xAxisLabelX+labelWidth+crossTextMarginSpace+rectStrokeLineSize;let rectBottom=this.viewPortHandler.contentBottom()+textSize*2+rectStrokeLineSize+crossTextMarginSpace*2;canvas.fillStyle=this.tooltip.crossLine.text.rectFillColor;canvas.fillRect(rectLeft,rectTop,rectRight-rectLeft,rectBottom-rectTop);canvas.lineWidth=rectStrokeLineSize;canvas.strokeStyle=this.tooltip.crossLine.rectStrokeLineColor;canvas.strokeRect(rectLeft,rectTop,rectRight-rectLeft,rectBottom-rectTop);// 绘制轴上的提示文字
canvas.fillStyle=this.tooltip.crossLine.text.color;canvas.fillText(label,xAxisLabelX,this.viewPortHandler.contentBottom()+textSize*2+rectStrokeLineSize+crossTextMarginSpace);}/**
   * 绘制基础数据提示
   * @param canvas
   * @param startX
   * @param kLineModel
   */drawGeneralDataTooltip(canvas,startX,kLineModel){let textSize=this.tooltip.generalData.text.size||this.tooltip.textSize;canvas.font=textSize*2+'px Arial';let textColor=this.tooltip.generalData.text.color;let values=[];if(this.tooltip.generalData.values){values=this.tooltip.generalData.values(kLineModel)||[];}else{let formatter=this.tooltip.generalData.valueFormatter;let time=utils_utils.formatDate(kLineModel.timestamp);let open=kLineModel.open.toFixed(2);let close=kLineModel.close.toFixed(2);let high=kLineModel.high.toFixed(2);let low=kLineModel.low.toFixed(2);if(formatter){time=formatter(0,kLineModel.timestamp)||'--';open=formatter(1,kLineModel.open)||'--';close=formatter(2,kLineModel.close)||'--';high=formatter(3,kLineModel.high)||'--';low=formatter(4,kLineModel.low)||'--';}values=[time,open,close,high,low];}let labels=this.tooltip.generalData.labels;for(let i=0;i<labels.length;i++){let label=(labels[i]||'--')+': ';let labelWidth=utils_utils.calcTextWidth(textSize*2+'px Arial',label);canvas.fillStyle=textColor;canvas.fillText(label,startX,textSize*2+4);startX+=labelWidth;let value=values[i]||'--';let text;if(typeof value==='object'){text=value.value||'--';canvas.fillStyle=value.color||textColor;}else{canvas.fillStyle=textColor;text=value;}let textWidth=utils_utils.calcTextWidth(textSize*2+'px Arial',text);canvas.fillText(text,startX,textSize*2+4);startX+=textWidth+this.tooltip.generalData.text.margin;}}/**
   * 绘制指标提示文字
   * @param canvas
   * @param startX
   * @param startY
   * @param kLineModel
   * @param indicatorType
   */drawIndicatorTooltip(canvas,startX,startY,kLineModel,indicatorType){switch(indicatorType){case IndicatorType.MA:{let maData=kLineModel.ma;this.drawIndicatorTooltipLabels(canvas,startX,startY,[maData.ma5,maData.ma10,maData.ma20,maData.ma60],['MA5','MA10','MA20','MA60'],kLineModel,IndicatorType.MA);break;}case IndicatorType.MACD:{let macdData=kLineModel.macd;this.drawIndicatorTooltipLabels(canvas,startX,startY,[macdData.diff,macdData.dea,macdData.macd],['DIFF','DEA','MACD'],kLineModel,IndicatorType.MACD);break;}case IndicatorType.VOL:{let volData=kLineModel.vol;this.drawIndicatorTooltipLabels(canvas,startX,startY,[volData.ma5,volData.ma10,volData.ma20,volData.num],['MA5','MA10','MA20','VOLUME'],kLineModel,IndicatorType.VOL);break;}case IndicatorType.BOLL:{let bollData=kLineModel.boll;this.drawIndicatorTooltipLabels(canvas,startX,startY,[bollData.up,bollData.mid,bollData.dn],['UP','MID','DN'],kLineModel,IndicatorType.BOLL);break;}case IndicatorType.BIAS:{let biasData=kLineModel.bias;this.drawIndicatorTooltipLabels(canvas,startX,startY,[biasData.bias1,biasData.bias2,biasData.bias3],['BIAS6','BIAS12','BIAS24'],kLineModel,IndicatorType.BIAS);break;}case IndicatorType.BRAR:{let brarData=kLineModel.brar;this.drawIndicatorTooltipLabels(canvas,startX,startY,[brarData.br,brarData.ar],['BR','AR'],kLineModel,IndicatorType.BRAR);break;}case IndicatorType.CCI:{let cciData=kLineModel.cci;this.drawIndicatorTooltipLabels(canvas,startX,startY,[cciData.cci],['CCI'],kLineModel,IndicatorType.CCI);break;}case IndicatorType.CR:{let crData=kLineModel.cr;this.drawIndicatorTooltipLabels(canvas,startX,startY,[crData.cr,crData.ma1,crData.ma2,crData.ma3,crData.ma4],['CR','MA1','MA2','MA3','MA4'],kLineModel,IndicatorType.CR);break;}case IndicatorType.DMA:{let dmaData=kLineModel.dma;this.drawIndicatorTooltipLabels(canvas,startX,startY,[dmaData.dif,dmaData.difMa],['DIF','DIFMA'],kLineModel,IndicatorType.DMA);break;}case IndicatorType.DMI:{let dmiData=kLineModel.dmi;this.drawIndicatorTooltipLabels(canvas,startX,startY,[dmiData.mdi,dmiData.pdi,dmiData.adx,dmiData.adxr],['MDI','PDI','ADX','ADXR'],kLineModel,IndicatorType.DMI);break;}case IndicatorType.KDJ:{let kdjData=kLineModel.kdj;this.drawIndicatorTooltipLabels(canvas,startX,startY,[kdjData.k,kdjData.d,kdjData.j],['K','D','J'],kLineModel,IndicatorType.KDJ);break;}case IndicatorType.KD:{let kdjData=kLineModel.kdj;this.drawIndicatorTooltipLabels(canvas,startX,startY,[kdjData.k,kdjData.d],['K','D'],kLineModel,IndicatorType.KDJ);break;}case IndicatorType.RSI:{let rsiData=kLineModel.rsi;this.drawIndicatorTooltipLabels(canvas,startX,startY,[rsiData.rsi1,rsiData.rsi2,rsiData.rsi3],['RSI6','RSI12','RSI24'],kLineModel,IndicatorType.RSI);break;}case IndicatorType.PSY:{let psyData=kLineModel.psy;this.drawIndicatorTooltipLabels(canvas,startX,startY,[psyData.psy],['PSY'],kLineModel,IndicatorType.PSY);break;}case IndicatorType.TRIX:{let trixData=kLineModel.trix;this.drawIndicatorTooltipLabels(canvas,startX,startY,[trixData.trix,trixData.maTrix],['TRIX','MATRIX'],kLineModel,IndicatorType.TRIX);break;}case IndicatorType.OBV:{let obvData=kLineModel.obv;this.drawIndicatorTooltipLabels(canvas,startX,startY,[obvData.obv,obvData.maObv],['OBV','MAOBV'],kLineModel,IndicatorType.OBV);break;}case IndicatorType.VR:{let vrModel=kLineModel.vr;this.drawIndicatorTooltipLabels(canvas,startX,startY,[vrModel.vr,vrModel.maVr],['VR','MAVR'],kLineModel,IndicatorType.VR);break;}case IndicatorType.WR:{let wrModel=kLineModel.wr;this.drawIndicatorTooltipLabels(canvas,startX,startY,[wrModel.wr1,wrModel.wr2,wrModel.wr3],['WR1','WR2','WR3'],kLineModel,IndicatorType.WR);break;}case IndicatorType.MTM:{let mtmModel=kLineModel.mtm;this.drawIndicatorTooltipLabels(canvas,startX,startY,[mtmModel.mtm,mtmModel.mtmMa],['MTM','MTMMA'],kLineModel,IndicatorType.MTM);break;}case IndicatorType.EMV:{let emvModel=kLineModel.emv;this.drawIndicatorTooltipLabels(canvas,startX,startY,[emvModel.emv,emvModel.maEmv],['EMV','MAEMV'],kLineModel,IndicatorType.EMV);break;}case IndicatorType.SAR:{let sarModel=kLineModel.sar;this.drawIndicatorTooltipLabels(canvas,startX,startY,[sarModel.sar],['SAR'],kLineModel,IndicatorType.SAR);break;}}}/**
   * 绘制指标提示文字
   * @param canvas
   * @param startX
   * @param startY
   * @param values
   * @param labels
   * @param kLineModel
   * @param indicatorType
   */drawIndicatorTooltipLabels(canvas,startX,startY,values,labels,kLineModel,indicatorType){let labelX=startX;for(let i=0;i<values.length;i++){let value=values[i];let valueStr='--';if(value||value===0){if(indicatorType===IndicatorType.VOL){valueStr=value.toFixed(0);}else{valueStr=value.toFixed(2);}}if(this.tooltip.indicatorData.valueFormatter){valueStr=this.tooltip.indicatorData.valueFormatter(indicatorType,value)||'--';}let text=labels[i]+': '+valueStr;let textWidth=utils_utils.calcTextWidth((this.tooltip.indicatorData.text.size||this.tooltip.textSize)*2+'px Arial',text);canvas.fillStyle=this.indicator.lineColors[i];canvas.fillText(text,labelX,startY);labelX+=this.tooltip.indicatorData.text.margin+textWidth;}}/**
   * 设置会否显示cross
   */setCross(y,display){this.crossPoint.y=y;this.displayCross=display;}}/* harmony default export */ var chart_TooltipChart = (TooltipChart_TooltipChart);
// CONCATENATED MODULE: ./src/component/XAxis.js
class XAxis_XAxis extends component_Axis{constructor(){super();/**
     * x轴最大高度
     */this.xAxisMaxHeight=20;/**
     * x轴最小高度
     */this.xAxisMinHeight=20;}/**
   * 计算x轴需要的高度
   * @return number
   */getRequiredHeightSpace(){let height=this.tickText.size*2+this.tickText.margin*2;if(this.display&&this.tickLine.display){height+=this.tickLine.size*2;}if(this.display&&this.axisLine.display){height+=this.axisLine.size;}let maxHeight=height;if(this.xAxisMaxHeight>0){maxHeight=this.xAxisMaxHeight*2;}height=Math.max(this.xAxisMinHeight*2,Math.min(height,maxHeight));return height;}}/* harmony default export */ var component_XAxis = (XAxis_XAxis);
// CONCATENATED MODULE: ./src/component/Grid.js
class Grid{constructor(){this.display=true;/**
     * 边框线尺寸
     */this.lineSize=1;/**
     * 边框线颜色
     */this.lineColor='#707070';}}/* harmony default export */ var component_Grid = (Grid);
// CONCATENATED MODULE: ./src/internal/event/Event.js
class Event{constructor(kline,dataBounds,viewPortHandler){this.kline=kline;this.dataBounds=dataBounds;this.viewPortHandler=viewPortHandler;}/**
   * 是否是有效事件
   * @param point
   * @returns {boolean}
   */isValidEvent(point){return!(point.x<this.viewPortHandler.contentLeft()||point.x>this.viewPortHandler.contentRight()||point.y<this.viewPortHandler.contentTop()||point.y>this.viewPortHandler.contentBottom());}}/* harmony default export */ var event_Event = (Event);
// CONCATENATED MODULE: ./src/internal/event/MouseEvent.js
const CROSS='cross';const DRAG='drag';class MouseEvent_MouseEvent extends event_Event{constructor(kline,dataBounds,viewPortHandler){super(kline,dataBounds,viewPortHandler);// 事件模型
this.mouseMode=CROSS;this.mouseDownPoint={x:0,y:0};}/**
   * 鼠标按下时事件
   * @param e
   */mouseDown(e){let point=this.getCanvasPoint(e);if(!this.isValidEvent(point)){return;}this.mouseMode=DRAG;this.mouseDownPoint.x=e.x;this.mouseDownPoint.y=e.y;this.kline.tooltipChart.setCross(point.y,false);this.kline.freshen();}/**
   * 鼠标抬起时事件
   * @param e
   */mouseUp(e){let point=this.getCanvasPoint(e);if(!this.isValidEvent(point)){return;}this.mouseMode=CROSS;this.kline.tooltipChart.setCross(point.y,true);this.kline.freshen();}mouseLeave(e){let point=this.getCanvasPoint(e);this.kline.tooltipChart.setCross(point.y,false);this.kline.freshen();}/**
   * 鼠标移动时事件
   * @param e
   */mouseMove(e){let point=this.getCanvasPoint(e);if(!this.isValidEvent(point)){this.kline.tooltipChart.setCross(point.y,false);this.kline.freshen();return;}if(this.mouseMode===DRAG){let moveDist=e.x-this.mouseDownPoint.x;if(moveDist>this.dataBounds.dataSpace/2){if(this.dataBounds.min===0||this.dataBounds.dataList.length<this.dataBounds.range){return false;}this.mouseDownPoint.x=e.x;let moveRange=+Math.abs(moveDist/this.dataBounds.dataSpace).toFixed(0);if(moveRange===0){moveRange=1;}this.dataBounds.min-=moveRange;if(this.dataBounds.min<=0){this.dataBounds.min=0;}this.kline.freshen();}else if(moveDist<0-this.dataBounds.dataSpace/2){if(this.dataBounds.min+this.dataBounds.range===this.dataBounds.dataList.length||this.dataBounds.dataList.length<this.dataBounds.range){return false;}this.mouseDownPoint.x=e.x;let moveRange=+Math.abs(moveDist/this.dataBounds.dataSpace).toFixed(0);if(moveRange===0){moveRange=1;}this.dataBounds.min+=moveRange;if(this.dataBounds.min>=this.dataBounds.dataList.length-this.dataBounds.range){this.dataBounds.min=this.dataBounds.dataList.length-this.dataBounds.range;}this.kline.freshen();}}else if(this.mouseMode===CROSS){this.dataBounds.calcCurrentDataIndex(point.x);this.kline.tooltipChart.setCross(point.y,true);this.kline.freshen();}}/**
   * 鼠标滚轮事件
   * @param e
   */mouseWheel(e){let touchStartPosition=this.dataBounds.min;let touchRange=this.dataBounds.range;let delta=Math.max(-1,Math.min(1,e.wheelDelta||-e.detail));// 是否缩小
let isZoomingOut=delta===1;let scaleX=1;if(isZoomingOut){scaleX=0.95;if(this.dataBounds.range>=this.dataBounds.maxRange){// 无法继续缩小
return false;}}else{scaleX=1.05;if(this.dataBounds.range<=this.dataBounds.minRange){// 无法继续放大
return false;}}// 计算缩放后的range大小
this.dataBounds.range=+(touchRange/scaleX).toFixed(0);this.dataBounds.range=Math.min(Math.max(this.dataBounds.range,this.dataBounds.minRange),this.dataBounds.maxRange);this.dataBounds.min=touchStartPosition+touchRange-this.dataBounds.range;if(this.dataBounds.min+this.dataBounds.range>this.dataBounds.dataList.length){this.dataBounds.min=0;}if(this.dataBounds.min<0){this.dataBounds.min=0;}this.kline.freshen();}/**
   * 获取事件对应画布上的点
   * @param e
   * @returns {{x: number, y: number}}
   */getCanvasPoint(e){let rect=this.kline.canvasDom.getBoundingClientRect();let x=Math.round(e.clientX-rect.left);let y=Math.round(e.clientY-rect.top);return{x:x*2,y:y*2};}}/* harmony default export */ var event_MouseEvent = (MouseEvent_MouseEvent);
// CONCATENATED MODULE: ./src/internal/event/TouchEvent.js
/**
 * 无
 */const TOUCH_NO=0;/**
 * 拖拽
 */const TOUCH_DRAG=1;/**
 * 缩放
 */const TOUCH_ZOOM=2;/**
 *
 */const TOUCH_POST_ZOOM=3;/**
 * 十字光标
 */const TOUCH_CROSS=4;/**
 * 十字光标取消
 */const TOUCH_CROSS_CANCEL=5;class TouchEvent_TouchEvent extends event_Event{constructor(kline,dataBounds,viewPortHandler){super(kline,dataBounds,viewPortHandler);// 事件模型
this.touchMode=TOUCH_NO;this.touchStartPoint={x:0,y:0};this.touchMovePoint={x:0,y:0};this.touchCrossPoint={x:0,y:0};this.savedDist=1;this.savedXDist=1;this.touchRange=this.dataBounds.range;this.touchStartPosition=this.dataBounds.min;this.delayTimeout=null;this.delayActiveCross=()=>{if(this.touchMode===TOUCH_NO||this.touchMode===TOUCH_CROSS_CANCEL){if(this.kline){this.touchMode=TOUCH_CROSS;this.touchCrossPoint={x:this.touchStartPoint.x,y:this.touchStartPoint.y};dataBounds.calcCurrentDataIndex(this.touchCrossPoint.x);this.kline.tooltipChart.setCross(this.touchCrossPoint.y,true);this.kline.freshen();}}};}/**
   * 触摸事件开始
   * @param e
   */touchStart(e){if(e.targetTouches.length===1){this.touchStartPoint={x:e.targetTouches[0].clientX*2,y:e.targetTouches[0].clientY*2};this.touchMovePoint={x:e.targetTouches[0].clientX*2,y:e.targetTouches[0].clientY*2};if(!this.isValidEvent(this.touchStartPoint)){return;}if(this.touchMode===TOUCH_CROSS){e.preventDefault();let crossRadius=this.distance(e.targetTouches[0].clientX*2,this.touchCrossPoint.x,e.targetTouches[0].clientY*2,this.touchCrossPoint.y);if(crossRadius<10){this.performCross(e);}else{this.touchMode=TOUCH_CROSS_CANCEL;this.kline.tooltipChart.setCross(0,false);this.kline.freshen();}}else{this.touchMode=TOUCH_NO;}this.removeDelayActiveCross();this.postDelayDelayActiveCross();}else if(e.targetTouches.length>1){if(!this.isValidEvent(this.touchStartPoint)){return;}if(this.touchMode!==TOUCH_CROSS){e.preventDefault();this.savedDist=this.spacing(e);this.savedXDist=this.getXDist(e);if(this.savedDist>3){this.touchMode=TOUCH_ZOOM;}this.touchRange=this.dataBounds.range;this.touchStartPosition=this.dataBounds.min;}}}/**
   * 触摸事件移动
   * @param e
   */touchMove(e){if(!this.isValidEvent(this.touchStartPoint)){return;}switch(this.touchMode){case TOUCH_ZOOM:{e.preventDefault();this.performZoom(e);break;}case TOUCH_DRAG:{e.preventDefault();this.performDrag(e);break;}case TOUCH_CROSS:{e.preventDefault();this.performCross(e);break;}case TOUCH_CROSS_CANCEL:{this.removeDelayActiveCross();break;}case TOUCH_NO:{let distance=Math.abs(this.distance(e.targetTouches[0].clientX*2,this.touchStartPoint.x,e.targetTouches[0].clientY*2,this.touchStartPoint.y));if(distance>10){let distanceX=Math.abs(e.targetTouches[0].clientX*2-this.touchStartPoint.x);let distanceY=Math.abs(e.targetTouches[0].clientY*2-this.touchStartPoint.y);if(distanceY<=distanceX){e.preventDefault();this.kline.tooltipChart.setCross(0,false);this.touchMode=TOUCH_DRAG;this.kline.freshen();}}this.removeDelayActiveCross();}}}/**
   * 触摸事件结束
   * @param e
   */touchEnd(e){if(!this.isValidEvent(this.touchStartPoint)){return;}if(e.targetTouches.length>0){if(this.touchMode===TOUCH_CROSS){this.performCross(e);}else{this.touchMode=TOUCH_POST_ZOOM;}}else{this.removeDelayActiveCross();if(this.touchMode!==TOUCH_CROSS){// 拿起
this.touchMode=TOUCH_NO;this.kline.tooltipChart.setCross(0,false);this.kline.freshen();}}}/**
   * 处理拖拽视图事件
   * @param e
   * @returns {boolean}
   */performDrag(e){// 左右滑动事件
let moveDist=e.targetTouches[0].clientX*2-this.touchMovePoint.x;if(moveDist<0-this.dataBounds.dataSpace/2){if(this.dataBounds.min+this.dataBounds.range===this.dataBounds.dataList.length||this.dataBounds.dataList.length<this.dataBounds.range){return false;}this.touchMovePoint.x=e.targetTouches[0].clientX*2;let moveRange=+Math.abs(moveDist/this.dataBounds.dataSpace).toFixed(0);if(moveRange===0){moveRange=1;}this.dataBounds.min+=moveRange;if(this.dataBounds.min>=this.dataBounds.dataList.length-this.dataBounds.range){this.dataBounds.min=this.dataBounds.dataList.length-this.dataBounds.range;}this.kline.freshen();}else if(moveDist>this.dataBounds.dataSpace/2){if(this.dataBounds.min===0||this.dataBounds.dataList.length<this.dataBounds.range){return false;}this.touchMovePoint.x=e.targetTouches[0].clientX*2;let moveRange=+Math.abs(moveDist/this.dataBounds.dataSpace).toFixed(0);if(moveRange===0){moveRange=1;}this.dataBounds.min-=moveRange;if(this.dataBounds.min<=0){this.dataBounds.min=0;}this.kline.freshen();}}/**
   * 处理缩放
   * @param e
   * @returns {boolean}
   */performZoom(e){if(e.targetTouches.length>1){let totalDist=this.spacing(e);if(totalDist>10){let xDist=this.getXDist(e);// x轴方向 scale
let scaleX=xDist/this.savedXDist;// 是否缩小
let isZoomingOut=scaleX<1;if(isZoomingOut){if(this.dataBounds.range>=this.dataBounds.maxRange){// 无法继续缩小
return false;}}else{if(this.dataBounds.range<=this.dataBounds.minRange){// 无法继续放大
return false;}}// 计算缩放后的range大小
this.dataBounds.range=+(this.touchRange/scaleX).toFixed(0);this.dataBounds.range=Math.min(Math.max(this.dataBounds.range,this.dataBounds.minRange),this.dataBounds.maxRange);this.dataBounds.min=this.touchStartPosition+this.touchRange-this.dataBounds.range;if(this.dataBounds.min+this.dataBounds.range>this.dataBounds.dataList.length){this.dataBounds.min=0;}if(this.dataBounds.min<0){this.dataBounds.min=0;}this.kline.freshen();}}}/**
   * 处理移动光标
   * @param e
   * @returns {boolean}
   */performCross(e){this.touchCrossPoint={x:e.targetTouches[0].clientX*2,y:e.targetTouches[0].clientY*2};this.dataBounds.calcCurrentDataIndex(this.touchCrossPoint.x);this.kline.tooltipChart.setCross(this.touchCrossPoint.y,true);this.kline.freshen();}/**
   * 执行延迟事件
   */postDelayDelayActiveCross(){this.delayTimeout=setTimeout(this.delayActiveCross,200);}/**
   * 移除延迟事件
   */removeDelayActiveCross(){if(this.delayTimeout){clearTimeout(this.delayTimeout);this.delayTimeout=null;}}/**
   * 两点之间的距离
   * @param eventX
   * @param startX
   * @param eventY
   * @param startY
   * @returns {*}
   */distance(eventX,startX,eventY,startY){let dx=eventX-startX;let dy=eventY-startY;return Math.sqrt(dx*dx+dy*dy);}/**
   * 计算移动距离
   * @param e
   * @returns {*}
   */spacing(e){if(e.targetTouches.length<2){return 0;}let x=Math.abs(e.targetTouches[0].clientX*2-e.targetTouches[1].clientX*2);let y=Math.abs(e.targetTouches[0].clientY*2-e.targetTouches[1].clientY*2);return Math.sqrt(x*x+y*y);}/**
   * 获取两点间x的距离
   * @param e
   * @returns {number}
   */getXDist(e){return Math.abs(e.targetTouches[0].clientX*2-e.targetTouches[1].clientX*2);}}/* harmony default export */ var event_TouchEvent = (TouchEvent_TouchEvent);
// CONCATENATED MODULE: ./src/utils/indicatorCalculation.js
/**
 * 计算均线数据
 * @param data
 * @returns {*}
 */function calculationMa(data){let ma5Num=0.0;let ma10Num=0.0;let ma20Num=0.0;let ma60Num=0.0;let ma5;let ma10;let ma20;let ma60;let totalTurnover=0.0;let totalVolume=0.0;for(let i=0;i<data.length;i++){totalVolume+=data[i].volume;totalTurnover+=data[i].turnover||0;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let close=data[i].close;ma5Num+=close;ma10Num+=close;ma20Num+=close;ma60Num+=close;if(i<5){ma5=ma5Num/(i+1);}else{ma5Num-=data[i-5].close;ma5=ma5Num/5;}if(i<10){ma10=ma10Num/(i+1);}else{ma10Num-=data[i-10].close;ma10=ma10Num/10;}if(i<20){ma20=ma20Num/(i+1);}else{ma20Num-=data[i-20].close;ma20=ma20Num/20;}if(i<60){ma60=ma60Num/(i+1);}else{ma60Num-=data[i-60].close;ma60=ma60Num/60;}data[i].ma={ma5,ma10,ma20,ma60};}return data;}/**
 * 计算成交量包含ma5、ma10、ma20
 *
 * @param data
 * @return
 */function calculationVol(data){let ma5s=0;let ma10s=0;let ma20s=0;let ma5;let ma10;let ma20;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let num=data[i].volume;ma5s+=num;ma10s+=num;ma20s+=num;if(i<5){ma5=ma5s/(i+1);}else{ma5s-=data[i-5].volume;ma5=ma5s/5;}if(i<10){ma10=ma10s/(i+1);}else{ma10s-=data[i-10].volume;ma10=ma10s/10;}if(i<20){ma20=ma20s/(i+1);}else{ma20s-=data[i-20].volume;ma20=ma20s/20;}data[i].vol={num,ma5,ma10,ma20};}return data;}/**
 * 计算MACD指标
 *
 * @param data
 * @return
 */function calculationMacd(data){// MACD：参数快线移动平均、慢线移动平均、移动平均，
// 参数值12、26、9。
// 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
// ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
// ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
// ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0红色，小于0绿色。
let ema12;let ema26;let oldEma12=0;let oldEma26=0;let diff=0;let dea=0;let oldDea=0;let macd=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;if(i>0){ema12=(2*closePrice+11*oldEma12)/13;ema26=(2*closePrice+25*oldEma26)/27;diff=ema12-ema26;dea=(diff*2+oldDea*8)/10;macd=(diff-dea)*2;oldEma12=ema12;oldEma26=ema26;oldDea=dea;}data[i].macd={diff,dea,macd};}return data;}/**
 * 计算BOLL指标
 *
 * @param data
 * @return
 */function calculationBoll(data){let closes26=0;// MA
let closes25=0;let ma;// 中轨线
let mb;let md;// 标准差
let up;// 上轨线
let dn;// 下轨线
let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;closes26+=closePrice;closes25+=closePrice;if(i>=24){mb=closes25/25;closes25-=data[i-24].close;}else{mb=closes25/(i+1);}if(i>=25){ma=closes26/26;md=getBollMd(data.slice(i-25,i+1),ma);closes26-=data[i-25].close;}else{ma=closes26/(i+1);md=getBollMd(data.slice(0,i+1),ma);}up=mb+2*md;dn=mb-2*md;data[i].boll={up,mid:ma,dn};}return data;}/**
 * 计算KDJ
 *
 * @param data
 * @return
 */function calculationKdj(data){let k;let d;let j;// n日内最低价
let ln;// n日内最高价
let hn;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}// n日收盘价
let cn=data[i].close;if(i<8){ln=getLow(data.slice(0,i+1));hn=getHigh(data.slice(0,i+1));}else{ln=getLow(data.slice(i-8,i+1));hn=getHigh(data.slice(i-8,i+1));}let rsv=(cn-ln)/(hn-ln===0?1:hn-ln)*100;// 当日K值=2/3×前一日K值+1/3×当日RSV
// 当日D值=2/3×前一日D值+1/3×当日K值
// 若无前一日K 值与D值，则可分别用50来代替。
// J值=3*当日K值-2*当日D值
k=2.0/3.0*(i<8?50.0:data[i-1].kdj.k)+1.0/3.0*rsv;d=2.0/3.0*(i<8?50.0:data[i-1].kdj.d)+1.0/3.0*k;j=3.0*k-2.0*d;data[i].kdj={k,d,j};}return data;}/**
 * 计算RSI
 *
 * @param data
 * @return
 */function calculationRsi(data){// N日RSI =
// N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
let rsi1=0;// 参数6
let rsi2=0;// 参数12
let rsi3=0;// 参数24
let sumCloseA=0;let sumCloseB=0;let a1;let b1;let oldA1=0;let oldB1=0;let a2;let b2;let oldA2=0;let oldB2=0;let a3;let b3;let oldA3=0;let oldB3=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i>0){let tmp=data[i].close-data[i-1].close;if(tmp>0){sumCloseA+=tmp;}else{sumCloseB+=tmp;}let AA=tmp>0?tmp:0;let BB=Math.abs(tmp);if(i<6){a1=sumCloseA/(i+1);b1=(Math.abs(sumCloseB)+sumCloseA)/(i+1);}else{a1=(AA+5*oldA1)/6;b1=(BB+5*oldB1)/6;}oldA1=a1;oldB1=b1;rsi1=a1/b1*100;if(i<12){a2=sumCloseA/(i+1);b2=(Math.abs(sumCloseB)+sumCloseA)/(i+1);}else{a2=(AA+11*oldA2)/12;b2=(BB+11*oldB2)/12;}oldA2=a2;oldB2=b2;rsi2=a2/b2*100;if(i<24){a3=sumCloseA/(i+1);b3=(Math.abs(sumCloseB)+sumCloseA)/(i+1);}else{a3=(AA+23*oldA3)/24;b3=(BB+23*oldB3)/24;}oldA3=a3;oldB3=b3;rsi3=a3/b3*100;}data[i].rsi={rsi1,rsi2,rsi3};}return data;}/**
 * 计算BIAS指标
 *
 * @param data
 * @return
 */function calculationBias(data){// 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
// 参数：6，12、24
let bias1;let bias2;let bias3;let closes1=0;let closes2=0;let closes3=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;closes1+=closePrice;closes2+=closePrice;closes3+=closePrice;if(i<6){let mean6=closes1/(i+1);bias1=(closePrice-mean6)/mean6*100;}else{closes1-=data[i-6].close;let mean6=closes1/6;bias1=(closePrice-mean6)/mean6*100;}if(i<12){let mean12=closes2/(i+1);bias2=(closePrice-mean12)/mean12*100;}else{closes2-=data[i-12].close;let mean12=closes2/12;bias2=(closePrice-mean12)/mean12*100;}if(i<24){let mean24=closes3/(i+1);bias3=(closePrice-mean24)/mean24*100;}else{closes3-=data[i-24].close;let mean24=closes3/24;bias3=(closePrice-mean24)/mean24*100;}data[i].bias={bias1,bias2,bias3};}return data;}/**
 * 计算BRAR指标
 *
 * @param data
 * @return
 */function calculationBrar(data){// 参数是26。
// 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
// 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
// N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
// 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
let br=0;let ar=0;let hcy=0;let cyl=0;let ho=0;let ol=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let highestPrice=data[i].high;let lowestPrice=data[i].low;let openPrice=data[i].open;ho+=highestPrice-openPrice;ol+=openPrice-lowestPrice;if(i>25){ho-=data[i-26].high-data[i-26].open;ol-=data[i-26].open-data[i-26].low;}if(ol!==0){ar=ho/ol*100;}if(i>0){let preClosePrice=data[i-1].close;let highSubPreClose=highestPrice-preClosePrice;if(highSubPreClose<0){highSubPreClose=0;}hcy+=highSubPreClose;let preCloseSubLow=preClosePrice-lowestPrice;if(preCloseSubLow<0){preCloseSubLow=0;}cyl+=preCloseSubLow;if(cyl!==0){br=hcy/cyl*100;}}data[i].brar={br,ar};}return data;}/**
 * 计算CCI指标
 *
 * @param data
 * @return
 */function calculationCci(data){// 中价与 中价的N日内移动平均 的差 除以 N日内中价的平均绝对偏差
// 其中，中价等于最高价、最低价和收盘价之和除以3
// ={【79-（79+62+45+90+25）/5）】
// +【62-（79+62+45+90+25）/5）】
// +【45-（79+62+45+90+25）/5）】
// +【90-（79+62+45+90+25）/5）】
// +【25-（79+62+45+90+25）/5）】}/5
let TYPEs=0;let cci;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let TYP=(data[i].high+data[i].low+data[i].close)/3;TYPEs+=TYP;if(i>=13){let TYPEsMean=TYPEs/14;TYPEs-=(data[i-13].high+data[i-13].low+data[i-13].close)/3;let types=0;for(let j=i-13;j<i+1;j++){let typ=(data[j].high+data[j].low+data[j].close)/3;types+=Math.abs(typ-TYPEsMean);}let MD=types/14;if(MD===0){cci=0;}else{cci=200*(TYP-TYPEsMean)/3/MD;}}else{let TYPEsMean=TYPEs/(i+1);let types=0;for(let j=0;j<i+1;j++){let typ=(data[j].high+data[j].low+data[j].close)/3;types+=Math.abs(typ-TYPEsMean);}let MD=types/(i+1);if(MD===0){cci=0;}else{cci=200*(TYP-TYPEsMean)/3/MD;}}data[i].cci={cci};}return data;}/**
 * 计算DMI
 *
 * @param data
 * @return
 */function calculationDmi(data){// 参数 14，6
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
let pdi=0;let mdi=0;let adx=0;let adxr=0;let HD;let LD;let refClose;let sumMax=[];let sumMaxDmp=[];let sumMaxDmm=[];let sumAdx=[];let sumAdxr=[];let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i>0){refClose=data[i-1].close;HD=data[i].high-data[i-1].high;LD=data[i-1].low-data[i].low;let max1=data[i].high-data[i].low>Math.abs(data[i].high-refClose)?data[i].high-data[i].low:Math.abs(data[i].high-refClose);let max2=max1>Math.abs(refClose)-data[i].low?max1:Math.abs(refClose)-data[i].low;sumMax.push(max2);let H;if(HD>0&&HD>LD){H=HD;}else{H=0;}sumMaxDmp.push(H);let L;if(LD>0&&LD>HD){L=LD;}else{L=0;}sumMaxDmm.push(L);let sumMax1=0;let sumMaxDmp1=0;let sumMaxDmm1=0;for(let j=0;j<sumMax.length;j++){sumMax1+=sumMax[j];sumMaxDmp1+=sumMaxDmp[j];sumMaxDmm1+=sumMaxDmm[j];}let mtr=sumMax1;let dmp=sumMaxDmp1;let dmm=sumMaxDmm1;pdi=dmp*100/mtr;mdi=dmm*100/mtr;let adxN1=Math.abs(mdi-pdi)/(mdi+pdi)*100;sumAdx.push(adxN1);let sum=0;for(let j=0;j<sumAdx.length;j++){sum+=sumAdx[j];}adx=sum/6;sumAdxr.push(adx);let sum1=0;sum1+=sumAdxr[0];sum1+=sumAdxr[sumAdxr.length-1];adxr=sum1/2;if(i>=14){sumMax.remove(0);sumMaxDmp.remove(0);sumMaxDmm.remove(0);}if(i>=19){sumAdx.remove(0);}if(i>=25){sumAdxr.remove(0);}}data[i].dmi={pdi,mdi,adx,adxr};}return data;}/**
 * 计算CR
 *
 * @param data
 * @return
 */function calculationCr(data){// 参数26、10、20、40、60
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
let cr=0;let ma1;let ma2;let ma3;let ma4;let p1=0;let p2=0;let ma10Sum=0;let ma10;let ma10List=[];let ma20Sum=0;let ma20;let ma20List=[];let ma40Sum=0;let ma40;let ma40List=[];let ma60Sum=0;let ma60;let ma60List=[];let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i>0){let preHighestPrice=data[i-1].high;let preLowestPrice=data[i-1].low;let preClosePrice=data[i-1].close;let preOpenPrice=data[i-1].open;let preMidPrice=(preHighestPrice+preClosePrice+preLowestPrice+preOpenPrice)/4;let highestPrice=data[i].high;let lowestPrice=data[i].low;let highSubPreMid=highestPrice-preMidPrice;if(highSubPreMid<0){highSubPreMid=0;}p1+=highSubPreMid;let preMidSubLow=preMidPrice-lowestPrice;if(preMidSubLow<0){preMidSubLow=0;}p2+=preMidSubLow;if(i>26){let firstHighestPrice=data[i-27].high;let firstLowestPrice=data[i-27].low;let firstClosePrice=data[i-27].close;let firstOpenPrice=data[i-27].open;let firstMidPrice=(firstHighestPrice+firstLowestPrice+firstClosePrice+firstOpenPrice)/4;let secondHighestPrice=data[i-26].high;let secondLowestPrice=data[i-26].low;let secondHighSubFirstMid=secondHighestPrice-firstMidPrice;if(secondHighSubFirstMid<0){secondHighSubFirstMid=0;}let firstMidSubSecondLow=firstMidPrice-secondLowestPrice;if(firstMidSubSecondLow<0){firstMidSubSecondLow=0;}p1-=secondHighSubFirstMid;p2-=firstMidSubSecondLow;}if(p2!==0){cr=p1/p2*100;}let YM=(data[i-1].high+data[i-1].low+data[i-1].close)/3;let HYM=data[i].high-YM;p1+=HYM<=0?0:HYM;let LYM=YM-data[i].low;p2+=LYM<=0?0:LYM;}ma10Sum+=cr;ma20Sum+=cr;ma40Sum+=cr;ma60Sum+=cr;if(i<10){ma10=ma10Sum/(i+1);}else{ma10Sum-=data[i-10].cr.cr;ma10=ma10Sum/10;}ma10List.push(ma10);if(i<20){ma20=ma20Sum/(i+1);}else{ma20Sum-=data[i-20].cr.cr;ma20=ma20Sum/20;}ma20List.push(ma20);if(i<40){ma40=ma40Sum/(i+1);}else{ma40Sum-=data[i-40].cr.cr;ma40=ma40Sum/40;}ma40List.push(ma40);if(i<60){ma60=ma60Sum/(i+1);}else{ma60Sum-=data[i-60].cr.cr;ma60=ma60Sum/60;}ma60List.push(ma60);if(i<5){ma1=ma10List.get(0);}else{ma1=ma10List[i-5];}if(i<9){ma2=ma20List.get(0);}else{ma2=ma20List[i-9];}if(i<17){ma3=ma40List.get(0);}else{ma3=ma40List[i-17];}if(i<25){ma4=ma60List.get(0);}else{ma4=ma60List[i-25];}data[i].cr={cr,ma1,ma2,ma3,ma4};}return data;}/**
 * 计算PSY
 *
 * @param data
 * @return
 */function calculationPsy(data){// PSY：参数是12。公式：PSY=N日内的上涨天数/N×100%。
let psy=0;let upDay=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i>0){upDay+=data[i].close-data[i-1].close>0?1:0;if(i>=12){psy=upDay/12*100;upDay-=data[i-11].close-data[i-12].close>0?1:0;}else{psy=upDay/i*100;}}data[i].psy={psy};}return data;}/**
 * 计算DMA
 *
 * @param data
 * @return
 */function calculationDma(data){// 参数是10、50、10。公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
let dif;let difMa;let ma10s=0;let ma10;let ma50s=0;let ma50;let dif10s=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;ma10s+=closePrice;ma50s+=closePrice;if(i<10){ma10=ma10s/(i+1);}else{ma10s-=data[i-10].close;ma10=ma10s/10;}if(i<50){ma50=ma50s/(i+1);}else{ma50s-=data.get[i-50].close;ma50=ma50s/50;}dif=ma10-ma50;dif10s+=dif;if(i<10){difMa=dif10s/(i+1);}else{dif10s-=data[i-10].dma.dif;difMa=dif10s/10;}data[i].dma={dif,difMa};}return data;}/**
 * 计算TRIX
 *
 * @param data
 * @return
 */function calculationTrix(data){// TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
// TRIX=(TR-昨日TR)/昨日TR*100；
// MATRIX=TRIX的M日简单移动平均；
// 参数N设为12，参数M设为20；
// 参数12、20
// 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
// TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
// TRMA:MA(TRIX,M)
let trix=0;let maTrix;let sumTrix=0;let sumClose=0;let emaClose;let oldEmaClose=0;let sumEmaClose=0;let ema2;let oldEma2=0;let sumEma2=0;let ema3;let oldEma3=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;sumClose+=closePrice;if(i<12){emaClose=sumClose/(i+1);}else{emaClose=(closePrice*2+oldEmaClose*11)/13;}oldEmaClose=emaClose;sumEmaClose+=emaClose;if(i<12){ema2=sumEmaClose/(i+1);}else{ema2=(emaClose*2+oldEma2*11)/13;}oldEma2=ema2;sumEma2+=ema2;if(i<12){ema3=sumEma2/(i+1);}else{ema3=(ema2*2+oldEma3*11)/13;}if(oldEma3!==0){trix=(ema3-oldEma3)/oldEma3*100;}sumTrix+=trix;oldEma3=ema3;if(i<20){maTrix=sumTrix/(i+1);}else{maTrix=sumTrix/20;sumTrix-=data[i-19].trix.trix;}data[i].trix={trix,maTrix};}return data;}/**
 * 计算obv指标
 * 计算公式： V × [（C - L）- （H - C）]/（H - C）
 * V: 成交量, C: 收盘价， L: 最低价, H: 最高价
 * @param data
 * @return
 */function calculationObv(data){let sumObv=0;let maObv;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;let highestPrice=data[i].high;let highSubClose=highestPrice-closePrice;let obv=data[i].volume*(closePrice-data[i].low-highSubClose)/highestPrice;sumObv+=obv;if(i<30){maObv=sumObv/(i+1);}else{sumObv=sumObv-data[i-30].obv.obv;maObv=sumObv/30;}data[i].obv={obv,maObv};}return data;}/**
 * 计算vr指标
 * 默认参数24 ， 30
 * VR=（AVS+1/2CVS）/（BVS+1/2CVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为AVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为BVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为CVS
 * @param data
 * @return
 */function calculationVr(data){let avs=0;let bvs=0;let cvs=0;let vr=0;let maVr;let sumVr=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i<24){let closePrice=data[i].close;let openPrice=data[i].open;let volume=data[i].volume;if(closePrice>openPrice){avs+=volume;}else if(closePrice<openPrice){bvs+=volume;}else{cvs+=volume;}}else{for(let j=i-24;j<i;j++){let closePrice=data[j].close;let openPrice=data[j].open;let volume=data[j].volume;if(j===i-24){avs=0;bvs=0;cvs=0;}if(closePrice>openPrice){avs+=volume;}else if(closePrice<openPrice){bvs+=volume;}else{cvs+=volume;}}}let v=bvs+1/2*cvs;if(v!==0){vr=(avs+1/2*cvs)/v*100;}sumVr+=vr;if(i<30){maVr=sumVr/(i+1);}else{sumVr-=data[i-30].vr.vr;maVr=sumVr/30;}data[i].vr={vr,maVr};}return data;}/**
 * 计算wr指标
 * 默认参数13 34 89
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 * @param data
 * @return
 */function calculationWr(data){let wr1=0;let wr2=0;let wr3=0;let wr1HighestPrice=Number.MIN_VALUE;let wr1LowestPrice=Number.MAX_VALUE;let wr2HighestPrice=Number.MIN_VALUE;let wr2LowestPrice=Number.MAX_VALUE;let wr3HighestPrice=Number.MIN_VALUE;let wr3LowestPrice=Number.MAX_VALUE;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;if(i<13){let highPrice=data[i].high;let lowPrice=data[i].low;wr1HighestPrice=Math.max(highPrice,wr1HighestPrice);wr1LowestPrice=Math.min(lowPrice,wr1LowestPrice);wr2HighestPrice=Math.max(highPrice,wr2HighestPrice);wr2LowestPrice=Math.min(lowPrice,wr2LowestPrice);wr3HighestPrice=Math.max(highPrice,wr3HighestPrice);wr3LowestPrice=Math.min(lowPrice,wr3LowestPrice);let highSubLow=wr1HighestPrice-wr1LowestPrice;if(highSubLow!==0){wr1=(wr1HighestPrice-closePrice)/highSubLow*100;}wr2=wr1;wr3=wr1;}else{for(let j=i-13;j<i;j++){if(j===i-13){wr1HighestPrice=data[j].high;wr1LowestPrice=data[j].low;}else{wr1HighestPrice=Math.max(data[j].high,wr1HighestPrice);wr1LowestPrice=Math.min(data[j].low,wr1LowestPrice);}let highSubLow=wr1HighestPrice-wr1LowestPrice;if(highSubLow!==0){wr1=(wr1HighestPrice-closePrice)/highSubLow*100;}}if(i<34){let highPrice=data[i].high;let lowPrice=data[i].low;wr2HighestPrice=Math.max(highPrice,wr2HighestPrice);wr2LowestPrice=Math.min(lowPrice,wr2LowestPrice);wr3HighestPrice=Math.max(highPrice,wr3HighestPrice);wr3LowestPrice=Math.min(lowPrice,wr3LowestPrice);let highSubLow=wr2HighestPrice-wr2LowestPrice;if(highSubLow!==0){wr2=(wr2HighestPrice-closePrice)/highSubLow*100;}wr3=wr2;}else{for(let j=i-34;j<i;j++){if(j===i-34){wr2HighestPrice=data[j].high;wr2LowestPrice=data[j].low;}else{wr2HighestPrice=Math.max(data[j].high,wr2HighestPrice);wr2LowestPrice=Math.min(data[j].low,wr2LowestPrice);}let highSubLow=wr2HighestPrice-wr2LowestPrice;if(highSubLow!==0){wr2=(wr2HighestPrice-closePrice)/highSubLow*100;}}if(i<89){let highPrice=data[i].high;let lowPrice=data[i].low;wr3HighestPrice=Math.max(highPrice,wr3HighestPrice);wr3LowestPrice=Math.min(lowPrice,wr3LowestPrice);let highSubLow=wr3HighestPrice-wr3LowestPrice;if(highSubLow!==0){wr3=(wr3HighestPrice-closePrice)/highSubLow*100;}}else{for(let j=i-89;j<i;j++){if(j===i-89){wr3HighestPrice=data[j].high;wr3LowestPrice=data[j].low;}else{wr3HighestPrice=Math.max(data[j].high,wr3HighestPrice);wr3LowestPrice=Math.min(data[j].low,wr3LowestPrice);}let highSubLow=wr3HighestPrice-wr3LowestPrice;if(highSubLow!==0){wr3=(wr3HighestPrice-closePrice)/highSubLow*100;}}}}}data[i].wr={wr1,wr2,wr3};}return data;}/**
 * 计算mtm指标
 * 默认参数6 10
 * 公式 MTM（N日）=C－CN
 * @param data
 * @return
 */function calculationMtm(data){let mtm;let mtmSum=0;let mtmMa;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}let closePrice=data[i].close;if(i<6){mtm=closePrice-data[0].close;}else{mtm=closePrice-data[i-6].close;}mtmSum+=mtm;if(i<10){mtmMa=mtmSum/(i+1);}else{mtmSum-=data[i-10].mtm.mtm;mtmMa=mtmSum/10;}data[i].mtm={mtm,mtmMa};}return data;}/**
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
 */function calculationEmv(data){let emv=0;let maEmv;let sumEmv=0;let em=0;let emList=[];let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}if(i>0){let highestPrice=data[i].high;let lowestPrice=data[i].low;let preHighestPrice=data[i-1].high;let preLowestPrice=data[i-1].low;let highSubLow=highestPrice-lowestPrice;let halfHighAddLow=(highestPrice+lowestPrice)/2;let preHalfHighAddLow=(preHighestPrice+preLowestPrice)/2;em=(halfHighAddLow-preHalfHighAddLow)*highSubLow/turnover;}emList.push(em);if(i<14){emv+=em;}else{emv-=emList[i-14];}sumEmv+=emv;if(i<9){maEmv=sumEmv/(i+1);}else{sumEmv-=data[i-9].emv.emv;maEmv=sumEmv/9;}data[i].emv={emv,maEmv};}return data;}/**
 * 计算sar
 * @param data
 * @return
 */function calculationSar(data){// 加速因子
let af=0;// 极值
let ep=-100;// 判断是上涨还是下跌  false：下跌
let isIncreasing=false;let sar=0;let totalTurnover=0;let totalVolume=0;for(let i=0;i<data.length;i++){let turnover=data[i].turnover;totalVolume+=data[i].volume;totalTurnover+=turnover;if(totalVolume!==0){data[i].averagePrice=totalTurnover/totalVolume;}// 上一个周期的sar
let preSar=sar;let highestPrice=data[i].high;let lowestPrice=data[i].low;if(isIncreasing){// 上涨
if(ep===-100||ep<highestPrice){// 重新初始化值
ep=highestPrice;af=Math.min(af+0.02,2);}sar=preSar+af*(ep-preSar);let lowestPriceMin=Math.min(data[Math.max(1,i)-1].low,lowestPrice);if(sar>data[i].low){sar=ep;// 重新初始化值
af=0;ep=-100;isIncreasing=!isIncreasing;}else if(sar>lowestPriceMin){sar=lowestPriceMin;}}else{if(ep===-100||ep>lowestPrice){// 重新初始化值
ep=lowestPrice;af=Math.min(af+0.02,0.2);}sar=preSar+af*(ep-preSar);let highestPriceMax=Math.max(data[Math.max(1,i)-1].high,highestPrice);if(sar<data[i].high){sar=ep;// 重新初始化值
af=0;ep=-100;isIncreasing=!isIncreasing;}else if(sar<highestPriceMax){sar=highestPriceMax;}}data[i].sar={sar};}return data;}/**
 * 计算布林指标中的标准差
 *
 * @param list
 * @param ma
 * @return
 */function getBollMd(list,ma){let sum=0;for(let i=0;i<list.length;i++){let closeMa=list[i].close-ma;sum+=closeMa*closeMa;}let b=sum>0;sum=Math.abs(sum);let md=Math.sqrt(sum/list.length);return b?md:-1*md;}/**
 * 获取list中的最大的最高价
 *
 * @param list
 * @return
 */function getHigh(list){let high=0;if(list&&list.length>0){let size=list.length;high=list[0].high;for(let i=1;i<size;i++){high=Math.max(list[i].high,high);}}return high;}/**
 * 获取list中的最小的最低价
 *
 * @param list
 * @return
 */function getLow(list){let low=0;if(list&&list.length>0){let size=list.length;low=list[0].low;for(let i=1;i<size;i++){low=Math.min(list[i].low,low);}}return low;}
// CONCATENATED MODULE: ./src/chart/KLineChart.js
const isMobile=/Android|webOS|iPhone|iPod|BlackBerry|UCBrowser/i.test(navigator.userAgent);class KLineChart_KLineChart{constructor(dom){this.rootDom=dom;this.domWidth=0;this.domHeight=0;this.canvas=null;this.canvasDom=null;this.viewPortHandler=new internal_ViewPortHandler();this.dataBounds=new internal_DataBounds(this.viewPortHandler);this.grid=new component_Grid();this.yAxis=new component_YAxis();this.xAxis=new component_XAxis();this.candle=new component_Candle();this.indicator=new component_Indicator();this.tooltip=new component_Tooltip();this.gridChart=new chart_GridChart(this.grid,this.dataBounds,this.viewPortHandler);this.candleChart=new chart_CandleChart(this.candle,this.indicator,this.yAxis,this.dataBounds,this.viewPortHandler);this.volChart=new chart_IndicatorChart(this.indicator,this.xAxis,this.yAxis,this.dataBounds,this.viewPortHandler,IndicatorType.VOL);this.indicatorChart=new chart_IndicatorChart(this.indicator,this.xAxis,this.yAxis,this.dataBounds,this.viewPortHandler);this.xAxisChart=new chart_XAxisChart(this.xAxis,this.dataBounds,this.viewPortHandler);this.tooltipChart=new chart_TooltipChart(this.tooltip,this.candle,this.indicator,this.yAxis,this.candleChart,this.volChart,this.indicatorChart,this.dataBounds,this.viewPortHandler);this.motionEvent=isMobile?new event_TouchEvent(this,this.dataBounds,this.viewPortHandler):new event_MouseEvent(this,this.dataBounds,this.viewPortHandler);// 是否需要计算整个绘图区域的尺寸
this.isShouldCalcOffset=true;// 是否需要计算图的高度
this.isShouldCalcChartHeight=true;this.init();}/**
   * 初始化
   * @param dom
   */init(){this.canvasDom=document.createElement('canvas');try{if(isMobile){this.canvasDom.addEventListener('touchstart',e=>{this.motionEvent.touchStart(e);},false);this.canvasDom.addEventListener('touchmove',e=>{this.motionEvent.touchMove(e);},false);this.canvasDom.addEventListener('touchend',e=>{this.motionEvent.touchEnd(e);},false);}else{this.canvasDom.addEventListener('mousedown',e=>{this.motionEvent.mouseDown(e);});this.canvasDom.addEventListener('mouseup',e=>{this.motionEvent.mouseUp(e);});this.canvasDom.addEventListener('mousemove',e=>{this.motionEvent.mouseMove(e);});this.canvasDom.addEventListener('mouseleave',e=>{this.motionEvent.mouseLeave(e);});// IE9, Chrome, Safari, Opera
this.canvasDom.addEventListener('mousewheel',e=>{this.motionEvent.mouseWheel(e);},false);// Firefox
this.canvasDom.addEventListener('DOMMouseScroll',e=>{this.motionEvent.mouseWheel(e);},false);}}catch(e){}this.rootDom.appendChild(this.canvasDom);this.resize();}/**
   * 改变尺寸
   */resize(){this.isShouldCalcOffset=true;this.domWidth=this.rootDom.offsetWidth*2;this.domHeight=this.rootDom.offsetHeight*2;this.canvasDom.style.width=this.rootDom.offsetWidth+'px';this.canvasDom.style.height=this.rootDom.offsetHeight+'px';this.freshen();}/**
   * 设置配置
   * @param config
   */setConfig(config){if(config){let common=config.common;if(common){if(common.minVisibleRange>0){this.dataBounds.minRange=common.minVisibleRange;}if(common.maxVisibleRange>0&&common.maxVisibleRange>this.dataBounds.minRange){this.dataBounds.maxRange=common.maxVisibleRange;}if(common.defaultVisibleRange>0&&common.defaultVisibleRange>this.dataBounds.minRange-1&&common.defaultVisibleRange<this.dataBounds.maxRange+1){this.dataBounds.range=common.defaultVisibleRange;}}let grid=config.grid;if(grid){this.grid.display=grid.display;if(grid.lineSize>0){this.grid.lineSize=grid.lineSize;}if(grid.lineColor){this.grid.lineColor=grid.lineColor;}}let candle=config.candle;if(candle){if(candle.chartType){this.candle.chartStyle=candle.chartType;}if(candle.timeChart){this.candle.timeChart={...this.candle.timeChart,...candle.timeChart};}if(candle.candleChart){this.candle.candleChart={...this.candle.candleChart,...candle.candleChart};}if(candle.lowestHighestPriceMarkTextColor){this.candle.lowestHighestPriceMarkTextColor=candle.lowestHighestPriceMarkTextColor;}if(candle.lowestHighestPriceMarkTextSize>0){this.candle.lowestHighestPriceMarkTextSize=candle.lowestHighestPriceMarkTextSize;}this.candle.lowestHighestValueFormatter=candle.lowestHighestValueFormatter;if(candle.highestPriceMark){this.candle.highestPriceMark={...this.candle.highestPriceMark,...candle.highestPriceMark};}if(candle.lowestPriceMark){this.candle.lowestPriceMark={...this.candle.lowestPriceMark,...candle.lowestPriceMark};}if(candle.lastPriceMark){this.candle.lastPriceMark={...this.candle.lastPriceMark,...candle.lastPriceMark};}}let indicator=config.indicator;if(indicator){if(indicator.lineSize>0){this.indicator.lineSize=indicator.lineSize;}if(indicator.increasingColor){this.indicator.increasingColor=indicator.increasingColor;}if(indicator.decreasingColor){this.indicator.decreasingColor=indicator.decreasingColor;}if(indicator.lineColors&&indicator.lineColors.length>4){this.indicator.lineColors=indicator.lineColors;}}let xAxis=config.xAxis;if(xAxis){this.xAxis.display=xAxis.display;if(this.xAxis.color){this.xAxis.color=xAxis.color;}if(xAxis.minHeight>=0){this.xAxis.xAxisMinHeight=xAxis.minHeight;}if(xAxis.maxHeight>=0&&xAxis.maxHeight>=this.xAxis.xAxisMinHeight){this.xAxis.xAxisMaxHeight=xAxis.maxHeight;}if(xAxis.axisLine){this.xAxis.axisLine={...this.xAxis.axisLine,...xAxis.axisLine};}if(xAxis.tickText){this.xAxis.tickText={...this.xAxis.tickText,...xAxis.tickText};}if(xAxis.tickLine){this.xAxis.tickLine={...this.xAxis.tickLine,...xAxis.tickLine};}if(xAxis.separatorLine){this.xAxis.separatorLine={...this.xAxis.separatorLine,...xAxis.separatorLine};}}let yAxis=config.yAxis;if(yAxis){this.yAxis.display=yAxis.display;if(yAxis.position){this.yAxis.yAxisPosition=yAxis.position;this.isShouldCalcOffset=true;}if(this.yAxis.color){this.yAxis.color=yAxis.color;}if(yAxis.minWidth>=0){this.yAxis.yAxisMinWidth=yAxis.minWidth;}if(yAxis.maxWidth>=0&&yAxis.maxWidth>=this.yAxis.yAxisMinWidth){this.yAxis.yAxisMaxWidth=yAxis.maxWidth;}if(yAxis.axisLine){this.yAxis.axisLine={...this.yAxis.axisLine,...yAxis.axisLine};}if(yAxis.tickText){this.yAxis.tickText={...this.yAxis.tickText,...yAxis.tickText};this.isShouldCalcOffset=true;}if(yAxis.tickLine){this.yAxis.tickLine={...this.yAxis.tickLine,...yAxis.tickLine};}if(yAxis.separatorLine){this.yAxis.separatorLine={...this.yAxis.separatorLine,...yAxis.separatorLine};}}let tooltip=config.tooltip;if(tooltip){if(tooltip.textSize>0){this.tooltip.textSize=tooltip.textSize;}if(tooltip.crossLine){if(tooltip.crossLine.text){tooltip.crossLine.text={...this.tooltip.crossLine.text,...tooltip.crossLine.text};}this.tooltip.crossLine={...this.tooltip.crossLine,...tooltip.crossLine};}if(tooltip.generalData){if(tooltip.generalData.text){tooltip.generalData.text={...this.tooltip.generalData.text,...tooltip.generalData.text};}this.tooltip.generalData={...this.tooltip.generalData,...tooltip.generalData};}if(tooltip.indicatorData){if(tooltip.indicatorData.text){tooltip.indicatorData.text={...this.tooltip.indicatorData.text,...tooltip.indicatorData.text};}this.tooltip.indicatorData={...this.tooltip.indicatorData,...tooltip.indicatorData};}}this.freshen();}}/**
   * 计算图表高度
   */calcChartHeight(domHeight){let xChartHeight=this.xAxis.getRequiredHeightSpace();let chartHeight=domHeight-xChartHeight;let isDisplayVolChart=this.isDisplayVolChart();let isDisplayIndicatorChart=this.isDisplayIndicatorChart();let volChartHeight=0;let indicatorChartHeight=0;if(isDisplayVolChart&&isDisplayIndicatorChart){let height=chartHeight*0.2;volChartHeight=height;indicatorChartHeight=height;}else if(isDisplayVolChart&&!isDisplayIndicatorChart){volChartHeight=chartHeight*0.3;}else if(!isDisplayVolChart&&isDisplayIndicatorChart){indicatorChartHeight=chartHeight*0.3;}let candleChartHeight=chartHeight-volChartHeight-indicatorChartHeight;let contentTop=0;this.candleChart.setChartDimens(candleChartHeight,contentTop);contentTop+=candleChartHeight;this.volChart.setChartDimens(volChartHeight,contentTop);contentTop+=volChartHeight;this.indicatorChart.setChartDimens(indicatorChartHeight,contentTop);contentTop+=indicatorChartHeight;this.xAxisChart.setChartDimens(xChartHeight,contentTop);}/**
   * 计算不包括x轴y轴的绘制区域的尺寸
   */calcOffsets(){let offsetLeft=0;let offsetRight=0;let offsetTop=0;let offsetBottom=0;if(this.yAxis.needsOffset()){// 计算y轴最大宽度
let yAxisRequireWidthSpace=this.yAxis.getRequiredWidthSpace();if(this.yAxis.yAxisPosition===YAxisPosition.LEFT){offsetLeft+=yAxisRequireWidthSpace;}else{offsetRight+=yAxisRequireWidthSpace;}}let requireXAxisHeight=this.xAxis.getRequiredHeightSpace();offsetBottom+=requireXAxisHeight;this.viewPortHandler.restrainViewPort(offsetLeft,offsetTop,offsetRight,offsetBottom);}/**
   * 刷新
   */freshen(){this.canvasDom.width=this.domWidth;this.canvasDom.height=this.domHeight;this.canvas=this.canvasDom.getContext('2d');if(this.isShouldCalcChartHeight){this.calcChartHeight(this.domHeight);this.isShouldCalcChartHeight=false;}if(this.isShouldCalcOffset){this.viewPortHandler.setChartDimens(this.domWidth,this.domHeight);this.calcOffsets();this.isShouldCalcOffset=false;}this.draw();}/**
   * 绘制
   */draw(){this.dataBounds.space();this.gridChart.draw(this.canvas);this.xAxisChart.draw(this.canvas);this.candleChart.draw(this.canvas);this.volChart.draw(this.canvas);this.indicatorChart.draw(this.canvas);this.tooltipChart.draw(this.canvas);}/**
   * 计算指标数据
   * @param indicatorType Int
   */calcIndicator(indicatorType){switch(indicatorType){case IndicatorType.MA:{this.dataBounds.dataList=calculationMa(this.dataBounds.dataList);break;}case IndicatorType.MACD:{this.dataBounds.dataList=calculationMacd(this.dataBounds.dataList);break;}case IndicatorType.VOL:{this.dataBounds.dataList=calculationVol(this.dataBounds.dataList);break;}case IndicatorType.BOLL:{this.dataBounds.dataList=calculationBoll(this.dataBounds.dataList);break;}case IndicatorType.BIAS:{this.dataBounds.dataList=calculationBias(this.dataBounds.dataList);break;}case IndicatorType.BRAR:{this.dataBounds.dataList=calculationBrar(this.dataBounds.dataList);break;}case IndicatorType.CCI:{this.dataBounds.dataList=calculationCci(this.dataBounds.dataList);break;}case IndicatorType.CR:{this.dataBounds.dataList=calculationCr(this.dataBounds.dataList);break;}case IndicatorType.DMA:{this.dataBounds.dataList=calculationDma(this.dataBounds.dataList);break;}case IndicatorType.DMI:{this.dataBounds.dataList=calculationDmi(this.dataBounds.dataList);break;}case IndicatorType.KDJ:{this.dataBounds.dataList=calculationKdj(this.dataBounds.dataList);break;}case IndicatorType.KD:{this.dataBounds.dataList=calculationKdj(this.dataBounds.dataList);break;}case IndicatorType.RSI:{this.dataBounds.dataList=calculationRsi(this.dataBounds.dataList);break;}case IndicatorType.PSY:{this.dataBounds.dataList=calculationPsy(this.dataBounds.dataList);break;}case IndicatorType.TRIX:{this.dataBounds.dataList=calculationTrix(this.dataBounds.dataList);break;}case IndicatorType.OBV:{this.dataBounds.dataList=calculationObv(this.dataBounds.dataList);break;}case IndicatorType.VR:{this.dataBounds.dataList=calculationVr(this.dataBounds.dataList);break;}case IndicatorType.WR:{this.dataBounds.dataList=calculationWr(this.dataBounds.dataList);break;}case IndicatorType.MTM:{this.dataBounds.dataList=calculationMtm(this.dataBounds.dataList);break;}case IndicatorType.EMV:{this.dataBounds.dataList=calculationEmv(this.dataBounds.dataList);break;}case IndicatorType.SAR:{this.dataBounds.dataList=calculationSar(this.dataBounds.dataList);break;}}}/**
   * 计算各图指标
   */calcChartIndicator(){if(this.candleChart.isDisplayChart()){this.calcIndicator(this.candleChart.indicatorType);}if(this.isDisplayVolChart()){this.calcIndicator(IndicatorType.VOL);}if(this.isDisplayIndicatorChart()){this.calcIndicator(this.indicatorChart.indicatorType);}this.freshen();}/**
   * 设置数据
   * @param dataList
   */setDataList(dataList){this.dataBounds.dataList=dataList;this.dataBounds.moveToLast();this.calcChartIndicator();this.freshen();}/**
   * 设置主指标类型
   * @param indicatorType
   */setMainIndicatorType(indicatorType){if(this.candleChart.indicatorType!==indicatorType){this.candleChart.indicatorType=indicatorType;this.calcIndicator(indicatorType);this.freshen();}}/**
   * 设置副指标类型
   * @param indicatorType
   */setSubIndicatorType(indicatorType){if(this.indicatorChart.indicatorType!==indicatorType){let shouldCalcChartHeight=this.isDisplayIndicatorChart()&&indicatorType===IndicatorType.NO||!this.isDisplayIndicatorChart()&&indicatorType!==IndicatorType.NO;this.indicatorChart.indicatorType=indicatorType;if(shouldCalcChartHeight){this.isShouldCalcChartHeight=true;}this.calcIndicator(indicatorType);this.freshen();}}/**
   * 设置是否显示vol指标
   * @param isShow Boolean
   */setShowVolIndicatorChart(isShow){if(this.isDisplayVolChart()!==isShow){if(isShow){this.volChart.indicatorType=IndicatorType.VOL;this.calcIndicator(IndicatorType.VOL);}else{this.volChart.indicatorType=IndicatorType.NO;}this.isShouldCalcChartHeight=true;this.freshen();}}isDisplayVolChart(){return this.volChart.isDisplayChart();}isDisplayIndicatorChart(){return this.indicatorChart.isDisplayChart();}}/* harmony default export */ var chart_KLineChart = (KLineChart_KLineChart);
// CONCATENATED MODULE: ./src/kline.js
/* concated harmony reexport LineStyle */__webpack_require__.d(__webpack_exports__, "LineStyle", function() { return LineStyle; });
/* concated harmony reexport ChartStyle */__webpack_require__.d(__webpack_exports__, "ChartStyle", function() { return ChartStyle; });
/* concated harmony reexport CandleStyle */__webpack_require__.d(__webpack_exports__, "CandleStyle", function() { return CandleStyle; });
/* concated harmony reexport IndicatorType */__webpack_require__.d(__webpack_exports__, "IndicatorType", function() { return IndicatorType; });
/* concated harmony reexport YAxisTextPosition */__webpack_require__.d(__webpack_exports__, "YAxisTextPosition", function() { return YAxisTextPosition; });
/* concated harmony reexport YAxisPosition */__webpack_require__.d(__webpack_exports__, "YAxisPosition", function() { return YAxisPosition; });
/* concated harmony reexport IndicatorDisplayRule */__webpack_require__.d(__webpack_exports__, "IndicatorDisplayRule", function() { return IndicatorDisplayRule; });
const kline={init(dom){return new chart_KLineChart(dom);},version(){return "1.0.0";}};/* harmony default export */ var src_kline = __webpack_exports__["default"] = (kline);

/***/ })
/******/ ]);
});
//# sourceMappingURL=kline.development.js.map