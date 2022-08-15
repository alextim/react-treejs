import { nanoid } from 'nanoid';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import type { DataItem, Point2D } from '@/at-shared';
import { BOX_SIZE, BLOCK_X_GAP } from '@/at-shared';

import { linesOffset, getRandomPaletteColorName } from '@/at-shared';

import Boxes from './SimpleBoxes';
import Lines from './SimpleLines';

import SimpleBox from './SimpleBoxes/SimpleBox';

import data from '@/at-shared/data/palettes.json';
import linesData from '@/at-shared/data/blocks.json';
const initialDataLength = (data as any as []).length;


const countElement = document.getElementById('count');


function updateCount() {
  if (countElement) {
    countElement.innerText = (data as any as []).length.toString();
  }
}

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

  const stats = Stats();
  document.body.appendChild(stats.dom);

  console.time('init + first render');
  Boxes({ items: data as any as DataItem[], scene });
  Lines({ items: linesData as any as Point2D[], offset: linesOffset, scene });
  render();
  console.timeEnd('init + first render');

  updateCount();
	stats.update();

  // render
  function render() {
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
      const newItem: DataItem = [
        nanoid(),
        [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
        getRandomPaletteColorName(),
      ];

      (data as any as DataItem[]).push(newItem);

      scene.add(SimpleBox(newItem));
      render();

      updateCount();
      stats.update();
    });
  }
}

export default App;


