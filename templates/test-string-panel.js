import { html, repeat } from "../packages.js";
import { preview } from "./preview.js";

export const testStringPanel = ({ state, setState, handler }) => {
  return html`
    <section class="panel test-string-panel-input-mask">
      <section class="panel test-string-panel">
        <label class="label" for="test-string">Test String</label>
        <textarea
          name="testString"
          id="test-string"
          class="textarea"
          @keyup=${handler}
          @change=${handler}
          spellcheck="false"
        >${state.testString}</textarea
      >
      </section>
      <section class="panel preview-panel">
        <label class="label">Preview</label>
        <pre class="preview">${preview({ state })}</pre>
      </section>
    </section>
  `;
};
