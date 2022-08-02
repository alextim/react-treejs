import type { Point2D, Point3D } from '../types';
import { getRandomColor } from '../utils/getRandomColor';
import { getRandomInt } from '../utils/getRandomInt';

const BOX_SIZE = 1;
const BLOCK_Z_GAP = 3;
const BLOCK_X_GAP = 0.2;
const COLUMN_IN_BLOCK = 10;
const BOXES_IN_COLUMN = 6;

export const linesOffset = [
  (BOX_SIZE + BLOCK_X_GAP / 2) / 2,                          // dx
  -.4,                                                       // dz1 // BLOCK_X_GAP / 2; 
  COLUMN_IN_BLOCK * BOX_SIZE + (BOX_SIZE + BLOCK_X_GAP) / 2, // dz2
] as const;

export function generateData(blocksX: number, blocksZ: number, minColumnsInBlock: number) {
  const data: Array<{ position: Point3D, color: string}> = [];
  const linesData: Point2D[] = [];

  for (let i = 0, x = 0; i < blocksX; i++) {
    x += BOX_SIZE + BLOCK_X_GAP;
    if (i % 10 === 0) {
      x += BLOCK_Z_GAP;
    }
    for (let j = 0; j < blocksZ; j++) {
      let z = j * (COLUMN_IN_BLOCK * BOX_SIZE + BLOCK_Z_GAP);

      linesData.push([x, z]);
     
      const kMax = getRandomInt(minColumnsInBlock, COLUMN_IN_BLOCK); // palettes in row
      const color = getRandomColor();

      for (let k = 0, y = 0; k < kMax; k++) {
        z += BOX_SIZE;
        const lMax = getRandomInt(1, BOXES_IN_COLUMN); // palettes in column
        for (let l = 0; l < lMax; l++) {
          data.push({ position: [ x, y, z ], color });
          y += BOX_SIZE;
        }
      }
    }
  }

  return { data, linesData };
}
