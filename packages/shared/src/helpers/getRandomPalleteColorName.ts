import { palettesMaterialsColors } from "./palettesMatertials";
import { getRandomInt } from "../utils/getRandomInt";

const max = palettesMaterialsColors.length - 1;

export const getRandomPaletteColorName = () => palettesMaterialsColors[getRandomInt(0, max)];

