uniform vec2 center;
uniform float angle;
uniform float scale;
uniform vec2 tSize;

uniform sampler2D tDiffuse;

varying vec2 vUv;

//source of rand : https://github.com/th3-z/nit3dyne/blob/8aafdcc8e35ad60453d0d439863749e83c53ef2c/nit3dyne/shaders/post.frag
float random(vec2 p) {
    vec2 k1 = vec2(
            23.14069263277926, // e^pi (Gelfond's constant)
            2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract(
            cos(dot(p, k1)) * 12345.6789
    );
}

void main() {
    // Pixel shader
    // float pixelSize = 10.0;
    // float x = mod(gl_FragCoord.x,pixelSize);
    // float y = mod(gl_FragCoord.y,pixelSize);
    // x = floor(pixelSize / 2.0) - x;
    // y = floor(pixelSize / 2.0) - y;
    // x = gl_FragCoord.x + x;
    // y = gl_FragCoord.y + y;
    // vec2 uv = vec2(x, y) / vec2(1920.0, 1080.0);
    
    vec4 color = texture2D( tDiffuse, vUv );
    vec2 uvRandom = vUv;
    uvRandom.y *= random(vec2(uvRandom.y, 0.4));
    color.rgb += random(uvRandom) * 0.12;
    gl_FragColor = color;

}