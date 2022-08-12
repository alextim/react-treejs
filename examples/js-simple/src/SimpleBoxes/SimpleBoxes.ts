import * as THREE from 'three'

import type { DataItem } from '@/at-shared';


export interface Props {
  items: DataItem[];
  scene: THREE.Scene;
}

import SimpleBox from './SimpleBox';

const SimpleBoxes = ({ items, scene }: Props) => {
  for (const item of items) {
    scene.add(SimpleBox(item));
  }
};

export default SimpleBoxes;
