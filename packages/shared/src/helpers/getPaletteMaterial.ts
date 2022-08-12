import * as THREE from 'three';
import palettesMaterials from './palettesMatertials';

const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const getPaletteMaterial = (color: string | undefined) => color && palettesMaterials[color] ? palettesMaterials[color] : defaultMaterial;


export default getPaletteMaterial;
