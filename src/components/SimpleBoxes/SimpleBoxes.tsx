import type { Point3D } from '../../types';
import SimpleBox from './SimpleBox';

export interface Props {
  items: Array<{ position: Point3D, color: string }>
}

const SimpleBoxes = ({ items }: Props) => (
  <group>
    {
      items.map(({ position, color }, i) => (
        <SimpleBox key={`box-${i}`} position={position} color={color} />
      ))
    }
  </group>
);

export default SimpleBoxes;