import { createSelector } from "../packages.js";

export const getRegExp = createSelector(
  state => state.regExpString,
  regExpString => {
    let value;
    try {
      value = new RegExp(regExpString);
    } catch (error) {
      value = error;
    }
    return value;
  }
);
