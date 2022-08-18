import { getRandomInt } from "../utils/getRandomInt";
import { palettesColorsKeys } from "./palettesColors";

const max = palettesColorsKeys.length - 1;

export const getRandomPaletteColorName = () => palettesColorsKeys[getRandomInt(0, max)];

