import { BOX_SIZE,  BLOCK_X_GAP, COLUMN_IN_BLOCK } from '../constants';

const linesOffset = [
  (BOX_SIZE + BLOCK_X_GAP / 2) / 2,                          // dx
  -.4,                                                       // dz1 // BLOCK_X_GAP / 2;
  COLUMN_IN_BLOCK * BOX_SIZE + (BOX_SIZE + BLOCK_X_GAP) / 2, // dz2
] as const;

export default linesOffset;
