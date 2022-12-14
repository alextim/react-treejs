export const palettesColors: Record<string, number> = {
  plum: 0xff00ff,
  orange: 0x00ffff,
  aquamarine: 0x0000ff,
  frame: 0x000000,
  active: 0xffff00,
  selected: 0xffff00,
  defective: 0xffd0d3,
  stringer: 0xa0522d,
} as const;

export type PalettesColors = keyof typeof palettesColors

export const palettesColorsKeys = Object.keys(palettesColors) as PalettesColors[];
