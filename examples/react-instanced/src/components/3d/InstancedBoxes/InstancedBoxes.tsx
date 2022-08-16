import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';

type BoxesProps = {
  items: DataItem[];
  selectedInstanceId: number | undefined,
  onClick?: (instanceId: number | undefined) => void;
  onDoubleClick?: (instanceId: number | undefined) => void;
};

export type BoxesHandlers = {
  updateAll: () => void,
  updateOne: (instanceId: number) => void,
  updateLast: () => void,
};

const EXTRA_ITEMS_QTY = 100;

const geometryArgs: Point3D = [BOX_SIZE, BOX_SIZE, BOX_SIZE];

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const selectedColor = new THREE.Color(100, 100, 100);
const emptyMatrix = new THREE.Matrix4();

const colorToNum = (key: string | undefined) => key && palettesColors[key] ? palettesColors[key] : palettesColors[0];

const InstancedBoxes = forwardRef(({ items, selectedInstanceId, onClick, onDoubleClick }: BoxesProps, forwardedRef: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const setItemColor = (instanceId: number) => {
    const { color } = items[instanceId];
    if (selectedInstanceId !== undefined && selectedInstanceId === instanceId) {
      meshRef.current!.setColorAt(instanceId, selectedColor);
    } else {
      tempColor.set(colorToNum(color));
      meshRef.current!.setColorAt(instanceId, tempColor);
    }
  };

  const setItemPos = (instanceId: number) => {
    const { pos: [x, y, z] } = items[instanceId];
    tempObject.position.set(x, y, z);
    tempObject.updateMatrix();
    meshRef.current!.setMatrixAt(instanceId, tempObject.matrix);
  };

  const handlers: BoxesHandlers = {
    updateAll() {
      const n = items.length;
      for (let i = 0; i < n; i++) {
        if (items[i].hidden) {
          meshRef.current!.setMatrixAt(i, emptyMatrix);
        } else {
          setItemPos(i);
          setItemColor(i);
        }
      }
      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateOne(instanceId: number) {
      if (items[instanceId].hidden) {
        meshRef.current!.setMatrixAt(instanceId, emptyMatrix);
      } else {
        setItemPos(instanceId);
        setItemColor(instanceId);
      }

      meshRef.current!.instanceMatrix.needsUpdate = true;
      meshRef.current!.instanceColor!.needsUpdate = true;
    },

    updateLast() {
      const instanceId = items.length - 1;
      this.updateOne(instanceId);
    },
  };

  useImperativeHandle(forwardedRef, () => handlers);
  useEffect(() => void handlers.updateAll(), [items, selectedInstanceId]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, items.length + EXTRA_ITEMS_QTY]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e.instanceId);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick && onDoubleClick(e.instanceId);
      }}
    >
      <boxBufferGeometry args={geometryArgs} />
      <meshLambertMaterial />
    </instancedMesh>
  );
});

export default InstancedBoxes;
