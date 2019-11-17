import { createSelector, classMap } from "../packages.js";

export const getRegExp = createSelector(
  state => state.regExpString,
  state => state.global,
  (regExpString, global) => {
    let value;
    try {
      const flags = Object.entries({
        g: global
      }).reduce((flags, [key, value]) => (value ? flags + key : flags), "");
      value = new RegExp(regExpString, flags);
    } catch (error) {
      value = error;
    }
    return value;
  }
);
