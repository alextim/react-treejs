// import { getRandomColor } from '../utils/getRandomColor';
import shortid from 'shortid';
import getRandomColor from './getRandomPalleteColorName';
import { getRandomInt } from '../utils/getRandomInt';
import type { DataItem, Point2D } from '../../types';

import { BOX_SIZE, BLOCK_Z_GAP, BLOCK_X_GAP, COLUMN_IN_BLOCK, BOXES_IN_COLUMN } from '../index';

export function generateData(blocksX: number, blocksZ: number, minColumnsInBlock: number) {
  const data: DataItem[] = [];
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

      for (let k = 0, y = 0; k < kMax; k++) {
        z += BOX_SIZE;
        const lMax = getRandomInt(1, BOXES_IN_COLUMN); // palettes in column
        for (let l = 0; l < lMax; l++) {
          data.push({
            id: shortid.generate(),
            position: [x, y, z],
            color: getRandomColor(),
          });
          y += BOX_SIZE;
        }
      }
    }
  }

  return { data, linesData };
}
