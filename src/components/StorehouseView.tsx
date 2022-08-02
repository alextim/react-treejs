import { useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

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

const StorehouseView = () => {
  const domContent = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1);

  const { data, linesData } = useMemo(() => generateData(options.blocksX, options.blocksZ, options.minColumnsInBlock), []);

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

  return (
    <Canvas ref={domContent} 
      gl={{ antialias: true, physicallyCorrectLights: true, pixelRatio: window.devicePixelRatio }}
      camera={{aspect, fov: 35, position: [-4, 4, 10], near: 0.1, far: 1000}}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: 'hidden',
      }}
    >
      <color attach="background" args={[0, 0, 0xffff]} />
      <primitive object={new THREE.AxesHelper(10)} />
      <Lights />
      <Boxes items={data} />
      <Lines items={linesData} offset={linesOffset} color={options.edgeColor} />
      <OrbitControls />
      <Stats />
    </Canvas>
  );
};

export default StorehouseView; 
