import * as THREE from 'three';

export const palettesColors: Record<string, number> = {
  plum: 0xff00ff,
  orange: 0x00ffff,
  aquamarine: 0x0000ff,
  frame: 0x000000,
  active: 0xffff00,
  selected: 0xffff00,
  defective: 0xffd0d3,
  stringer: 0xa0522d,
} as const;

const palettesMaterials: Record<string, THREE.MeshBasicMaterial> = {};
Object.entries(palettesColors).forEach(([key, color]) => {
  palettesMaterials[key] = new THREE.MeshBasicMaterial({ color, wireframe: key === 'frame' || key === 'active'  })
});

export default palettesMaterials;

export type PalettesMaterialsColors = keyof typeof palettesMaterials

export const palettesMaterialsColors = Object.keys(palettesMaterials) as PalettesMaterialsColors[];
