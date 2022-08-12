import type { Point2D, Point3D } from '@/at-shared';
import * as THREE from 'three';


export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color?: string;
  scene: THREE.Scene;
}

const SimpleLines = ({ items, offset: [dx, dz1, dz2], color, scene }: Props) => {
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


  let id = 0;
  for (const [x,z] of items) {
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x - dx, 0, z - dz1);
    scene.add(mesh);

  }
};

export default SimpleLines;
