// A modulo function that works for negative numbers
export function mod (dividend, divisor) {
  return ((dividend % divisor) + divisor) % divisor;
}

export let requestAnimationFrame = global.requestAnimationFrame || (function () {
  return  global.webkitRequestAnimationFrame ||
          global.mozRequestAnimationFrame ||
          global.oRequestAnimationFrame ||
          global.msRequestAnimationFrame ||
          function (callback) {
            global.setTimeout(callback, 1000 / 60);
          };
})();
