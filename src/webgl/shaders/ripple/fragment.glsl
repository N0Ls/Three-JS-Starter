uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform vec3 color1;
uniform vec3 color2;
uniform float uTime;
uniform float uRippleEffectIntensity;
uniform float uAspectRatio;
uniform float uTextureTileNumber;
uniform vec2 uSpeedFactor;
uniform vec2 uMouse;
uniform float uVelo;
uniform vec2 resolution;

varying vec2 vUv;


float remap(float value, float destMin, float destMax, float sourceMin, float sourceMax) {
    return destMin + ((value - sourceMin) / (sourceMax - sourceMin)) * (destMax - destMin);
}

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv*=resolution;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}


void main()
{
    //vec2 newUv = vec2(vUv.x, vUv.y + sin(uTime) * 0.1);
    vec2 newUv = vec2(vUv.x , vUv.y);

    float c = circle(newUv, uMouse, 0.0, 0.2);

	vec2 st = vUv.xy;
    vec3 color = vec3(0.0);

    st *= uTextureTileNumber; // Number of tiles
    st.x *= uAspectRatio; // Aspect ratio
    //st += sin(uTime) * 0.1;
    st.x += uTime * uSpeedFactor.x; // Move texture x
    st.y -= uTime * uSpeedFactor.y; // Move texture y
    st += c * (uVelo * .8);
    st = fract(st); // Wrap around 1.0 / same as mod 1


    color = vec3(st,0.0);

    vec4 colorNormal = texture2D(tNormal, st);

    vec4 colorImage = texture2D(tDiffuse, vUv + colorNormal.xy * uRippleEffectIntensity);

    gl_FragColor = vec4(colorImage.xyz, 1.0);
}