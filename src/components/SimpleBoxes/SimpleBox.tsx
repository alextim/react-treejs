import type { Point3D } from '../../types';

export interface Props {
  position: Point3D;
  color: string;
}

const geometryArgs: Point3D = [1, 1, 1];

const SimpleBox = ({ position, color }: Props) => (
  <mesh position={position}>
    <meshBasicMaterial color={color} />
    <boxGeometry args={geometryArgs} />
  </mesh>    
);

export default SimpleBox;