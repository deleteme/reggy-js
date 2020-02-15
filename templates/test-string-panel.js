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

export const testStringPanel = ({ state, dispatch, handler }) => {
  const handleTestString = ({ target }) => {
    requestAnimationFrame(() => {
      // the event target value is set
      // by the time this is called
      handler({ target });
    });
  };
  const handleScrollTop = element => {
    dispatch({
      type: 'INPUT_CHANGED',
      name: 'testStringPanelScrollTop',
      value: element.scrollTop
    }, false);
  };
  const handleScroll = (e) => {
    handleScrollTop(e.target);
  };
  const handlePaste = (e) => {
    handleScrollTop(e.target);
    dispatch({ type: 'PASTE', didRecentlyPaste: true }, false);
  };
  return html`
    <section class="panel test-string-panel-input-mask debug">
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
          @scroll=${handleScroll}
          @paste=${handlePaste}
          spellcheck="false"
        >${state.testString}</textarea>
      </section>
      <section class="panel preview-panel">
        <label class="label">Preview</label>
        ${preview({ state })}
      </section>
    </section>
  `;
};
