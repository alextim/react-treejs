import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three'

import type { Point2D, Point3D } from '@/at-shared';

export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color: string;
}

const tempObject = new THREE.Object3D();

const InstancedLines = ({ items, offset: [dx, dz1, dz2], color }: Props) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    let id = 0;
    for (const [x,z] of items) {
      tempObject.position.set(x - dx, 0, z - dz1);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(id, tempObject.matrix);
      id += 1;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [items, dx, dz1]);

  const vertices = useMemo(() => {
    const w = dx * 2;
    const h = dz2 - dz1;
    return new Float32Array([
      0, 0, 0,
      w, 0, 0,
      0, 0, h,

      w, 0, 0,
      w, 0, h,
      0, 0, h
    ]);
  }, [dx, dz1, dz2]);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[vertices, 3]}
          count={vertices.length / 3}
          itemSize={3}
          array={vertices}
        />
      </bufferGeometry>
      <meshBasicMaterial attach="material" color="red" />
    </instancedMesh>
  );
};

export default InstancedLines;
