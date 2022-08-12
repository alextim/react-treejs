import shortid from 'shortid';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import type { DataItem, Point2D, Point3D } from 'at-shared';
import { BOX_SIZE, BLOCK_X_GAP } from 'at-shared';

import { linesOffset, palettesColors, getRandomPaletteColorName } from 'at-shared/helpers';

import Boxes from './InstancedBoxes';
import Lines from './InstancedLines';

import data from 'at-shared/data/palettes.json';
import linesData from 'at-shared/data/blocks.json';
const initialDataLength = (data as any as []).length;


const countElement = document.getElementById('count');


const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

function updateCount() {
  if (countElement) {
    countElement.innerText = (data as any as []).length.toString();
  }
}

const colorToNum = (key: string | undefined) => key && palettesColors[key] ? palettesColors[key] : palettesColors[0];

const App = (container: HTMLElement) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('green');
  scene.add(new THREE.AxesHelper(20));

  const camera = new THREE.PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight,
    0.1, // near clipping plane
    1000, // far clipping plane
  );
  camera.position.set(-4, 4, 200);

  const controls = new OrbitControls(camera, container);
  //static
  controls.addEventListener('change', render);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  //renderer.gammaFactor = 2.2;
  //renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  const instancedBoxesMesh = Boxes({ items: data as any as DataItem[]});
  scene.add(instancedBoxesMesh);
  scene.add(Lines({ items: linesData as any as Point2D[], offset: linesOffset }));

  const stats = Stats();
  document.body.appendChild(stats.dom);

  updateCount();
  render();
	stats.update();

  // render
  function render() {
    let id = 0;
    for (const { position: [x, y, z], color } of data as any as DataItem[]) {
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      instancedBoxesMesh.setMatrixAt(id, tempObject.matrix);

      tempColor.set(colorToNum(color));
      instancedBoxesMesh.setColorAt(id, tempColor);

      id += 1;
    }
    instancedBoxesMesh.instanceMatrix.needsUpdate = true;
    instancedBoxesMesh.instanceColor!.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  const addBtn = document.getElementById('add-btn') as HTMLButtonElement | null;
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const shift = (data as any as []).length - initialDataLength + BLOCK_X_GAP;
      const newItem: DataItem = {
        id: shortid.generate(),
        position: [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
        color: getRandomPaletteColorName(),
      };

      (data as any as DataItem[]).push(newItem);
      updateCount();

      render();

      stats.update();
    });
  }
}


export default App;
