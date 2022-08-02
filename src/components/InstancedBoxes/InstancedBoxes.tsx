import type { Point3D } from '../../types';
import * as THREE from 'three'
import { useEffect, useRef, useMemo } from 'react';

const geometryArgs: Point3D = [1, 1, 1];

const hexToNum = (hex: string) => {
  const s = hex.replace('#', '0x');
  return Number(s);
};

const tempColor = new THREE.Color();
const tempObject = new THREE.Object3D();

export interface Props {
  items: Array<{ position: Point3D, color: string }>;
}

const InstancedBoxes = ({ items }: Props) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorArray = useMemo(() => Float32Array.from(new Array(items.length).fill(0).flatMap((_, i) => tempColor.set(hexToNum(items[i].color)).toArray())), []);

  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    const mesh: any = meshRef.current;

    let id = 0;
    for (const { position: [x, y, z] } of items) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      mesh.setMatrixAt(id, tempObject.matrix);
      id += 1;
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  
  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length]}>
      <boxGeometry args={geometryArgs}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </boxGeometry>        
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
};

export default InstancedBoxes;