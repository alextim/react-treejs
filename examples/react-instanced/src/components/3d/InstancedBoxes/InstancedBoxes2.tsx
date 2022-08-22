import { useRef, useEffect } from 'react';
import * as THREE from 'three'

import type { Point3D, DataItem } from '@/at-shared';
import { BOX_SIZE, palettesColors } from '@/at-shared';

type BoxesProps = {
  items: DataItem[];
  selectedInstanceId: number | undefined;
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

const defaultColor = palettesColors[Object.keys(palettesColors)[0]];
const colorToNum = (key: string | undefined) => key && palettesColors.hasOwnProperty(key) ? palettesColors[key] : defaultColor;

const InstancedBoxes2 = ({ items, selectedInstanceId, onClick, onDoubleClick }: BoxesProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const setItemColor = (instanceId: number) => {
    if (selectedInstanceId !== undefined && selectedInstanceId === instanceId) {
      meshRef.current!.setColorAt(instanceId, selectedColor);
    } else {
      const { color } = items[instanceId];
      const numColor = colorToNum(color);
      tempColor.setHex(numColor);
      meshRef?.current?.setColorAt(instanceId, tempColor);
    }
  };

  const setItemPos = (instanceId: number) => {
    const { pos: [x, y, z] } = items[instanceId];
    tempObject.position.set(x, y, z);
    tempObject.updateMatrix();
    meshRef?.current?.setMatrixAt(instanceId, tempObject.matrix);
  };

  const setItem = (instanceId: number) => {
    if (items[instanceId].hidden) {
      meshRef?.current!.setMatrixAt(instanceId, emptyMatrix);
    } else {
      setItemPos(instanceId);
      setItemColor(instanceId);
    }
  };

  const needsUpdate = () => {
    if (!meshRef?.current) {
      return;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  };

  const handlers: BoxesHandlers = {
    updateAll() {
      const n = items.length;
      console.log('updateAll:', n);
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
      <boxBufferGeometry attach="geometry" args={geometryArgs} />
      <meshLambertMaterial />
    </instancedMesh>
  );
};

export default InstancedBoxes2;
