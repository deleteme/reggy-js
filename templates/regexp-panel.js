import { html } from "../packages.js";

export const regExpPanel = ({ state, setState, handler }) => {
  return html`
    <section class="panel regexp-panel">
      <label for="regexp-string">Regular Expression</label>
      <textarea
        name="regExpString"
        id="regexp-string"
        class="field"
        @keyup=${handler}
        @change=${handler}
      >
${state.regExpString}</textarea
      >
      <input type="checkbox" id="global" name="global" @change={handler} checked=${state.global}/>
      <label for="global">
        Global
      </label
    </section>
  `;
};
