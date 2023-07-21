uniform float time;
uniform float progress;
uniform float progress2;

varying vec2 vUv;
varying vec3 vPos;

#define M_PI 3.1415926535897932384626433832795

void main()
{
    vec3 pos = position;
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    float value = (M_PI * 0.5) ;
    vUv = uv;

    pos.x = cos(position.y * value * progress) * cos(position.x * value * progress);
    pos.y = cos(position.y * value * progress) * sin(position.x * value);
    pos.z = sin(position.y * value);

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

    // modelPosition *= M_PI * 0.5;
    // modelPosition.z = cos(modelPosition.x);
    // modelPosition.x = sin(modelPosition.x);
    //modelPosition.z += sin(modelPosition.y * 3.0) * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}
