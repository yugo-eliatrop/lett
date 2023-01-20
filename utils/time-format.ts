export const toMMSS = (value: number): string => {
  const sec = ~~(value % 60);
  const min = ~~(value / 60);
  return `${min}:${sec > 9 ? sec : `0${sec}`}`
};
