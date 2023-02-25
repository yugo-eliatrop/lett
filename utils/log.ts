export const log =
  <T>(label: string) =>
  (x: T) => {
    console.log(label, x);
    return x;
  };
