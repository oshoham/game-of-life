precision mediump float;
precision mediump int;

uniform sampler2D state;

void main() {
  gl_FragColor = texture2D(state, gl_FragCoord.xy);
}
