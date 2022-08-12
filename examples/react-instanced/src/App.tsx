import { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import shortid from 'shortid';

import type { DataItem, Point2D } from 'at-shared';
import { options, BOX_SIZE, BLOCK_X_GAP } from 'at-shared';

import { linesOffset, getRandomPaletteColorName } from 'at-shared/helpers';

import Boxes from './components/InstancedBoxes';
import Lines from './components/InstancedLines';
//import Boxes from './SimpleBoxes';
// import Lines from './SimpleLines';

import initialData from 'at-shared/data/palettes.json';
import linesData from 'at-shared/data/blocks.json';

const App = () => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1);
  const [data, setData] = useState<DataItem[]>(initialData as any as DataItem[]);

  useEffect(() => {
    const resizeHandler = () => {
      const el: HTMLCanvasElement = domContent.current!;
      setAspect(el.clientWidth / el.clientHeight);
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    console.log('StorehouseView useEffect')
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  //       <Stats showPanel={0}/>

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();

    setData((prevData) => {
      const shift = prevData.length - (initialData as any as DataItem[]).length + BLOCK_X_GAP;
      const newItem: DataItem = {
        id: shortid.generate(),
        position: [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
        color: getRandomPaletteColorName(),
      };

      return prevData.concat(newItem);
    });
  }, []);
  console.log('StorehouseView render')
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
        <Boxes items={data} />
        <Lines items={linesData as any as Point2D[]} offset={linesOffset} color={options.edgeColor} />
        <OrbitControls makeDefault dampingFactor={0.3} />
        <Stats />
      </Canvas>
      <footer>
        <div>React Instanced</div>
        <button onClick={clickHandler}>add</button>
        <div><span>Count:</span>{data.length}</div>
      </footer>
    </div>
  );
};

export default App;
