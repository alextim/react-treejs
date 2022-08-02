import type { Point2D, Point3D } from '../../types';
import * as THREE from 'three'
import { useEffect, useRef, useMemo } from 'react';

export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color: string;
}

const InstancedLines = ({ items, offset: [dx, dz1, dz2], color }: Props) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    const mesh: any = meshRef.current;

    const tempObject = new THREE.Object3D();
    let id = 0;
    for (const [x,z] of items) {
      tempObject.position.set(x - dx, 0, z - dz1);
      tempObject.updateMatrix();
      mesh.setMatrixAt(id, tempObject.matrix);
      id += 1;
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  
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
  }, []);

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
      <meshStandardMaterial attach="material" color="red" />
    </instancedMesh>
  );
};

export default InstancedLines;