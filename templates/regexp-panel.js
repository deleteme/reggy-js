import { html } from "../packages.js";

export const regExpPanel = ({ state, setState, handler }) => {
  return html`
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
  `;
};
