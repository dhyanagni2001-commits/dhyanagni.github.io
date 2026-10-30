import { Color, MeshBasicMaterial, ShaderMaterial } from "three";
import { resources } from "../../utils/resources";
import { colors } from "./colors";
import shadowVertexShader from "../shaders/shadow-catcher/vertex.glsl";
import shadowFragmentShader from "../shaders/shadow-catcher/fragment.glsl";

import type { Material } from "three";

// The room and contact textures are baked in a warm beige/orange palette.
// Rather than re-bake them, remap colours in the fragment shader: saturated
// oranges become hot pink, saturated yellows a soft pink tint, and the neutral
// beiges are scaled so the old background tone lands exactly on the new one.
const palette = {
  pink: new Color("#D83995"),
  softPink: new Color("#F6CFE5"),
};

const applyPalette = (material: MeshBasicMaterial, fromBackground: string, toBackground: Color) => {
  // Ratio is computed in linear space, matching what the shader sees after
  // sampling an sRGB texture.
  const from = new Color(fromBackground);
  const neutralScale = new Color(toBackground.r / from.r, toBackground.g / from.g, toBackground.b / from.b);

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNeutralScale = { value: neutralScale };
    shader.uniforms.uPink = { value: palette.pink };
    shader.uniforms.uSoftPink = { value: palette.softPink };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uNeutralScale;
        uniform vec3 uPink;
        uniform vec3 uSoftPink;

        vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        {
          vec3 c = diffuseColor.rgb;
          vec3 hsv = rgb2hsv(pow(c, vec3(1.0 / 2.2)));

          // Warm hues only (orange through yellow); greens, blues and greys are left alone.
          float warm = smoothstep(0.0, 0.02, hsv.x) * (1.0 - smoothstep(0.17, 0.2, hsv.x));
          // Stay within one hue so texture noise only shifts lightness, never hue:
          // deep oranges become hot pink, pale yellows a soft pink tint.
          float pale = smoothstep(0.08, 0.15, hsv.x);
          // Yellows are less saturated than the oranges, so they qualify sooner.
          float vivid = smoothstep(mix(0.3, 0.14, pale), mix(0.55, 0.3, pale), hsv.y) * warm;
          vec3 accent = pow(mix(uPink, uSoftPink, pale), vec3(1.0 / 2.2));
          vec3 recolored = pow(clamp(accent * mix(0.7, 1.05, hsv.z), 0.0, 1.0), vec3(2.2));

          vec3 neutral = min(c * uNeutralScale, vec3(1.0));
          diffuseColor.rgb = mix(neutral, recolored, vivid);
        }`,
      );
  };
};

let roomMaterial: Material | null = null;
let contactMaterial: Material | null = null;
let shadowMaterial: ShaderMaterial | null = null;

export const getRoomMaterial = (): Material => {
  if (roomMaterial) return roomMaterial;
  const texture = resources.items["room-texture"];
  texture.flipY = false;

  roomMaterial = new MeshBasicMaterial({ map: texture });
  applyPalette(roomMaterial as MeshBasicMaterial, "#f5efe6", colors.beigeLight);

  return roomMaterial;
};

export const getContactMaterial = (): Material => {
  if (contactMaterial) return contactMaterial;
  const texture = resources.items["contact-texture"];
  texture.flipY = false;

  contactMaterial = new MeshBasicMaterial({ map: texture });
  applyPalette(contactMaterial as MeshBasicMaterial, "rgb(233, 222, 208)", colors.beigeDark);

  return contactMaterial;
};

export const getShadowMaterial = (): ShaderMaterial => {
  if (shadowMaterial) return shadowMaterial;

  shadowMaterial = new ShaderMaterial({
    vertexShader: shadowVertexShader,
    fragmentShader: shadowFragmentShader,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTexture: { value: null },
      uColorBackground: { value: null },
      uColorShadow: { value: null },
    },
  });

  return shadowMaterial;
};
