import { useRef, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { linesOffset } from '@/at-shared';
import { useAppStore } from '@/store';

import Lights from '../Lights';
import Boxes from '../InstancedBoxes/InstancedBoxes2';
import Lines from '../InstancedLines';


type Props = {
  linesColor: string;
  onClick: (id: number | undefined) => void;
};

const Content3D = forwardRef(({ linesColor, onClick }: Props, boxesRef: any) => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const items = useAppStore(({ items }) => items);
  const selectedInstanceId = useAppStore(({ selectedInstanceId }) => selectedInstanceId);

  const lines = useAppStore(({ lines }) => lines);

  // l={{ antialias: true, physicallyCorrectLights: true, pixelRatio: window.devicePixelRatio, alpha: false }}
  /*()
  if (itemsLoading || linesLoading) {
    return <div>Loading</div>;
  }
  */
  return (
    <Canvas ref={domContent}
      gl={{ pixelRatio: window.devicePixelRatio }}
      camera={{ fov: 35, position: [-4, 4, 200], near: 0.1, far: 1000 }}
    >
      <color attach="background" args={[0, 0xfff, 0]} />
      <axesHelper args={[20]} />
      <Lights />
      <OrbitControls makeDefault dampingFactor={0.3} />

      <Boxes items={items} selectedInstanceId={selectedInstanceId} onClick={onClick} />
      <Lines items={lines} offset={linesOffset} color={linesColor} />
    </Canvas>
  );
});

export default Content3D;
