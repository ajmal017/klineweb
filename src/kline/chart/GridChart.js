import Chart from './Chart'

class GridChart extends Chart {
  constructor (grid, dataBounds, viewPortHandler) {
    super(dataBounds, viewPortHandler)
    this.grid = grid
  }

  draw (canvas) {
    if (!this.grid.display) {
      return
    }
    canvas.strokeStyle = this.grid.lineColor
    canvas.lineWidth = this.grid.lineSize
    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop())
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop())
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom())
    canvas.lineTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom())
    canvas.lineTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop())
    canvas.stroke()
    canvas.closePath()
  }
}

export default GridChart
