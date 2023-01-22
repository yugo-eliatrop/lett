export const toMMSS = (value: number): string => {
  const sec = ~~(value % 60);
  const min = ~~(value / 60);
  return `${min}:${sec > 9 ? sec : `0${sec}`}`
};

export const toDDMMYY = (date: string | Date): string => {
  const d = new Date(date);
  const extendTo2Symbols = (value: number): string => `${value < 9 ? '0' : ''}${value}`;
  return [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100].map(extendTo2Symbols).join('.');
};
