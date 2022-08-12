import path from 'node:path';
import fs from 'node:fs';

import { options } from '../src/index';

import { generateData } from '../src/helpers';


const { data, linesData } = generateData(options.blocksX, options.blocksZ, options.minColumnsInBlock);

const destFolder = path.join(process.cwd(), 'dist');
const palettesFilename = 'palettes.json';
const blocksFilename = 'blocks.json';


fs.writeFileSync(path.join(destFolder, palettesFilename), JSON.stringify(data),);
fs.writeFileSync(path.join(destFolder, blocksFilename), JSON.stringify(linesData));
