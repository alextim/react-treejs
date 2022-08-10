import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '../../types';
import { BOX_SIZE } from '../../constants';
import { palettesColors } from '../../helpers/palettesMatertials';

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
    for (const { position: [x, y, z], color } of items) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(id, tempObject.matrix);

      tempColor.set(colorToNum(color));
      meshRef.current.setColorAt(id, tempColor);

      id += 1;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length]}>
      <boxGeometry args={geometryArgs} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

export default InstancedBoxes;
