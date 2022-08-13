import * as THREE from 'three';
import palettesMaterials from './palettesMatertials';

const defaultMaterial = new THREE.MeshBasicMaterial ({ color: 0xff0000 });
const getDefaultMaterial = () => {
  console.log('defaultMaterial');
  return defaultMaterial;
};

const getPaletteMaterial = (color: string | undefined) => color && palettesMaterials[color] ? palettesMaterials[color] : getDefaultMaterial();


export default getPaletteMaterial;
