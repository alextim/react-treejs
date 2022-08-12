import { Material, BoxBufferGeometry, EdgesGeometry } from 'three';
import type { Point3D } from 'at-shared';

export interface Props {
  position: Point3D;
  material: Material;
  geometry: BoxBufferGeometry;
  lineMaterial: Material,
  lineGeometry: EdgesGeometry,
}

const SimpleBox = ({ position, material, geometry, lineMaterial, lineGeometry }: Props) => (
  <mesh position={position} material={material} geometry={geometry}>
    {/*<lineSegments material={lineMaterial} geometry={lineGeometry} />*/}
  </mesh>
);

export default SimpleBox;
