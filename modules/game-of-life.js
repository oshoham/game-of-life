import Grid from './grid';
import Renderer from './renderer';
import { DEAD, ALIVE } from './constants';

export default class GameOfLife {
  constructor ({ gridHeight, gridWidth, windowHeight, windowWidth, elementToRenderTo }) {
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;

    this.grid = new Grid(gridHeight, gridWidth);
    this.nextGrid = new Grid(gridHeight, gridWidth);

    this.renderer = new Renderer({
      gridHeight: gridHeight,
      gridWidth: gridWidth,
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      elementToRenderTo: elementToRenderTo
    });

    this.grid.set(25, 40, ALIVE);
    this.grid.set(24, 40, ALIVE);
    this.grid.set(24, 41, ALIVE);
    this.grid.set(25, 39, ALIVE);
    this.grid.set(26, 40, ALIVE);
  }

  run () {
    this.renderer.bind('update', () => {
      this.updateGrid();
      this.renderer.updateCellColors(this.grid);
    }).play();
  }

  updateGrid () {
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        this.updateCell(x, y);
      }
    }

    // re-use grid as nextGrid
    this.swapGrids();
  }

  updateCell (x, y) {
    var numberOfLiveNeighbors = this.grid.numberOfLiveNeighbors(x, y);

    if (numberOfLiveNeighbors >= 4) {
      this.nextGrid.set(x, y, DEAD);
    } else if (numberOfLiveNeighbors === 3) {
      this.nextGrid.set(x, y, ALIVE);
    } else if (numberOfLiveNeighbors === 2) {
      let currentValue = this.grid.get(x, y);
      this.nextGrid.set(x, y, currentValue);
    } else if (numberOfLiveNeighbors <= 1) {
      this.nextGrid.set(x, y, DEAD);
    }
  }

  swapGrids () {
    var temp = this.grid;
    this.grid = this.nextGrid;
    this.nextGrid = temp;
  }
}
