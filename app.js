import {
  render,
  html
} from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.js";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/directives/unsafe-html.js";
import { getState, setState as _setState } from "./store.js";
import { getRegExp } from "./selectors.js";

const preview = state => {
  let content = "";
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    //const regexp = new RegExp(state.regExpString);
    // console.log(regexp);
    const { testString } = state;
    const match = testString.match(regexp);
    // console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        [...new Set(match)],
        `<span class="match">$&</span>`
      );

      content = unsafeHTML(formatted);
    } else {
      content = testString;
    }
    //    document.body.classList.toggle("has-error", false);
  } else {
    //  document.body.classList.toggle("has-error", true);
    content = `<span class="syntax-error">${regexp}</span>`;
  }
  return html`${content}`;
};

const app = state => {
  const handler = e => {
    const { value, name } = e.target;
    setState({ [name]: value });
  };
  return html`
    <div class="panels">
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
