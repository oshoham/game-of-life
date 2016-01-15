import Grid from './grid';
import { DEAD, ALIVE } from './constants';
import requestAnimationFrame from './request-animation-frame';

var twgl = require('../node_modules/twgl.js');
var glslify = require('glslify');

export default class GameOfLife {
  constructor ({ canvas }) {
    /*

    this.grid.set(25, 40, ALIVE);
    this.grid.set(24, 40, ALIVE);
    this.grid.set(24, 41, ALIVE);
    this.grid.set(25, 39, ALIVE);
    this.grid.set(26, 40, ALIVE);

    */

    var vertexShader = glslify('../shaders/vertex.glsl');
    var fragmentShader = glslify('../shaders/fragment.glsl');

    var glArrays = {
      position: {
        numComponents: 3,
        data: [
          // triangle covering lower left half of the screen
          -1, -1, 0,
           1, -1, 0,
          -1, 1, 0,
          // triangle covering upper right half of screen
          -1, 1, 0,
           1, -1, 0,
           1, 1, 0
        ]
      }
    };

    this.gl = twgl.getWebGLContext(canvas);
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);

    this.glProgramInfo = twgl.createProgramInfo(this.gl, [vertexShader, fragmentShader]);
    this.glBufferInfo = twgl.createBufferInfoFromArrays(this.gl, glArrays);

    this.height = this.gl.canvas.height;
    this.width = this.gl.canvas.width;

    this.grid = new Grid(this.height, this.width);
    this.nextGrid = new Grid(this.height, this.width);
  }

  run () {
    requestAnimationFrame(this.render);
  }

  render (time) {
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // TODO: handle grid resize here

    this.updateGrid();

    var uniforms = {
      time: time * 0.00025,
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      state: this.grid.reduce((a, b) => a.concat(b), [])
    };

    this.gl.useProgram(this.glProgramInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.glProgramInfo, this.glBufferInfo);
    twgl.setUniforms(this.glProgramInfo, uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.glBufferInfo);

    requestAnimationFrame(this.render);
  }

  updateGrid () {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
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
