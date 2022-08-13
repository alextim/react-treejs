import * as THREE from 'three'

import type { DataItem } from '@/at-shared';
import { BOX_SIZE } from '@/at-shared';

export interface Props {
  items: DataItem[];
}

const material = new THREE.MeshBasicMaterial();
const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);

const EXTRA_ITEMS_QTY = 100;

const InstancedBoxes = ({ items }: Props) => {

  /*
		// BoxGeometry's constructor builds each side of the box geometry using `buildPlane`.
		// 	geometry.groups: Array(6)
		// 0: {start: 0, count: 6, materialIndex: 0}
		// 1: {start: 6, count: 6, materialIndex: 1}
		// 2: {start: 12, count: 6, materialIndex: 2}
		// 3: {start: 18, count: 6, materialIndex: 3}
		// 4: {start: 24, count: 6, materialIndex: 4}
		// 5: {start: 30, count: 6, materialIndex: 5}
		//Now, let's regroup materialIndex of the two Z faces and the other faces (x+,x-,y+,y-,z+,z-)
		tileGeometry.clearGroups();
		tileGeometry.addGroup(0, 24, 1); //x+,x-,y+,y-
		tileGeometry.addGroup(24, 12, 0); //z+, z-
  */
  const mesh = new THREE.InstancedMesh(geometry, material, items.length + EXTRA_ITEMS_QTY);
  mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );


  return mesh;
};

export default InstancedBoxes;
