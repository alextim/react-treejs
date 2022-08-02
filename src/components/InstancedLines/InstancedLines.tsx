import type { Point2D, Point3D } from '../../types';
import * as THREE from 'three'
import { useEffect, useRef } from 'react';

export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color: string;
}

const InstancedLines = ({ items, offset: [dx, dz1, dz2], color }: Props) => {
  const meshRef = useRef<any>(null);


  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    const mesh: any = meshRef.current;

    const tempObject = new THREE.Object3D();
    let id = 0;
    for (const [x, y] of items) {
      tempObject.position.set(x, y, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      mesh.setMatrixAt(id, tempObject.matrix);
      id += 1;
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  

  const vertices = new Float32Array([
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
  
    1, 1, 0,
    -1, 1, 0,
    -1, -1, 0
  ]);
  

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length]}>
      <bufferGeometry  attach="geometry">
        <bufferAttribute 
          attachObject={["attributes", "position"]}
          args={[vertices, 3]}
          count={vertices.length / 3}
          itemSize={3}
          array={vertices}          
        />
      </bufferGeometry>
      <meshBasicMaterial attach="material" side={THREE.DoubleSide} color="red" />
    </instancedMesh>
  );
};

export default InstancedLines;