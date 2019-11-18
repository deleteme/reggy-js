import { html } from "../packages.js";
import { getRegExp } from "../selectors.js";
import { regExpPanel } from "./regexp-panel.js";
import { testStringPanel } from "./test-string-panel.js";
import { classMap } from '../lib/class-map.js';

export const app = ({ state, setState }) => {
  const handler = e => {
    const { value, name } = e.target;
    setState({ [name]: value });
  };
  const regExp = getRegExp(state);
  return html`
    <div
      class="${
        classMap({
          panels: true,
          "has-error": regExp instanceof Error
        })
      }"
    >
      ${regExpPanel({ state, setState, handler })}
      ${testStringPanel({ state, setState, handler })}
    </div>
  `;
};
