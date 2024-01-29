varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.14159;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    
    gl_PointSize = 3. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

	vUv = uv;
	vPosition = position;
}