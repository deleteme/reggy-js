import {
  render,
  html
} from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.js";
import { getState, setState as _setState } from "./store.js";

const preview = (state) => {
  try {
    const regexp = new RegExp(state.regExpString);
    console.log(regexp);
    const testString = testStringElement.value;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        [...new Set(match)],
        `<span class='match'>$&</span>`
      );

      previewElement.innerHTML = formatted;
    } else {
      previewElement.innerHTML = testString;
    }
    document.body.classList.toggle("has-error", false);
  } catch (error) {
    document.body.classList.toggle("has-error", true);
    previewElement.innerHTML = `<span class="syntax-error">${error}</span>`;
  }

  return html`

  `;
}

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
          @keydown=${handler}
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
          @keydown=${handler}
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
  renderApp();
};

renderApp();
