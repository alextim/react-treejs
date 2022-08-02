function getHash(str: string) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return hash;
}

//https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
function stringToHex(str: string) {
  const hash = getHash(str);

  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 255;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

export function getRandomColor() {
  const result = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return stringToHex(result);
}

