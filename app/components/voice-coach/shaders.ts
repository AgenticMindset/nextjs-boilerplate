// Ashima Arts classic 3D simplex noise (MIT license), used to drive both the
// core surface displacement and the particle drift so all layers read as one
// coherent, turbulent volume rather than separately-animated pieces.
export const SIMPLEX_NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// Three octaves of simplex, each at double the frequency and half the weight.
// A single octave only ever produces a smooth, featureless swell; the extra
// octaves are what make the surface read as smoke/liquid rather than a
// slowly-breathing ball. The 1/0.875 rescale (the amplitudes sum to 0.875)
// keeps the output in roughly the same +/-1 range a bare snoise() returned,
// so the displacement and turbulence values tuned against the old shader
// still mean the same thing. The 2.03 lacunarity is deliberately off an
// exact 2.0 so the octaves don't line up into a visible grid.
export const FBM_GLSL = `
float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 3; i++) {
    sum += amp * snoise(p * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum * 1.142857142857;
}
`;

export const CORE_VERTEX_SHADER = `
uniform float uTime;
uniform float uAmplitude;
uniform float uTurbulence;
uniform float uNoiseSpeed;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDisplacement;

${SIMPLEX_NOISE_GLSL}
${FBM_GLSL}

// Shared by the vertex position and the normal reconstruction below, so the
// two can never drift out of agreement.
float displacementAt(vec3 dir) {
  return fbm(dir * uTurbulence + vec3(uTime * uNoiseSpeed)) * (0.12 + uAmplitude * 0.35);
}

void main() {
  vec3 dir = normalize(position);
  float displacement = displacementAt(dir);
  vDisplacement = displacement;
  vec3 newPosition = dir * (1.0 + displacement);

  // The displaced surface needs its own normals - reusing the sphere's
  // normals leaves the mesh with no lighting response at all, which is why
  // the orb used to read as a flat painted gradient. Rebuild the normal from
  // the surface gradient: sample two neighbours in the tangent plane, then
  // cross the edges they form. cross(t, b) points outward by construction,
  // so the result needs no sign correction.
  vec3 helper = abs(dir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t = normalize(cross(dir, helper));
  vec3 b = cross(dir, t);
  float eps = 0.04;
  vec3 dirT = normalize(dir + t * eps);
  vec3 dirB = normalize(dir + b * eps);
  vec3 neighbourT = dirT * (1.0 + displacementAt(dirT));
  vec3 neighbourB = dirB * (1.0 + displacementAt(dirB));
  vec3 surfaceNormal = normalize(cross(neighbourT - newPosition, neighbourB - newPosition));

  // View space, so the fresnel in the fragment shader is a function of the
  // actual viewing angle instead of being baked onto the rotating mesh.
  vNormal = normalize(normalMatrix * surfaceNormal);
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const CORE_FRAGMENT_SHADER = `
uniform vec3 uBaseColor;
uniform vec3 uAccentColor;
uniform float uOpacity;
uniform float uSpecular;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDisplacement;

const vec3 LIGHT_DIRECTION = normalize(vec3(0.4, 0.8, 0.6));

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // A true view-dependent fresnel: bright where the surface turns away from
  // the camera, which is what gives the orb a glowing rim and the sense of
  // being a volume rather than a sphere with a pattern on it.
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

  // Wrapped diffuse - the 0.35 floor keeps the unlit side shaded rather than
  // black, which matters because the orb is drawn transparent over the page.
  float diffuse = 0.35 + 0.65 * clamp(dot(normal, LIGHT_DIRECTION), 0.0, 1.0);
  vec3 halfVector = normalize(LIGHT_DIRECTION + viewDir);
  float specular = pow(clamp(dot(normal, halfVector), 0.0, 1.0), 48.0) * uSpecular;

  // A +0.3 floor keeps the center from mixing almost pure uBaseColor -
  // without it, a dark base color reads as an indistinguishable hole
  // against the page background instead of a shaded, cohesive blob.
  vec3 color = mix(uBaseColor, uAccentColor, clamp(vDisplacement * 1.5 + fresnel * 0.6 + 0.3, 0.0, 1.0));
  color *= diffuse;
  color += uAccentColor * fresnel * 0.8;
  color += vec3(specular);

  // Opaquer at the silhouette so the rim reads as a defined edge instead of
  // fading out into the background.
  float alpha = clamp(uOpacity + fresnel * 0.25, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

export const PARTICLE_VERTEX_SHADER = `
uniform float uTime;
uniform float uAmplitude;
uniform float uTurbulence;
uniform float uNoiseSpeed;
uniform float uSize;
attribute float aRandom;
varying float vFade;

${SIMPLEX_NOISE_GLSL}
${FBM_GLSL}

void main() {
  // Same fbm as the core, so the dust swirls along with the surface it
  // surrounds rather than drifting on an unrelated noise field.
  float noise = fbm(position * uTurbulence * 0.6 + vec3(uTime * uNoiseSpeed + aRandom * 10.0));
  vec3 displaced = position + normalize(position) * noise * (0.15 + uAmplitude * 0.5);
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  // The 200.0 constant this was originally tuned with assumed a canvas far
  // larger than the ~360px orb container actually used here, producing
  // point sizes in the hundreds of pixels - with thousands of particles
  // that saturated into a solid color fill instead of visible specks.
  gl_PointSize = uSize * (1.0 + aRandom) * (1.0 + uAmplitude * 1.5) * (10.0 / -mvPosition.z);
  // Particles are drawn additively and unsorted, so dim the ones behind the
  // core instead of letting them pile light onto the front of the orb.
  // Measured against the orb's own center depth rather than a hardcoded
  // camera distance, so this survives a camera move.
  float centerZ = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).z;
  vFade = mix(0.35, 1.0, smoothstep(-1.4, 1.4, mvPosition.z - centerZ));
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const PARTICLE_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vFade;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  // A tighter-than-linear falloff gives each speck a hot center and a soft
  // edge, which under additive blending reads as glowing dust; a plain
  // smoothstep just produces uniform haze.
  float core = smoothstep(0.5, 0.0, dist);
  float alpha = pow(core, 1.5) * uOpacity * vFade;
  gl_FragColor = vec4(uColor * (0.65 + 0.35 * core), alpha);
}
`;
