import * as THREE from 'three';

import type { DataItem } from '../../types';
import { BOX_SIZE } from '../../constants';
import getPaletteMaterial from '../../helpers/getPaletteMaterial';

import SimpleBox from './SimpleBox';
export interface Props {
  items: DataItem[],
}

const boxGeometry = new THREE.BoxBufferGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
const lineGeometry = new THREE.EdgesGeometry(boxGeometry);

const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
console.log('SimpleBoxes');
const SimpleBoxes = ({ items }: Props) => {
  return (<>
    {items.map(({ id, position, color }) => (
      <SimpleBox key={id} position={position} geometry={boxGeometry} material={getPaletteMaterial(color)} lineMaterial={lineMaterial} lineGeometry={lineGeometry} />
    ))}
  </>);
};

export default SimpleBoxes;
