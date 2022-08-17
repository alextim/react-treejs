import { useEffect, useState, useRef, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { linesOffset } from '@/at-shared';
import { useAppStore } from '@/store';

import Lights from '../Lights';
import Boxes from '../InstancedBoxes';
import Lines from '../InstancedLines';

type Props = {
  linesColor: string;
  onClick: (id: number | undefined) => void;
};

const Content3D = forwardRef(({ linesColor, onClick }: Props, boxesRef: any) => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1);

  const items = useAppStore((state) => state.items);
  const lines = useAppStore((state) => state.lines);
  const selectedInstanceId = useAppStore((state) => state.selectedInstanceId);

  useEffect(() => {
    const resizeHandler = () => {
      const el: HTMLCanvasElement = domContent.current!;
      setAspect(el.clientWidth / el.clientHeight);
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
      <Canvas ref={domContent}
        gl={{ antialias: true, physicallyCorrectLights: true, pixelRatio: window.devicePixelRatio, alpha: false }}
        camera={{ aspect, fov: 35, position: [-4, 4, 200], near: 0.1, far: 1000 }}
      >
        <color attach="background" args={[0, 0xfff, 0]} />
        <axesHelper args={[20]} />
        <Lights />
        <Boxes ref={boxesRef} items={items} selectedInstanceId={selectedInstanceId} onClick={onClick} />
        <Lines items={lines} offset={linesOffset} color={linesColor} />
        <OrbitControls makeDefault dampingFactor={0.3} />
        <Stats />
      </Canvas>
  );

});

export default Content3D;
