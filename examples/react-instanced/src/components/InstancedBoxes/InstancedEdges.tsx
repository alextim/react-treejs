import { useEffect, useRef } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from 'at-shared';
import { BOX_SIZE } from 'at-shared';

const geometryArgs: Point3D = [BOX_SIZE, BOX_SIZE, BOX_SIZE];

const tempObject = new THREE.Object3D();

export interface Props {
  items: DataItem[];
}

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

const edges = new THREE.EdgesGeometry(boxGeometry); // or WireframeGeometry( geometry )
const lines = new THREE.LineSegments(edges);

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 0.1 } );

const InstancedEdges = ({ items }: Props) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    let id = 0;
    for (const { position: [x, y, z], color } of items) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(id, tempObject.matrix);

      id += 1;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    console.log('InstancedEdges useEffect')
  }, [items]);
  console.log('InstancedEdges render');
  return (
    <instancedMesh ref={meshRef} args={[lines.geometry, lineMaterial, items.length]} />
  );
};

export default InstancedEdges;
