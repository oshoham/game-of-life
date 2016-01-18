import Grid from './grid';
import { DEAD, ALIVE } from './constants';
import { requestAnimationFrame } from './utils';

var twgl = require('twgl.js');
var glslify = require('glslify');

export default class GameOfLife {
  constructor ({ canvas }) {
    var vertexShader = glslify('./shaders/vertex.glsl');
    var fragmentShader = glslify('./shaders/fragment.glsl');

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

    this.gl.canvas.addEventListener('mousedown', this.mouseDownListener.bind(this), false);
  }

  run () {
    requestAnimationFrame(this.render.bind(this));
  }

  render (time) {
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // TODO: handle grid resize here
    // maybe use bilinear interpolation to resize properly?

    //this.updateGrid();

    var textures = twgl.createTextures(this.gl, {
      state: {
        src: this.grid.toRGBAColorArray(),
        width: this.width
      }
    });

    var uniforms = {
      state: textures.state
    };

    this.gl.useProgram(this.glProgramInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.glProgramInfo, this.glBufferInfo);
    twgl.setUniforms(this.glProgramInfo, uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.glBufferInfo);

    requestAnimationFrame(this.render.bind(this));
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

  toggleCell (x, y) {
    var currentState = this.grid.get(x, y);
    var newState = currentState === ALIVE ? DEAD : ALIVE;
    this.grid.set(x, y, newState);
  }

  mouseDownListener (evt) {
    var boundingRect = this.gl.canvas.getBoundingClientRect();
    var mousePosition = {
      x: evt.clientX - boundingRect.left,
      y: evt.clientY - boundingRect.top
    };

    this.toggleCell(mousePosition.x, mousePosition.y);

    this.gl.canvas.removeEventListener('mousedown', this.mouseDownListener.bind(this), false);
    window.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
    window.addEventListener('mouseup', this.mouseUpListener.bind(this), false);
  }

  mouseMoveListener (evt) {
    var boundingRect = this.gl.canvas.getBoundingClientRect();
    var mousePosition = {
      x: evt.clientX - boundingRect.left,
      y: evt.clientY - boundingRect.top
    };

    this.toggleCell(mousePosition.x, mousePosition.y);
  }

  mouseUpListener (evt) {
    this.gl.canvas.addEventListener('mousedown', this.mouseDownListener.bind(this), false);
    window.removeEventListener('mousemove', this.mouseMoveListener.bind(this), false);
    window.removeEventListener('mouseup', this.mouseUpListener.bind(this), false);
  }
}
