export const log = <T extends unknown>(label: string) => (x: T) => {
  console.log(label, x);
  return x;
}