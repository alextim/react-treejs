import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';

type BoxesProps = {
  items: DataItem[];
  onDoubleClick: (id: number | undefined) => void;
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

const InstancedBoxes = forwardRef(({ items, onDoubleClick }: BoxesProps, forwardedRef: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const setItemColor = (id: number) => {
    const [,,color] = items[id];
    tempColor.set(colorToNum(color));

    meshRef.current!.setColorAt(id, tempColor);
  };

  const setItemPos = (id: number) => {
    const [, [x, y, z]] = items[id];
    tempObject.position.set(x, y, z);
    tempObject.updateMatrix();
    meshRef.current!.setMatrixAt(id, tempObject.matrix);
  };

  const handlers: BoxesHandlers = {
    updateAll() {
      const n = items.length;
      for (let i = 0; i < n; i++) {
        setItemPos(i);
        setItemColor(i);
      }
      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateOne(id: number) {
      setItemPos(id);
      setItemColor(id);

      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateLast() {
      const id = items.length - 1;
      this.updateOne(id);
    },
  };

  useImperativeHandle(forwardedRef, () => handlers);
  useEffect(() => void handlers.updateAll(), []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, items.length + EXTRA_ITEMS_QTY]}

      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(e.instanceId);
      }}
    >
      <boxBufferGeometry args={geometryArgs} />
      <meshLambertMaterial />
    </instancedMesh>
  );
});

export default InstancedBoxes;
