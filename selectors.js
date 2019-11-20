import { createSelector, createStructuredSelector } from "./packages.js";
import { makeClassMap } from "./lib/make-class-map.js";

const classMap = makeClassMap("");

const getFlags = createStructuredSelector({
  g: state => state.global,
  i: state => state.ignoreCase,
  m: state => state.multiline
});

const getFlagsString = createSelector(
  getFlags,
  classMap
);

export const getRegExp = createSelector(
  state => state.regExpString,
  getFlagsString,
  (regExpString, flags) => {
    try {
      return new RegExp(regExpString, flags);
    } catch (error) {
      return error;
    }
  }
);

export const getMatch = createSelector(
  state => state.testString,
  getRegExp,
  (testString, regexp) => {
    return regexp instanceof RegExp ? testString.match(regexp) : null;
  }
);
