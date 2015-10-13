import { ALIVE } from './constants';

const BORDER_COLOR = 'green';
const ALIVE_COLOR = 'red';
const DEAD_COLOR = 'black';

export default class Renderer {
  constructor ({ gridHeight, gridWidth, windowHeight, windowWidth, elementToRenderTo }) {
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.windowHeight = windowHeight;
    this.windowWidth = windowWidth;
    this.elementToRenderTo = elementToRenderTo;

    this.tileHeight = windowHeight/gridHeight;
    this.tileWidth =  windowWidth/gridWidth;

    this.two = new Two({ fullscreen: true, type: Two.Types.webgl }).appendTo(elementToRenderTo);

    var tiles = [];
    for (let x = 0; x < gridWidth; x++) {
      tiles[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        tiles[x][y] = this.two.makeRectangle(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
      }
    }
    this.tiles = tiles;
  }

  bind (event, callback) {
    return this.two.bind(event, callback);
  }

  play () {
    return this.two.play();
  }

  updateCellColors (grid) {
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        let rect = this.tiles[x][y];
        rect.fill = grid.get(x, y) === ALIVE ? ALIVE_COLOR : DEAD_COLOR;
        rect.stroke = BORDER_COLOR;
        rect.linewidth = 1;
        rect.opacity = 0.75;
      }
    }
  }
}
