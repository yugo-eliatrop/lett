export const round = (value: number, didgitsAfterPoint = 1) => {
  const denominator = 10 ** didgitsAfterPoint;
  return Math.round(value * denominator) / denominator;
};
