import { html, repeat } from "../packages.js";
import { preview } from "./preview.js";
import { getMatch } from "../selectors.js";

export const testStringPanel = ({ state, setState, handler }) => {
  const match = getMatch(state);
  return html`
    <section class="panel test-string-panel-input-mask">
      <section class="panel test-string-panel">
        <header class="panel-header">
          <label class="label" for="test-string">
            Test String
          </label>
          ${ match ? html`<span class="match-length">${match.length}</span>` : '' }
        </header>
        <textarea
          name="testString"
          id="test-string"
          class="textarea"
          @keydown=${({ target }) => {
            requestAnimationFrame(() => {
              // the event target value is set
              // by the time this is called
              handler({ target });
            });
          }}
          @change=${handler}
          spellcheck="false"
        >${state.testString}</textarea>
      </section>
      <section class="panel preview-panel">
        <label class="label">Preview</label>
        <pre class="preview">${preview({ state })}</pre>
      </section>
    </section>
  `;
};
