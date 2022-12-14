import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';
import { useAppStore } from '@/store';

type BoxesProps = {
  onClick?: (instanceId: number | undefined) => void;
  onDoubleClick?: (instanceId: number | undefined) => void;
};

export type BoxesHandlers = {
  updateAll: () => void,
  updateOne: (instanceId: number) => void,
  updateLast: () => void,
};

const EXTRA_ITEMS_QTY = 200000;

const geometryArgs: Point3D = [BOX_SIZE, BOX_SIZE, BOX_SIZE];

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const selectedColor = new THREE.Color(100, 100, 100);
const emptyMatrix = new THREE.Matrix4();

const defaultColor = palettesColors[Object.keys(palettesColors)[0]];
const colorToNum = (key: string | undefined) => key && palettesColors.hasOwnProperty(key) ? palettesColors[key] : defaultColor;

const InstancedBoxes = forwardRef(({ onClick, onDoubleClick }: BoxesProps, forwardedRef: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const items = useAppStore(({ items }) => items);
  const itemsLoading = useAppStore(({ itemsLoading }) => itemsLoading);
  const selectedInstanceId = useAppStore(({ selectedInstanceId }) => selectedInstanceId);

  const setItemColor = (instanceId: number) => {
    if (selectedInstanceId !== undefined && selectedInstanceId === instanceId) {
      console.log('selected', instanceId, selectedColor.getHex());
      meshRef.current!.setColorAt(instanceId, selectedColor);
    } else {
      const { color } = items[instanceId];
      const numColor = colorToNum(color);
      tempColor.setHex(numColor);
      meshRef.current!.setColorAt(instanceId, tempColor);
      console.log('item', instanceId, tempColor.getHex());
    }
  };

  const setItemPos = (instanceId: number) => {
    const { pos: [x, y, z] } = items[instanceId];
    tempObject.position.set(x, y, z);
    tempObject.updateMatrix();
    meshRef.current!.setMatrixAt(instanceId, tempObject.matrix);
  };

  const setItem = (instanceId: number) => {
    if (items[instanceId].hidden) {
      meshRef.current!.setMatrixAt(instanceId, emptyMatrix);
    } else {
      setItemPos(instanceId);
      setItemColor(instanceId);
    }
  }

  const needsUpdate = () => {
    meshRef.current!.instanceMatrix.needsUpdate = true;
    meshRef.current!.instanceColor!.needsUpdate = true;
  };

  const handlers: BoxesHandlers = {
    updateAll() {
      if (itemsLoading) {
        return;
      }
      const n = items.length;
      console.log('paintAll:', n);
      for (let i = 0; i < n; i++) {
        setItem(i);
      }
      needsUpdate();
    },

    updateOne(instanceId: number) {
      setItem(instanceId);
      needsUpdate();
    },

    updateLast() {
      const instanceId = items.length - 1;
      this.updateOne(instanceId);
    },
  };

  useImperativeHandle(forwardedRef, () => handlers);
  useEffect(() => void handlers.updateAll(), [items, selectedInstanceId, itemsLoading]);
  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, EXTRA_ITEMS_QTY]}
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
