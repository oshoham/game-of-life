#define ALIVE 1

precision mediump float;
precision mediump int;

uniform int alive;
uniform vec2 resolution;

void main() {
  vec2 ndcPosition = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec4 color;

  if (state == ALIVE) {
    color = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    color = vec4(0.0, 0.0, 0.0, 1.0);
  }

  gl_FragColor = color;
}
