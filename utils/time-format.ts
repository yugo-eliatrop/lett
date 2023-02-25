export const toMMSS = (value: number): string => {
  const sec = ~~(value % 60);
  const min = ~~(value / 60);
  return `${min}:${sec > 9 ? sec : `0${sec}`}`;
};

export const toDDMMYY = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const extendTo2Symbols = (value: number): string => `${value < 10 ? '0' : ''}${value}`;
  return [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100].map(extendTo2Symbols).join('.');
};
