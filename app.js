import {
  render,
  html
} from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.js";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/directives/unsafe-html.js";
import { getState, setState as _setState } from "./store.js";
import { getRegExp } from "./selectors.js";
import { classMap } from 'https://cdn.jsdelivr.net/npm/lit-html@1.1.2/directives/class-map.js';

const preview = state => {
  let content = "";
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    const { testString } = state;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        [...new Set(match)],
        `<span class="match">$&</span>`
      );
      content = unsafeHTML(formatted);
    } else {
      content = testString;
    }
  } else {
    content = unsafeHTML(`<span class="syntax-error">${regexp}</span>`);
  }
  return html`${content}`;
};

const app = state => {
  const handler = e => {
    const { value, name } = e.target;
    setState({ [name]: value });
  };
  const regExp = getRegExp(state);
  return html`
    <div class=${classMap({ panels: true, 'has-error': regExp instanceof Error })}>
      <section class="panel regexp-panel">
        <label>Regular Expression</label>
        <textarea
          name="regExpString"
          class="field"
          @keyup=${handler}
          @change=${handler}
        >
${state.regExpString}</textarea
        >
      </section>
      <section class="panel">
        <label>Test String</label>
        <textarea
          name="testString"
          class="field"
          @keyup=${handler}
          @change=${handler}
        >
${state.testString}</textarea
        >
      </section>
      <section class="panel">
        <label>Preview</label>
        <pre class="preview">${preview(state)}</pre>
      </section>
    </div>
  `;
};

const renderApp = () => {
  const state = getState();
  render(app(state), document.getElementById("app"));
};

const setState = newState => {
  _setState(newState);
  requestAnimationFrame(renderApp);
};

renderApp();
