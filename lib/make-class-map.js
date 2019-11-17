export const makeClassMap = delimiter => map => {
  return Object.entries(map)
    .filter(([key, value]) => value)
    .map(([key]) => key)
    .join(delimiter);
};
