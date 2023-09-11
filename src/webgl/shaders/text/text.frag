uniform sampler2D tAlphaTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
    vec2 newUv = vec2(vUv.x, vUv.y) * 0.15;

    vec4 alphaImage = texture2D(tAlphaTexture, newUv);

    gl_FragColor = vec4(uColor.rgb, 1.0 - alphaImage.r);
}