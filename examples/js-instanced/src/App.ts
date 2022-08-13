import shortid from 'shortid';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import type { DataItem, Point2D } from '@/at-shared';

import { BOX_SIZE, BLOCK_X_GAP, linesOffset, getRandomPaletteColorName } from '@/at-shared';

import Boxes from './InstancedBoxes';
import Lines from './InstancedLines';

import data from '@/at-shared/data/palettes.json';
import linesData from '@/at-shared/data/blocks.json';

const initialDataLength = (data as any as []).length;

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
  /*
  const ambientLight = new THREE.AmbientLight(0x404040, 7); // soft white light
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight( 0xffffff, 3);
  spotLight.position.set( 100, 100, 1 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  scene.add( spotLight );
  */

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

  console.time('init');
  const instancedBoxes = new Boxes(data as any as DataItem[]);
  scene.add(instancedBoxes.mesh);
  console.timeEnd('init');

  scene.add(Lines({ items: linesData as any as Point2D[], offset: linesOffset }));
  render();

	updateCount();
  stats.update();

  function profiler(timerName: string, fn: () => void) {
    console.time(timerName);
    fn();
    console.timeEnd(timerName);
  }

  // render
  function render() {
    profiler('render', () => {
      instancedBoxes.updateAll();
      renderer.render(scene, camera);
    });
  }

  function renderLast() {
    profiler('renderOne', () => {
      instancedBoxes.updateLast();
      renderer.render(scene, camera);
    });
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  const onAddHandler = (e: MouseEvent, renderFn: () => void) => {
    e.preventDefault();

    const shift = (data as any as []).length - initialDataLength + BLOCK_X_GAP;
    const newItem: DataItem = [
      shortid.generate(),
      [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
      getRandomPaletteColorName(),
    ];

    (data as any as DataItem[]).push(newItem);
    updateCount();

    renderFn();

    stats.update();
  };

  const addBtn = document.getElementById('add-btn') as HTMLButtonElement | null;
  if (addBtn) {
    addBtn.addEventListener('click', (e) => onAddHandler(e, render));
  }

  const addBtn1 = document.getElementById('add-btn-1') as HTMLButtonElement | null;
  if (addBtn1) {
    addBtn1.addEventListener('click', (e) => onAddHandler(e, renderLast));
  }

  const countElement = document.getElementById('count');
  function updateCount() {
    if (countElement) {
      countElement.innerText = (data as any as []).length.toString();
    }
  }
}

export default App;
