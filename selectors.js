import { createSelector, createStructuredSelector } from "../packages.js";
import { makeClassMap } from "./lib/make-class-map.js";

const classMap = makeClassMap("");

const getFlags = createStructuredSelector({
  g: state => state.global,
  i: state => state.ignoreCase
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
