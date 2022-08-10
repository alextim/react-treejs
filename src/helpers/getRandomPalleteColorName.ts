import { palettesMaterialsColors } from "./palettesMatertials";
import { getRandomInt } from "../utils/getRandomInt";

const max = palettesMaterialsColors.length - 1;

const getRandomPaletteColorName = () => palettesMaterialsColors[getRandomInt(0, max)];

export default getRandomPaletteColorName;
