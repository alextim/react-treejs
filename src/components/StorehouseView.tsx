import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import shortid from 'shortid';

import type { DataItem } from '../types';
import { BOX_SIZE, BLOCK_X_GAP } from '../constants';

import { generateData, linesOffset } from '../helpers/generate-data';

import Boxes from './InstancedBoxes';
import Lines from './InstancedLines';

// import Boxes from './SimpleBoxes';
// import Lines from './SimpleLines';

const options = {
  blocksX: 60,
  blocksZ: 10,
  minColumnsInBlock: 3,
  material: 'basic',
  edgeColor: "#640064",
  hemisphereLightOn: false,
  ambientLightOn: false,
  directionalLightOn: false,
};

const Lights = () => (
  <group>
    {options.hemisphereLightOn && <hemisphereLight intensity={0.3} />}
    {options.ambientLightOn && <ambientLight intensity={2} />}
    {options.directionalLightOn && <directionalLight intensity={2} />}
  </group>
);

const { data: initialData, linesData } = generateData(options.blocksX, options.blocksZ, options.minColumnsInBlock);

const StorehouseView = () => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1);
  const [data, setData] = useState<DataItem[]>(initialData);

  useEffect(() => {
    const resizeHandler = () => {
      const el: HTMLCanvasElement = domContent.current!;
      setAspect(el.clientWidth / el.clientHeight);
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  //       <Stats showPanel={0}/>

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    setData((prevData) => {
      const shift = prevData.length - initialData.length + BLOCK_X_GAP;
      const newItem: DataItem= {
        id: shortid.generate(),
        position: [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
      };

      return prevData.concat(newItem);
    });
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Canvas ref={domContent}
        gl={{ antialias: true, physicallyCorrectLights: true, pixelRatio: window.devicePixelRatio }}
        camera={{aspect, fov: 35, position: [-4, 4, 10], near: 0.1, far: 1000}}
        style={{
          width: "100%",
          height: "90%",
          overflow: 'hidden',
        }}
      >
        <color attach="background" args={['green']} />
        <axesHelper args={[20]} />
        <Lights />
        <Boxes items={data} />
        <Lines items={linesData} offset={linesOffset} color={options.edgeColor} />
        <OrbitControls makeDefault dampingFactor={0.3} />
        <Stats />
      </Canvas>
      <div style={{ display: 'flex' }}>
        <button onClick={clickHandler}>add</button>
        <div><span>Count:</span>{data.length}</div>
      </div>
    </div>
  );
};

export default StorehouseView;
