import * as THREE from 'three';
import { palettesColors } from '../../../../packages/shared/src/helpers/palettesColors';

export const palettesMaterials: Record<string, THREE.Material> = {};
Object.entries(palettesColors).forEach(([key, color]) => {
  palettesMaterials[key] = new THREE.MeshLambertMaterial({ color, wireframe: false /*key === 'frame' || key === 'active'*/ });
});

const defaultMaterial = new THREE.MeshLambertMaterial ({ color: 0xff0000 });
const getDefaultMaterial = () => {
  console.log('defaultMaterial');
  return defaultMaterial;
};

export const getPaletteMaterial = (color: string | undefined) => color && palettesMaterials[color] ? palettesMaterials[color] : getDefaultMaterial();
