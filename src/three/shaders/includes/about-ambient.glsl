uniform float uAmbientStrength;

#define AMBIENT_COLOR vec3(0.,0.03,0.05)

vec3 applyAmbient(vec3 color) {
    return color + AMBIENT_COLOR * uAmbientStrength;
}