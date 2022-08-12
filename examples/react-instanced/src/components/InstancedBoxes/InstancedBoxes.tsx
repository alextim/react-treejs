import { useEffect, useRef } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE } from '@/at-shared';
import { palettesColors } from '@/at-shared';

const geometryArgs: Point3D = [BOX_SIZE, BOX_SIZE, BOX_SIZE];

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export interface Props {
  items: DataItem[];
}

const colorToNum = (key: string | undefined) => key && palettesColors[key] ? palettesColors[key] : palettesColors[0];

const InstancedBoxes = ({ items }: Props) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef?.current) {
      return;
    }

    let id = 0;
    for (const [, [x, y, z], color ] of items) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(id, tempObject.matrix);

      tempColor.set(colorToNum(color));
      meshRef.current.setColorAt(id, tempColor);

      id += 1;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    console.log('InstancedBoxes useEffect')
  }, [items]);
  console.log('InstancedBoxes render');
  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length]}>
      <boxBufferGeometry args={geometryArgs} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

export default InstancedBoxes;
