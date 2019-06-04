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
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop() + 0.5)
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop() + 0.5)
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom() + 0.5)
    canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom() + 0.5)
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentLeft() + 0.5, this.viewPortHandler.contentTop())
    canvas.lineTo(this.viewPortHandler.contentLeft() + 0.5, this.viewPortHandler.contentBottom())
    canvas.stroke()
    canvas.closePath()

    canvas.beginPath()
    canvas.moveTo(this.viewPortHandler.contentRight() - 0.5, this.viewPortHandler.contentTop())
    canvas.lineTo(this.viewPortHandler.contentRight() - 0.5, this.viewPortHandler.contentBottom())
    canvas.stroke()
    canvas.closePath()
  }
}

export default GridChart
