import App from './App';
import * as THREE from 'three';
import './index.css';


const container = document.getElementById('scene-container');
if (!container) {
  throw new Error('No #scene-container');
}
App(container);

/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

renderer.render( scene, camera );
*/
