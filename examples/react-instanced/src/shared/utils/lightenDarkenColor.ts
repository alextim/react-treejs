const checkRange = (n: number) => {
  if (n > 255) {
    return 255;
  }
  if (n < 0) {
    return 0;
  }
  return n;
}

export function lightenDarkenColor(num: number, percent: number) {
  const amt = Math.round(2.55 * percent);

  // var num = parseInt(col, 16);
  const r = checkRange((num >> 16) + amt);
  const b = checkRange(((num >> 8) & 0x00FF) + amt);
  const g = checkRange((num & 0x0000FF) + amt);

  const newColor = g | (b << 8) | (r << 16);
  return newColor;
}

