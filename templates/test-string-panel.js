import { html, repeat } from "../packages.js";
import { preview } from "./preview.js";
import { getMatch } from "../selectors.js";

const renderMatchCount = ({ state }) => {
  const match = getMatch(state);
  return match
    ? html`
        <small class="match-length"
          >${match.length} ${match.length === 1 ? "match" : "matches"}</small
        >
      `
    : "";
};

export const testStringPanel = ({ state, setState, handler }) => {
  const handleTestString = ({ target }) => {
    requestAnimationFrame(() => {
      // the event target value is set
      // by the time this is called
      handler({ target });
    });
  };
  return html`
    <section class="panel test-string-panel-input-mask">
      <section class="panel test-string-panel">
        <header class="panel-header">
          <label class="label" for="test-string">
            Test String
          </label>
          ${renderMatchCount({ state })}
        </header>
        <textarea
          name="testString"
          id="test-string"
          class="textarea"
          @input=${handleTestString}
          spellcheck="false"
        >
${state.testString}</textarea
        >
      </section>
      <section class="panel preview-panel">
        <label class="label">Preview</label>
        <pre class="preview">${preview({ state })}</pre>
      </section>
    </section>
  `;
};
