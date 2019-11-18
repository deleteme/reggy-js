import { html } from "../packages.js";
import { getRegExp } from "../selectors.js";
import { preview } from "./preview.js";
import { regExpPanel } from "./regexp-panel.js";
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
        classMap({ panels: true, "has-error": regExp instanceof Error })
      }"
    >
      ${regExpPanel({ state, setState, handler })}
      <section class="panel">
        <label class="label" for="test-string">Test String</label>
        <textarea
          name="testString"
          id="test-string"
          class="textarea"
          @keyup=${handler}
          @change=${handler}
          spellcheck="false"
        >
${state.testString}</textarea
        >
      </section>
      <section class="panel">
        <label class="label">Preview</label>
        <pre class="preview">${preview({ state })}</pre>
      </section>
    </div>
  `;
};
