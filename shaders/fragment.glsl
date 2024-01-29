uniform float uTime;
// uniform vec4 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // vec2 uv = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);

    gl_FragColor = vec4(vUv, 0.0, 1.0);
}