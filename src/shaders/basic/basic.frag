uniform sampler2D tTexture;

varying vec2 vUv;
varying vec3 vPos;

void main()
{
    vec4 colorImage = texture2D(tTexture, vUv);

    gl_FragColor = vec4(colorImage.rgb, 1.0);
}