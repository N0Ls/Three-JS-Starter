uniform sampler2D tDiffuse;
uniform vec2 uMouse;
uniform vec2 resolution;
uniform float uVelo;

varying vec2 vUv;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv*=resolution;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main()
{
    vec4 color = vec4(1.,0.,0.,1.);
    vec2 newUv = vec2(
        vUv.x,
        vUv.y
    );

    float c = circle(newUv, uMouse, 0.0, 0.2);
    //float r = texture2D(tDiffuse, newUv.xy += c * (uVelo * .5)).x;
    float r = texture2D(tDiffuse, newUv.xy += c * (uVelo * .5)).x;
    float g = texture2D(tDiffuse, newUv.xy += c * (uVelo * .525)).y;
    float b = texture2D(tDiffuse, newUv.xy += c * (uVelo * .55)).z;

    color = vec4(r, g, b, 1.);

    gl_FragColor = color;
}