export const makeClassMap = delimiter => map => {
  return Object.entries(map)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(delimiter);
};
