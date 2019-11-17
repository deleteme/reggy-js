import { createSelector, createStructuredSelector } from "../packages.js";
import { makeClassMap } from './lib/make-class-map.js';

const classMap = makeClassMap('');

const getFlags = createStructuredSelector({
  g: state => state.global,
  i: state => state.ignoreCase
});

const getFlagsString = createSelector(
  getFlags,
  (flags) => {
    return classMap(flags);
  }
);

export const getRegExp = createSelector(
  state => state.regExpString,
  getFlagsString,
  (regExpString, flags) => {
    let value;
    try {
      value = new RegExp(regExpString, flags);
    } catch (error) {
      value = error;
    }
    return value;
  }
);
