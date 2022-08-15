import { nanoid } from 'nanoid';

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

const addBtn = document.getElementById('add-btn');
const addBtn1 = document.getElementById('add-btn-1');
const countElement = document.getElementById('count');

const App = (container: HTMLElement) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2( 1, 1 );

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('green');
  scene.add(new THREE.AxesHelper(20));

  const camera = createCamera();
  createLights();
  createControls();

  const renderer = createRenderer();
  container.appendChild(renderer.domElement);

  const stats = Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener( 'mousemove', onMouseMove );
  addBtn?.addEventListener('click', (e) => onAddHandler(e, render));
  addBtn1?.addEventListener('click', (e) => onAddHandler(e, renderLast));

  console.time('init');
  const instancedBoxes = new Boxes(data as any as DataItem[]);
  scene.add(instancedBoxes.mesh);
  console.timeEnd('init');

  scene.add(Lines({ items: linesData as any as Point2D[], offset: linesOffset }));
  render();

	updateCount();
  stats.update();

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      35, // FOV
      container.clientWidth / container.clientHeight,
      0.1, // near clipping plane
      1000, // far clipping plane
    );
    camera.position.set(-4, 4, 200);
    return camera;
  }

  function createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 7); // soft white light
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(100, 100, 1);
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0xffffff, 3);
    spotLight2.position.set(-100, 100, 1);
    scene.add(spotLight2);
  }

  function createControls() {
    const controls = new OrbitControls(camera, container);
    //static
    controls.addEventListener('change', render);
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    //renderer.gammaFactor = 2.2;
    //renderer.gammaOutput = true;

    renderer.physicallyCorrectLights = true;
    return renderer;
  }

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

  function onMouseMove(e: MouseEvent) {
    e.preventDefault();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const mesh = instancedBoxes.mesh;

    const intersection = raycaster.intersectObject( mesh );

    if ( intersection.length > 0 ) {
      const instanceId = intersection[0].instanceId;
      console.log(instanceId)

    }
  }

  function onAddHandler(e: MouseEvent, renderFn: () => void) {
    e.preventDefault();

    const shift = (data as any as []).length - initialDataLength + BLOCK_X_GAP;
    const newItem: DataItem = [
      nanoid(),
      [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
      getRandomPaletteColorName(),
    ];

    (data as any as DataItem[]).push(newItem);
    updateCount();

    renderFn();

    stats.update();
  }

  function updateCount() {
    if (countElement) {
      countElement.innerText = (data as any as []).length.toString();
    }
  }
}

export default App;
