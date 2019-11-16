import { render, html } from 'https://cdn.jsdelivr.net/npm/lit-html@1.1.2';
console.log(render, html);

const appElement = document.getElementById('app');

const app = () => {
  return html`
    <div class="panels">
      <section class="panel regexp-panel">
        <label>Regular Expression</label>
        <textarea name="regexp" class="field">ahoy</textarea>
      </section>
      <section class="panel">
        <label>Test String</label>
        <textarea name="test-string" class="field">chips ahoy</textarea>
      </section>
      <section class="panel">
        <label>Preview</label>
        <pre id="preview" class="preview"></pre>
      </section>
    </div>
  `;
}

render(app, appElement);

