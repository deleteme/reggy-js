import { createSelector, createStructuredSelector } from "../packages.js";

const getFlags = createStructuredSelector({
  global: state => state.global,
  ignoreCase: state => state.ignoreCase,
});

const getFlagsString = createSelector(
  getFlags,
  (global, ignoreCase) => {
    return `${global ? 'g' : ''}`;
  }
)

export const getRegExp = createSelector(
  state => state.regExpString,
  getFlags,
  (regExpString, flags) => {
    let value;
    try {
      const flags = Object.entries({
        g: global,
        i: ignoreCase,
      }).reduce((flags, [key, value]) => (value ? flags + key : flags), "");
      value = new RegExp(regExpString, flags);
    } catch (error) {
      value = error;
    }
    return value;
  }
);
