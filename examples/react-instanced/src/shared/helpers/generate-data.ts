// import { getRandomColor } from '../utils/getRandomColor';
import { nanoid } from 'nanoid';
import { getRandomPaletteColorName } from './getRandomPalleteColorName';
import { getRandomInt } from '../utils/getRandomInt';
import type { DataItem, Point2D } from '../types';

import { BOX_SIZE, BLOCK_Z_GAP, BLOCK_X_GAP, COLUMN_IN_BLOCK, BOXES_IN_COLUMN } from '../constants';

import { options } from '../options';

const { blocksX, blocksZ, minColumnsInBlock } = options;

export function generateItemsData() {
  const data: DataItem[] = [];
  // const linesData: Point2D[] = [];

  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < blocksX; i++) {
    x += BOX_SIZE + BLOCK_X_GAP;
    if (i % 10 === 0) {
      x += BLOCK_Z_GAP;
    }
    for (let j = 0; j < blocksZ; j++) {
      z = j * (COLUMN_IN_BLOCK * BOX_SIZE + BLOCK_Z_GAP);

      // linesData.push([x, z]);

      const kMax = getRandomInt(minColumnsInBlock, COLUMN_IN_BLOCK); // palettes in row

      for (let k = 0; k < kMax; k++) {
        z += BOX_SIZE;
        y = 0;
        const lMax = getRandomInt(1, BOXES_IN_COLUMN); // palettes in column
        for (let l = 0; l < lMax; l++) {
          data.push({
            id: nanoid(),
            pos: [x, y, z],
            color: getRandomPaletteColorName(),
          });
          y += BOX_SIZE;
        }
      }
    }
  }

  return data;
}

export function generateLinesData() {
  const linesData: Point2D[] = [];

  let x = 0;
  let z = 0;

  for (let i = 0; i < blocksX; i++) {
    x += BOX_SIZE + BLOCK_X_GAP;
    if (i % 10 === 0) {
      x += BLOCK_Z_GAP;
    }
    for (let j = 0; j < blocksZ; j++) {
      z = j * (COLUMN_IN_BLOCK * BOX_SIZE + BLOCK_Z_GAP);

      linesData.push([x, z]);
    }
  }

  return linesData;
}
