import GameOfLife from './game-of-life';
import { gcd } from './utils';

var $ = require('../node_modules/jquery');

$(function () {
  var elem = document.getElementById('draw-container');
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var windowGCD = gcd(windowWidth, windowHeight);
  var aspectRatioNumerator = windowWidth / windowGCD;
  var aspectRatioDenominator = windowHeight / windowGCD;

  var gridWidth = 80;
  var gridHeight = 45;

  var gameOfLife = new GameOfLife({
    gridHeight: gridHeight,
    gridWidth: gridWidth,
    windowHeight: windowHeight,
    windowWidth: windowWidth,
    elementToRenderTo: elem
  });

  gameOfLife.run();
});
