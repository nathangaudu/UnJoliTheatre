varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.14159;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vUv = uv;
	vPosition = position;
}