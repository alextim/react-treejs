import type { Point2D, Point3D } from '@/at-shared';
import { Line } from '@react-three/drei';

export interface Props {
  items: Point2D[];
  offset: Readonly<Point3D>;
  color: string;
}

const SimpleLines = ({ items, offset: [dx, dz1, dz2], color }: Props) => (
  <group>
    {
      items.map(([x, z], i: number) => (
        <Line key={`line-${i}`}
          points={[
            //create square
            [x - dx, 0, z - dz1],
            [x - dx, 0, z + dz2],
            [x + dx, 0, z + dz2],
            [x + dx, 0, z - dz1],
            [x - dx, 0, z - dz1],
          ]}
          color={color}
        />
      ))
    }
  </group>
);

export default SimpleLines;
