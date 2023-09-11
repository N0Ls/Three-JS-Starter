uniform sampler2D tDiffuse;
uniform vec3 color1;
uniform vec3 color2;
uniform float uTime;

varying vec2 vUv;
vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

vec3 rgb2hsl( in vec3 c ){
  float h = 0.0;
	float s = 0.0;
	float l = 0.0;
	float r = c.r;
	float g = c.g;
	float b = c.b;
	float cMin = min( r, min( g, b ) );
	float cMax = max( r, max( g, b ) );

	l = ( cMax + cMin ) / 2.0;
	if ( cMax > cMin ) {
		float cDelta = cMax - cMin;
        
        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original
		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
        
		if ( r == cMax ) {
			h = ( g - b ) / cDelta;
		} else if ( g == cMax ) {
			h = 2.0 + ( b - r ) / cDelta;
		} else {
			h = 4.0 + ( r - g ) / cDelta;
		}

		if ( h < 0.0) {
			h += 6.0;
		}
		h = h / 6.0;
	}
	return vec3( h, s, l );
}

float remap(float value, float destMin, float destMax, float sourceMin, float sourceMax) {
    return destMin + ((value - sourceMin) / (sourceMax - sourceMin)) * (destMax - destMin);
}


void main()
{
    vec2 newUv = vUv;
    vec4 colorImage = texture2D(tDiffuse, newUv);

    vec3 hslImage = rgb2hsl(colorImage.rgb);

    vec2 st = gl_PointCoord;
    float mixValue = distance(st, vec2(0, 1));

    vec3 hsl1 = rgb2hsl(color1);
    vec3 hsl2 = rgb2hsl(color2);

    //Animate colors
    //hsl1.x = abs(sin(hsl1.x * uTime * 2.0));
    //hsl2.x = mod(hsl2.x + floor(uTime), 360.0);
    //hsl2.x += uTime;

    //hsl1 = vec3(mod(hsl1.x + (0.5 * uTime),360.0), hsl1.y, hsl1.z);
    //hsl2 = vec3(mod(hsl2.x + (0.2 * uTime),360.0), hsl2.y, hsl2.z);
    
    float hueFinalColor = remap(hslImage.z, min(hsl1.x, hsl2.x), max(hsl1.x, hsl2.x), 0.0, 1.0);
    
    //float hueFinalColor = remap(hslImage.z, min(hsl1.x, hsl2.x), max(hsl1.x, hsl2.x), 0.0, 1.0);


    // mix hue in toward closest direction
    //float hue = (mod(mod((hsl2.x - hsl1.x), 1.) + 1.5, 1.) - 0.5) * hslImage.y + hsl1.x;
    //vec3 hsl = vec3(mod(hueFinalColor + (0.1 * uTime),360.0), mix(hsl1.yz, hsl2.yz, hslImage.z));
    //vec3 hsl = vec3(hueFinalColor, mix(hsl1.yz, hsl2.yz, mixValue));
    //vec3 hsl = vec3(hueFinalColor, hslImage.y, hslImage.z);

    //TRUE
    vec3 hsl = vec3(hueFinalColor, mix(hsl1.yz, hsl2.yz, hslImage.z));

    vec3 color = hsl2rgb(hsl);

    gl_FragColor = vec4(color, 1.0);
}