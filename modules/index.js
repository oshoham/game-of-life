import GameOfLife from './game-of-life';

var $ = require('../node_modules/jquery');

$(function () {
  var canvas = document.getElementById('canvas');
  var gameOfLife = new GameOfLife({ canvas });

  gameOfLife.run();
});
