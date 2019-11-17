import {
  render,
  html
} from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.js";
import { getState, setState } from "./store.js";

const app = state => {
  const handleChange = e => {
    const { value, name } = 
  }
  return html`
    <div class="panels">
      <section class="panel regexp-panel">
        <label>Regular Expression</label>
        <textarea name="regexp" class="field" @change=${
  e => {
    console.log('change',e );
  }
}>${state.regExpString}</textarea>
      </section>
      <section class="panel">
        <label>Test String</label>
        <textarea name="test-string" class="field">${state.testString}</textarea>
      </section>
      <section class="panel">
        <label>Preview</label>
        <pre class="preview"></pre>
      </section>
    </div>
  `;
};

const renderApp = () => {
  const state = getState();
  render(app(state), document.getElementById("app"));
};

renderApp();
