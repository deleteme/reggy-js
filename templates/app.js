import { html } from "../packages.js";
import { getRegExp } from "../selectors.js";
import { regExpPanel } from "./regexp-panel.js";
import { testStringPanel } from "./test-string-panel.js";
import { classMap } from '../lib/class-map.js';

export const app = ({ state, dispatch }) => {
  if (state === null) {
    return html`<span>loading</span>`;
  }
  const handler = e => {
    const { value, name } = e.target;
    dispatch({ type: 'INPUT_CHANGED', name, value });
  };
  const regExp = getRegExp(state);
  return html`
    <div
      class="${
        classMap({
          panels: true,
          "has-error": regExp instanceof Error,
          debug: state.debug
        })
      }"
    >
      ${regExpPanel({ state, dispatch, handler })}
      ${testStringPanel({ state, dispatch, handler })}
    </div>
  `;
};
