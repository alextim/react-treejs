import * as THREE from 'three'

import type { DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';

const colorToNum = (key: string | undefined) => key && palettesColors[key] ? palettesColors[key] : palettesColors[0];

const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);

/**
 * 3 faces = 3 materials
 *
 */
/*
geometry.clearGroups();
geometry.addGroup( 0, 12, 0 );
geometry.addGroup( 12, 24, 1 );
geometry.addGroup( 24, 36, 2 );

const material = [
  new THREE.MeshBasicMaterial(),
  new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
  new THREE.MeshBasicMaterial( { color: 0x0000ff } ),
];
*/
const material = new THREE.MeshBasicMaterial();

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const EXTRA_ITEMS_QTY = 100;

class InstancedBoxes {
  mesh: THREE.InstancedMesh;
  items: readonly DataItem[];

  constructor(items: DataItem[]) {
    this.items = items;

    this.mesh = new THREE.InstancedMesh(geometry, material, items.length + EXTRA_ITEMS_QTY);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    return this;
  }

  updateAll() {
    let id = 0;
    for (const [ , [x, y, z], color ] of this.items) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      this.mesh.setMatrixAt(id, tempObject.matrix);

      tempColor.set(colorToNum(color));
      this.mesh.setColorAt(id, tempColor);

      id += 1;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
  }

  updateOne(id: number) {
    const [, [x, y, z], color] = this.items[id];
    tempObject.position.set(x, y, z);
    tempObject.updateMatrix();
    this.mesh.setMatrixAt(id, tempObject.matrix);

    tempColor.set(colorToNum(color));
    this.mesh.setColorAt(id, tempColor);

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
  }

  updateLast() {
    const id = this.items.length - 1;
    this.updateOne(id);
  }
}

export default InstancedBoxes;
