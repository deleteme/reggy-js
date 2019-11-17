import { createSelector } from "https://cdn.jsdelivr.net/npm/reselect@4.0.0/es/index.js";

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
