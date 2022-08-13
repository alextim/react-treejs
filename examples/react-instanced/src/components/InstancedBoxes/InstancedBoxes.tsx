import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';

type BoxesProps = {
  items: DataItem[];
};

export type BoxesHandlers = {
  updateAll: () => void,
  updateOne: (id: number) => void,
  updateLast: () => void,
};

const EXTRA_ITEMS_QTY = 100;

const geometryArgs: Point3D = [BOX_SIZE, BOX_SIZE, BOX_SIZE];

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const colorToNum = (key: string | undefined) => key && palettesColors[key] ? palettesColors[key] : palettesColors[0];

const InstancedBoxes = React.forwardRef(({ items }: BoxesProps, forwardedRef: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const handlers: BoxesHandlers = {
    updateAll() {
      let id = 0;
      for (const [, [x, y, z], color ] of items) {
        tempObject.position.set(x, y, z);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);

        tempColor.set(colorToNum(color));
        meshRef.current!.setColorAt(id, tempColor);

        id += 1;
      }
      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateOne(id: number) {
      const [, [x, y, z], color] = items[id];
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(id, tempObject.matrix);

      tempColor.set(colorToNum(color));
      meshRef.current!.setColorAt(id, tempColor);

      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateLast() {
      const id = items.length - 1;
      this.updateOne(id);
    },
  };

  React.useImperativeHandle(forwardedRef, () => handlers);
  useEffect(() => void handlers.updateAll(), []);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, items.length + EXTRA_ITEMS_QTY]}>
      <boxBufferGeometry args={geometryArgs} />
      <meshBasicMaterial />
    </instancedMesh>
  );
});

export default InstancedBoxes;
