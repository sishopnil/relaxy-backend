export const sfc32 = (
  a = new Date().getTime(),
  b = 581234,
  c = 564321,
  d = 147852,
) => {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  let t = (a + b) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  d = (d + 1) | 0;
  t = (t + d) | 0;
  c = (c + t) | 0;
  return (t >>> 0) / 4294967296;
};

export const shuffle = (
  arrayData: any[],
  seed: number = new Date().getTime(),
): any[] => {
  let currentIndex = arrayData.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(sfc32(seed) * currentIndex);
    currentIndex--;
    [arrayData[currentIndex], arrayData[randomIndex]] = [
      arrayData[randomIndex],
      arrayData[currentIndex],
    ];
  }
  return arrayData;
};
