import * as THREE from 'three'

import type { DataItem } from 'at-shared';
import { BOX_SIZE } from 'at-shared';
import { getPaletteMaterial } from 'at-shared/helpers';
// import { palettesColors } from 'at-shared/helpers';

const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
// const material = new THREE.MeshBasicMaterial();

const SimpleBox = ({ position: [x, y, z], color }: DataItem) => {
  const material = getPaletteMaterial(color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  // mesh.material.color.set(palettesColors[color]);
  return mesh;
};

export default SimpleBox;
