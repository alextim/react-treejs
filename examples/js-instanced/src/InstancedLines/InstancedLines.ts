import type { Point2D, Point3D } from 'at-shared';
import * as THREE from 'three';


export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color?: string;
}

const tempObject = new THREE.Object3D();

const InstancedLines = ({ items, offset: [dx, dz1, dz2], color }: Props):  THREE.InstancedMesh => {
  const w = dx * 2;
  const h = dz2 - dz1;

  const vertices = new Float32Array([
      0, 0, 0,
      w, 0, 0,
      0, 0, h,

      w, 0, 0,
      w, 0, h,
      0, 0, h
    ]);

  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

  const mesh = new THREE.InstancedMesh( geometry, material, items.length );

  let id = 0;
  for (const [x,z] of items) {
    tempObject.position.set(x - dx, 0, z - dz1);
    tempObject.updateMatrix();
    mesh.setMatrixAt(id, tempObject.matrix);
    id += 1;
  }

  return mesh;
};

export default InstancedLines;
