import { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import shortid from 'shortid';

import type { DataItem, Point2D } from '@/at-shared';
import { options, BOX_SIZE, BLOCK_X_GAP } from '@/at-shared';

import { linesOffset, getRandomPaletteColorName } from '@/at-shared';

import Boxes from './components/InstancedBoxes';
import type { BoxesHandlers } from './components/InstancedBoxes';
import Lines from './components/InstancedLines';
//import Boxes from './SimpleBoxes';
// import Lines from './SimpleLines';

import initialData from '@/at-shared/data/palettes.json';
import linesData from '@/at-shared/data/blocks.json';

const initialDataLength = (initialData as any as []).length;

const App = () => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1);
  const data = initialData as any as DataItem[];
  const boxesRef = useRef<BoxesHandlers>(null);

  useEffect(() => {
    const resizeHandler = () => {
      const el: HTMLCanvasElement = domContent.current!;
      setAspect(el.clientWidth / el.clientHeight);
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();

    const shift = data.length - initialDataLength + BLOCK_X_GAP;
    const newItem: DataItem = [
      shortid.generate(),
      [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
      getRandomPaletteColorName(),
    ];
    data.push(newItem);
    boxesRef.current?.updateLast();
  }, []);

  return (
    <div id="content">
      <Canvas ref={domContent}
        gl={{ antialias: true, physicallyCorrectLights: true, pixelRatio: window.devicePixelRatio, alpha: false }}
        camera={{ aspect, fov: 35, position: [-4, 4, 200], near: 0.1, far: 1000 }}
        style={{
          width: "100%",
          height: "90%",
          overflow: 'hidden',
        }}
      >
        <color attach="background" args={[0, 0xfff, 0]} />
        <axesHelper args={[20]} />
        <Boxes ref={boxesRef} items={data} />
        <Lines items={linesData as any as Point2D[]} offset={linesOffset} color={options.edgeColor} />
        <OrbitControls makeDefault dampingFactor={0.3} />
        <Stats />
      </Canvas>
      <footer>
        <div>React Instanced</div>
        <button onClick={clickHandler}>add (update one)</button>
        <div><span>Count:</span>{data.length}</div>
      </footer>
    </div>
  );
};

export default App;
